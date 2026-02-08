import express from 'express';
import { getProfile, updateProfile, getProfileReviews } from '../controllers/additional.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', getProfile);
router.put('/me', authMiddleware, updateProfile);
router.get('/:id/reviews', getProfileReviews);

export default router;
