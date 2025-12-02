const { TimelineEvent, Wedding } = require('../models');

// @desc    Get all timeline events for a wedding
// @route   GET /api/weddings/:weddingId/timeline
// @access  Private
exports.getTimelineEvents = async (req, res) => {
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

    const events = await TimelineEvent.findAll({
      where: { weddingId: req.params.weddingId },
      order: [['eventDate', 'ASC'], ['startTime', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new timeline event
// @route   POST /api/weddings/:weddingId/timeline
// @access  Private
exports.createTimelineEvent = async (req, res) => {
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
    const event = await TimelineEvent.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update timeline event
// @route   PUT /api/timeline/:id
// @access  Private
exports.updateTimelineEvent = async (req, res) => {
  try {
    let event = await TimelineEvent.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    if (event.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    event = await event.update(req.body);

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete timeline event
// @route   DELETE /api/timeline/:id
// @access  Private
exports.deleteTimelineEvent = async (req, res) => {
  try {
    const event = await TimelineEvent.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found'
      });
    }

    if (event.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await event.destroy();

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
