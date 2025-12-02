const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getDashboardStats,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
