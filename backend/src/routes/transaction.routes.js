import express from 'express';
import { getMyTransactions, getTransactionById, confirmHandover, confirmReturn, markAsCompleted, reportDispute } from '../controllers/additional.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/my-transactions', authMiddleware, getMyTransactions);
router.get('/:id', authMiddleware, getTransactionById);
router.patch('/:id/handover', authMiddleware, confirmHandover);
router.patch('/:id/return', authMiddleware, confirmReturn);
router.patch('/:id/complete', authMiddleware, markAsCompleted);
router.patch('/:id/dispute', authMiddleware, reportDispute);

export default router;
