import express from 'express';
import { body } from 'express-validator';
import { createSession, getSession, placeBid, acceptBid, sendMessage, withdrawBid, rejectBid, counterOffer, closeSession } from '../controllers/bidding.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/sessions',
  authMiddleware,
  [
    body('listing_id').notEmpty().withMessage('Listing ID is required'),
    body('listing_type').isIn(['item', 'service']).withMessage('Valid listing type required'),
    validate,
  ],
  createSession
);

router.get('/sessions/:listing_type/:listing_id', getSession);

router.post(
  '/sessions/:session_id/bids',
  authMiddleware,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
    validate,
  ],
  placeBid
);

router.patch('/sessions/:session_id/bids/:bid_id/accept', authMiddleware, acceptBid);
router.patch('/sessions/:session_id/bids/:bid_id/reject', authMiddleware, rejectBid);
router.patch('/sessions/:session_id/bids/:bid_id/withdraw', authMiddleware, withdrawBid);

router.post(
  '/sessions/:session_id/counter-offer',
  authMiddleware,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
    body('bidder_id').notEmpty().withMessage('Bidder ID required'),
    validate,
  ],
  counterOffer
);

router.patch('/sessions/:session_id/close', authMiddleware, closeSession);

router.post(
  '/sessions/:session_id/messages',
  authMiddleware,
  [
    body('message').notEmpty().withMessage('Message is required'),
    validate,
  ],
  sendMessage
);

export default router;