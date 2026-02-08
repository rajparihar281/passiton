import apiClient from './api';
import type { ApiResponse, Notification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch('/api/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/notifications/${id}`);
    return response.data;
  },
};