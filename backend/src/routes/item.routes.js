import express from 'express';
import { body } from 'express-validator';
import { createItem, getItems, getItemById, getMyItems, updateItem, deleteItem, toggleAvailability, upload } from '../controllers/item.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getItems);

router.get('/my-items', authMiddleware, getMyItems);

router.get('/:id', getItemById);

router.post(
  '/',
  authMiddleware,
  upload.array('images', 5),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('condition').notEmpty().withMessage('Condition is required'),
    body('deposit_amount').optional().isNumeric().withMessage('Deposit amount must be a number'),
    body('rental_price').optional().isNumeric().withMessage('Rental price must be a number'),
    validate,
  ],
  createItem
);

router.put('/:id', authMiddleware, updateItem);

router.delete('/:id', authMiddleware, deleteItem);

router.patch('/:id/availability', authMiddleware, toggleAvailability);

export default router;
