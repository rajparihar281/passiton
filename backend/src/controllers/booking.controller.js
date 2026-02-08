import { bookingService } from '../services/booking.service.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, req.user.id, status);

    res.json({
      success: true,
      data: booking,
      message: 'Booking status updated',
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id, reason);

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
