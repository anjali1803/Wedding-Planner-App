const { Booking, Wedding, Vendor } = require('../models');

// @desc    Get all bookings for a wedding
// @route   GET /api/weddings/:weddingId/bookings
// @access  Private
exports.getBookings = async (req, res) => {
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

    const bookings = await Booking.findAll({
      where: { weddingId: req.params.weddingId },
      include: ['vendor'],
      order: [['bookingDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new booking
// @route   POST /api/weddings/:weddingId/bookings
// @access  Private
exports.createBooking = async (req, res) => {
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
    const booking = await Booking.create(req.body);

    // Fetch booking with vendor details
    const bookingWithVendor = await Booking.findByPk(booking.id, {
      include: ['vendor']
    });

    res.status(201).json({
      success: true,
      data: bookingWithVendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking = await booking.update(req.body);

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: ['wedding']
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.wedding.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await booking.destroy();

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
