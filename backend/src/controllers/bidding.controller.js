import { biddingService } from '../services/bidding.service.js';

export const createSession = async (req, res, next) => {
  try {
    const { listing_id, listing_type, ends_at } = req.body;
    const session = await biddingService.createSession(listing_id, listing_type, req.user.id, ends_at);
    
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const { listing_id, listing_type } = req.params;
    const session = await biddingService.getSession(listing_id, listing_type);
    
    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const placeBid = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { amount } = req.body;
    const bid = await biddingService.placeBid(session_id, req.user.id, amount);
    
    res.status(201).json({
      success: true,
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptBid = async (req, res, next) => {
  try {
    const { session_id, bid_id } = req.params;
    const bid = await biddingService.acceptBid(session_id, bid_id, req.user.id);
    
    res.json({
      success: true,
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectBid = async (req, res, next) => {
  try {
    const { session_id, bid_id } = req.params;
    const bid = await biddingService.rejectBid(session_id, bid_id, req.user.id);
    
    res.json({
      success: true,
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawBid = async (req, res, next) => {
  try {
    const { session_id, bid_id } = req.params;
    const bid = await biddingService.withdrawBid(session_id, bid_id, req.user.id);
    
    res.json({
      success: true,
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

export const counterOffer = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { amount, bidder_id } = req.body;
    const offer = await biddingService.counterOffer(session_id, req.user.id, bidder_id, amount);
    
    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const closeSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const session = await biddingService.closeSession(session_id, req.user.id);
    
    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { message } = req.body;
    const messageData = await biddingService.sendMessage(session_id, req.user.id, message);
    
    res.status(201).json({
      success: true,
      data: messageData,
    });
  } catch (error) {
    next(error);
  }
};