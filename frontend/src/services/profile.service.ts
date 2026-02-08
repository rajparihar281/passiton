import apiClient from './api';
import type { ApiResponse, Profile } from '../types';

export const profileService = {
  getMyProfile: async (): Promise<ApiResponse<Profile & { stats: any }>> => {
    const response = await apiClient.get('/api/profiles/me');
    return response.data;
  },

  getProfile: async (id: string): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get(`/api/profiles/${id}`);
    return response.data;
  },

  updateProfile: async (updates: Partial<Profile>): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.put('/api/profiles/me', updates);
    return response.data;
  },

  getMyServiceBookings: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/api/profiles/me/service-bookings');
    return response.data;
  },

  getMyResourceBookings: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/api/profiles/me/resource-bookings');
    return response.data;
  },

  getProfileReviews: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/api/profiles/${id}/reviews`);
    return response.data;
  },
};