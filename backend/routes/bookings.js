const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/:id')
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router;
