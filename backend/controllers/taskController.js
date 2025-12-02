const { Task, Wedding } = require('../models');

// @desc    Get all tasks for a wedding
// @route   GET /api/weddings/:weddingId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
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

    const tasks = await Task.findAll({
      where: { weddingId: req.params.weddingId },
      order: [['dueDate', 'ASC'], ['priority', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/weddings/:weddingId/tasks
// @access  Private
exports.createTask = async (req, res) => {
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
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // If marking as completed, set completedDate
    if (req.body.status === 'completed' && !task.completedDate) {
      req.body.completedDate = new Date();
    }

    task = await task.update(req.body);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await task.destroy();

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
