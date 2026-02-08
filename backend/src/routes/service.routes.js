import express from 'express';
import { body } from 'express-validator';
import { createService, getServices, getServiceById, getMyServices, updateService, deleteService, toggleActive, upload } from '../controllers/service.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getServices);

router.get('/my-services', authMiddleware, getMyServices);

router.get('/:id', getServiceById);

router.post(
  '/',
  authMiddleware,
  upload.array('images', 5),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('pricing_model').optional().isIn(['hourly', 'flat_fee', 'negotiable']).withMessage('Invalid pricing model'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    validate,
  ],
  createService
);

router.put('/:id', authMiddleware, updateService);

router.delete('/:id', authMiddleware, deleteService);

router.patch('/:id/toggle-active', authMiddleware, toggleActive);

export default router;
