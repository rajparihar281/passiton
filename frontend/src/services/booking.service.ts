import apiClient from './api';
import type { ApiResponse } from '../types';

export const bookingService = {
  getMyBookings: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/api/bookings/my-bookings');
    return response.data;
  },

  getBookingById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/api/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/api/bookings/${id}/status`, { status });
    return response.data;
  },

  createBooking: async (bookingData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/api/bookings', bookingData);
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/api/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};