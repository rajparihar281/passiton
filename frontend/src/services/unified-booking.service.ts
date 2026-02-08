import apiClient from './api';
import type { ApiResponse } from '../types';

export const unifiedBookingService = {
  cancelBooking: async (bookingId: string, reason?: string, type?: 'service' | 'resource'): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/api/unified-bookings/${bookingId}/cancel`, { reason, type });
    return response.data;
  },
};