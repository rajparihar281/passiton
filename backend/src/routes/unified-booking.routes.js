import express from 'express';
import { body } from 'express-validator';
import { cancelBooking } from '../controllers/unified-booking.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.put(
  '/:bookingId/cancel',
  authMiddleware,
  [
    body('reason').optional().isString().withMessage('Reason must be a string'),
    body('type').optional().isIn(['service', 'resource']).withMessage('Type must be service or resource'),
    validate,
  ],
  cancelBooking
);

export default router;