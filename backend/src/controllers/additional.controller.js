import { transactionService } from '../services/transaction.service.js';
import { profileService, collegeService } from '../services/profile.service.js';
import { chatService, reviewService } from '../services/chat.service.js';

// Transaction Controllers
export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getMyTransactions(req.user.id);
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const confirmHandover = async (req, res, next) => {
  try {
    const transaction = await transactionService.confirmHandover(req.params.id, req.user.id);
    res.json({ success: true, data: transaction, message: 'Handover confirmed' });
  } catch (error) {
    next(error);
  }
};

export const confirmReturn = async (req, res, next) => {
  try {
    const transaction = await transactionService.confirmReturn(req.params.id, req.user.id);
    res.json({ success: true, data: transaction, message: 'Return confirmed' });
  } catch (error) {
    next(error);
  }
};

export const markAsCompleted = async (req, res, next) => {
  try {
    const transaction = await transactionService.markAsCompleted(req.params.id, req.user.id);
    res.json({ success: true, data: transaction, message: 'Transaction completed' });
  } catch (error) {
    next(error);
  }
};

export const reportDispute = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const transaction = await transactionService.reportDispute(req.params.id, req.user.id, reason);
    res.json({ success: true, data: transaction, message: 'Dispute reported' });
  } catch (error) {
    next(error);
  }
};

// Profile Controllers
export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.params.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: profile, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

export const getProfileReviews = async (req, res, next) => {
  try {
    const reviews = await profileService.getProfileReviews(req.params.id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// College Controllers
export const getColleges = async (req, res, next) => {
  try {
    console.log('📚 Fetching colleges list...');
    const colleges = await collegeService.getColleges();
    console.log(`✅ Found ${colleges.length} colleges`);
    res.json({ success: true, data: colleges });
  } catch (error) {
    console.error('❌ Error fetching colleges:', error);
    next(error);
  }
};

export const getCollegeById = async (req, res, next) => {
  try {
    const college = await collegeService.getCollegeById(req.params.id);
    res.json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

export const verifyCollegeEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await collegeService.verifyCollegeEmail(email);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Chat Controllers
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getConversations(req.user.id);
    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await chatService.getConversationById(req.params.id, req.user.id);
    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { participantId, itemId } = req.body;
    const conversation = await chatService.createConversation(req.user.id, participantId, itemId);
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getMessages(req.params.id, req.user.id);
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await chatService.sendMessage(req.params.id, req.user.id, content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// Review Controllers
export const createReview = async (req, res, next) => {
  try {
    const { transaction_id, reviewee_id, rating, comment } = req.body;
    const review = await reviewService.createReview({
      transaction_id,
      reviewer_id: req.user.id,
      reviewee_id,
      rating,
      comment,
    });
    res.status(201).json({ success: true, data: review, message: 'Review submitted' });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByUser(req.params.userId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByTransaction = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByTransaction(req.params.transactionId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
