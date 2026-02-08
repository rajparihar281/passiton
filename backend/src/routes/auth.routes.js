import express from 'express';
import { body } from 'express-validator';
import { signup, login, getCurrentUser, logout, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('college_id').notEmpty().withMessage('College ID is required'),
    validate,
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

router.get('/me', authMiddleware, getCurrentUser);

router.post('/logout', authMiddleware, logout);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required'), validate],
  requestPasswordReset
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validate,
  ],
  resetPassword
);

export default router;
