import express from 'express';
import { body } from 'express-validator';
import { createBooking, getMyBookings, getBookingById, updateBookingStatus, cancelBooking } from '../controllers/booking.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/my-bookings', authMiddleware, getMyBookings);

router.get('/:id', authMiddleware, getBookingById);

router.post(
  '/',
  authMiddleware,
  [
    body('service_id').notEmpty().withMessage('Service ID is required'),
    body('scheduled_at').notEmpty().withMessage('Scheduled time is required'),
    body('agreed_price').notEmpty().isNumeric().withMessage('Agreed price is required'),
    validate,
  ],
  createBooking
);

router.patch(
  '/:id/status',
  authMiddleware,
  [
    body('status').notEmpty().isIn(['pending', 'accepted', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
    validate,
  ],
  updateBookingStatus
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  [
    body('reason').optional().isString().withMessage('Reason must be a string'),
    validate,
  ],
  cancelBooking
);

export default router;
