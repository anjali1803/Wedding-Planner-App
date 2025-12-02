const { Guest, Wedding } = require('../models');

// @desc    Get all guests for a wedding
// @route   GET /api/weddings/:weddingId/guests
// @access  Private
exports.getGuests = async (req, res) => {
  try {
    // Verify wedding belongs to user
    const wedding = await Wedding.findOne({
      where: { id: req.params.weddingId, userId: req.user.id }
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found'
      });
    }

    const guests = await Guest.findAll({
      where: { weddingId: req.params.weddingId },
      order: [['lastName', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: guests.length,
      data: guests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new guest
// @route   POST /api/weddings/:weddingId/guests
// @access  Private
exports.createGuest = async (req, res) => {
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
    const guest = await Guest.create(req.body);

    // Update guest count
    await wedding.update({
      guestCount: wedding.guestCount + (guest.plusOne ? 2 : 1)
    });

    res.status(201).json({
      success: true,
      data: guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update guest
// @route   PUT /api/guests/:id
// @access  Private
exports.updateGuest = async (req, res) => {
  try {
    let guest = await Guest.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Verify wedding belongs to user
    if (guest.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    guest = await guest.update(req.body);

    res.status(200).json({
      success: true,
      data: guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete guest
// @route   DELETE /api/guests/:id
// @access  Private
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    if (guest.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const wedding = guest.wedding;
    await guest.destroy();

    // Update guest count
    await wedding.update({
      guestCount: Math.max(0, wedding.guestCount - (guest.plusOne ? 2 : 1))
    });

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
