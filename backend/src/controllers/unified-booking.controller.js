import { bookingService } from '../services/booking.service.js';
import { borrowService } from '../services/borrow.service.js';

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason, type } = req.body; // type: 'service' | 'resource'
    
    let result;
    
    if (type === 'service') {
      result = await bookingService.cancelBooking(bookingId, req.user.id, reason);
    } else if (type === 'resource') {
      result = await borrowService.cancelRequest(bookingId, req.user.id, reason);
    } else {
      // Auto-detect booking type by trying both
      try {
        result = await bookingService.cancelBooking(bookingId, req.user.id, reason);
      } catch (serviceError) {
        try {
          result = await borrowService.cancelRequest(bookingId, req.user.id, reason);
        } catch (resourceError) {
          throw new Error('Booking not found or unauthorized');
        }
      }
    }

    res.json({
      success: true,
      data: result,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};