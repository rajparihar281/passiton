import express from 'express';
import { body } from 'express-validator';
import { createRequest, getMyRequests, getReceivedRequests, getRequestById, approveRequest, rejectRequest, cancelRequest } from '../controllers/borrow.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('item_id').notEmpty().withMessage('Item ID is required'),
    body('start_date').isISO8601().withMessage('Valid start date is required'),
    body('end_date').isISO8601().withMessage('Valid end date is required'),
    validate,
  ],
  createRequest
);

router.get('/my-requests', authMiddleware, getMyRequests);

router.get('/received', authMiddleware, getReceivedRequests);

router.get('/:id', authMiddleware, getRequestById);

router.patch('/:id/approve', authMiddleware, approveRequest);

router.patch('/:id/reject', authMiddleware, rejectRequest);

router.patch('/:id/cancel', authMiddleware, cancelRequest);

export default router;
