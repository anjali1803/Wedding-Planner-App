const { Wedding, Guest, Booking, BudgetItem, Task, TimelineEvent } = require('../models');

// @desc    Get all weddings for logged in user
// @route   GET /api/weddings
// @access  Private
exports.getWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.findAll({
      where: { userId: req.user.id },
      include: [
        { association: 'guests' },
        { association: 'tasks' },
        { association: 'timelineEvents' }
      ],
      order: [['weddingDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: weddings.length,
      data: weddings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single wedding
// @route   GET /api/weddings/:id
// @access  Private
exports.getWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { association: 'guests' },
        { association: 'bookings', include: ['vendor'] },
        { association: 'budgetItems' },
        { association: 'tasks' },
        { association: 'timelineEvents' }
      ]
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    res.status(200).json({
      success: true,
      data: wedding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new wedding
// @route   POST /api/weddings
// @access  Private
exports.createWedding = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const wedding = await Wedding.create(req.body);

    res.status(201).json({
      success: true,
      data: wedding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update wedding
// @route   PUT /api/weddings/:id
// @access  Private
exports.updateWedding = async (req, res) => {
  try {
    let wedding = await Wedding.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    wedding = await wedding.update(req.body);

    res.status(200).json({
      success: true,
      data: wedding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete wedding
// @route   DELETE /api/weddings/:id
// @access  Private
exports.deleteWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    await wedding.destroy();

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
