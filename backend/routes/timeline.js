const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
} = require('../controllers/timelineController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTimelineEvents)
  .post(protect, createTimelineEvent);

router.route('/:id')
  .put(protect, updateTimelineEvent)
  .delete(protect, deleteTimelineEvent);

module.exports = router;
