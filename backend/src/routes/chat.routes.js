import express from 'express';
import { body } from 'express-validator';
import { getConversations, getConversationById, createConversation, getMessages, sendMessage } from '../controllers/additional.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getConversations);
router.get('/:id', authMiddleware, getConversationById);
router.post(
  '/',
  authMiddleware,
  [body('participantId').notEmpty().withMessage('Participant ID is required'), validate],
  createConversation
);
router.get('/:id/messages', authMiddleware, getMessages);
router.post(
  '/:id/messages',
  authMiddleware,
  [body('content').notEmpty().withMessage('Message content is required'), validate],
  sendMessage
);

export default router;
