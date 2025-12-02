const express = require('express');
const router = express.Router();
const {
  getWeddings,
  getWedding,
  createWedding,
  updateWedding,
  deleteWedding
} = require('../controllers/weddingController');
const { protect } = require('../middleware/auth');

// Guest routes
const guestRouter = require('./guests');
const bookingRouter = require('./bookings');
const budgetRouter = require('./budget');
const taskRouter = require('./tasks');
const timelineRouter = require('./timeline');

router.use('/:weddingId/guests', guestRouter);
router.use('/:weddingId/bookings', bookingRouter);
router.use('/:weddingId/budget', budgetRouter);
router.use('/:weddingId/tasks', taskRouter);
router.use('/:weddingId/timeline', timelineRouter);

router.route('/')
  .get(protect, getWeddings)
  .post(protect, createWedding);

router.route('/:id')
  .get(protect, getWedding)
  .put(protect, updateWedding)
  .delete(protect, deleteWedding);

module.exports = router;
