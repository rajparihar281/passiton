import apiClient from './api';
import type { ApiResponse, BorrowRequest, CreateBorrowRequestData } from '../types';

export const borrowService = {
  createRequest: async (data: CreateBorrowRequestData): Promise<ApiResponse<BorrowRequest>> => {
    const response = await apiClient.post('/api/borrow-requests', data);
    return response.data;
  },

  getMyRequests: async (): Promise<ApiResponse<BorrowRequest[]>> => {
    const response = await apiClient.get('/api/borrow-requests/my-requests');
    return response.data;
  },

  getReceivedRequests: async (): Promise<ApiResponse<BorrowRequest[]>> => {
    const response = await apiClient.get('/api/borrow-requests/received');
    return response.data;
  },

  getRequestById: async (id: string): Promise<ApiResponse<BorrowRequest>> => {
    const response = await apiClient.get(`/api/borrow-requests/${id}`);
    return response.data;
  },

  approveRequest: async (id: string): Promise<ApiResponse<BorrowRequest>> => {
    const response = await apiClient.patch(`/api/borrow-requests/${id}/approve`);
    return response.data;
  },

  rejectRequest: async (id: string): Promise<ApiResponse<BorrowRequest>> => {
    const response = await apiClient.patch(`/api/borrow-requests/${id}/reject`);
    return response.data;
  },

  cancelRequest: async (id: string, reason?: string): Promise<ApiResponse<BorrowRequest>> => {
    const response = await apiClient.patch(`/api/borrow-requests/${id}/cancel`, { reason });
    return response.data;
  },
};
