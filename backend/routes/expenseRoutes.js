// routes/expenseRoutes.js
import express from 'express';
import { addExpense,getExpenses,getExpenseById,deleteExpense,updateExpense } from '../controllers/expenseController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/:id', protect, getExpenseById);
router.get('/', protect, getExpenses);
router.delete('/:id', protect, deleteExpense);
router.put('/:id', protect, updateExpense);

export default router;
