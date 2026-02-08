import express from 'express';
import { getProfile, getMyProfile, updateProfile, getProfileReviews, getMyServiceBookings, getMyResourceBookings } from '../controllers/additional.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyProfile);
router.get('/me/service-bookings', authMiddleware, getMyServiceBookings);
router.get('/me/resource-bookings', authMiddleware, getMyResourceBookings);
router.get('/:id', getProfile);
router.put('/me', authMiddleware, updateProfile);
router.get('/:id/reviews', getProfileReviews);

export default router;
