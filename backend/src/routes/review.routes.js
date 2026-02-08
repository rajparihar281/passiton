import express from 'express';
import { body } from 'express-validator';
import { createReview, getReviewsByUser, getReviewsByTransaction } from '../controllers/additional.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
    body('reviewee_id').notEmpty().withMessage('Reviewee ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate,
  ],
  createReview
);

router.get('/user/:userId', getReviewsByUser);
router.get('/transaction/:transactionId', getReviewsByTransaction);

export default router;
