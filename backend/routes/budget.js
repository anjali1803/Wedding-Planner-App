const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBudgetItems)
  .post(protect, createBudgetItem);

router.route('/:id')
  .put(protect, updateBudgetItem)
  .delete(protect, deleteBudgetItem);

module.exports = router;
