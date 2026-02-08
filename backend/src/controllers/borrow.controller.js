import { borrowService } from '../services/borrow.service.js';

export const createRequest = async (req, res, next) => {
  try {
    const { item_id, start_date, end_date, message } = req.body;

    const request = await borrowService.createRequest({
      item_id,
      borrower_id: req.user.id,
      start_date,
      end_date,
      message,
    });

    res.status(201).json({
      success: true,
      data: request,
      message: 'Borrow request created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await borrowService.getMyRequests(req.user.id);

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await borrowService.getReceivedRequests(req.user.id);

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await borrowService.getRequestById(req.params.id);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const request = await borrowService.approveRequest(req.params.id, req.user.id);

    res.json({
      success: true,
      data: request,
      message: 'Request approved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const request = await borrowService.rejectRequest(req.params.id, req.user.id);

    res.json({
      success: true,
      data: request,
      message: 'Request rejected',
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const request = await borrowService.cancelRequest(req.params.id, req.user.id, reason);

    res.json({
      success: true,
      data: request,
      message: 'Request cancelled',
    });
  } catch (error) {
    next(error);
  }
};
