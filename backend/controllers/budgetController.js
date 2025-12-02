const { BudgetItem, Wedding } = require('../models');

// @desc    Get all budget items for a wedding
// @route   GET /api/weddings/:weddingId/budget
// @access  Private
exports.getBudgetItems = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      where: { id: req.params.weddingId, userId: req.user.id }
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    const budgetItems = await BudgetItem.findAll({
      where: { weddingId: req.params.weddingId },
      order: [['category', 'ASC']]
    });

    // Calculate totals
    const totalEstimated = budgetItems.reduce((sum, item) => sum + parseFloat(item.estimatedCost), 0);
    const totalActual = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualCost), 0);
    const remaining = wedding.totalBudget - totalActual;

    res.status(200).json({
      success: true,
      count: budgetItems.length,
      data: budgetItems,
      summary: {
        totalBudget: parseFloat(wedding.totalBudget),
        totalEstimated,
        totalActual,
        remaining
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new budget item
// @route   POST /api/weddings/:weddingId/budget
// @access  Private
exports.createBudgetItem = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      where: { id: req.params.weddingId, userId: req.user.id }
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    req.body.weddingId = req.params.weddingId;
    const budgetItem = await BudgetItem.create(req.body);

    // Update wedding spent amount
    const totalSpent = await BudgetItem.sum('actualCost', {
      where: { weddingId: req.params.weddingId }
    });
    await wedding.update({ spentAmount: totalSpent || 0 });

    res.status(201).json({
      success: true,
      data: budgetItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update budget item
// @route   PUT /api/budget/:id
// @access  Private
exports.updateBudgetItem = async (req, res) => {
  try {
    let budgetItem = await BudgetItem.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!budgetItem) {
      return res.status(404).json({
        success: false,
        message: 'Budget item not found'
      });
    }

    if (budgetItem.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    budgetItem = await budgetItem.update(req.body);

    // Update wedding spent amount
    const totalSpent = await BudgetItem.sum('actualCost', {
      where: { weddingId: budgetItem.weddingId }
    });
    await budgetItem.wedding.update({ spentAmount: totalSpent || 0 });

    res.status(200).json({
      success: true,
      data: budgetItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete budget item
// @route   DELETE /api/budget/:id
// @access  Private
exports.deleteBudgetItem = async (req, res) => {
  try {
    const budgetItem = await BudgetItem.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!budgetItem) {
      return res.status(404).json({
        success: false,
        message: 'Budget item not found'
      });
    }

    if (budgetItem.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const wedding = budgetItem.wedding;
    await budgetItem.destroy();

    // Update wedding spent amount
    const totalSpent = await BudgetItem.sum('actualCost', {
      where: { weddingId: wedding.id }
    });
    await wedding.update({ spentAmount: totalSpent || 0 });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
