import apiClient from './api';
import type { ApiResponse, Transaction } from '../types';

export const transactionService = {
  getMyTransactions: async (): Promise<ApiResponse<Transaction[]>> => {
    const response = await apiClient.get('/api/transactions/my-transactions');
    return response.data;
  },

  getTransactionById: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.get(`/api/transactions/${id}`);
    return response.data;
  },

  confirmHandover: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.patch(`/api/transactions/${id}/handover`);
    return response.data;
  },

  confirmReturn: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.patch(`/api/transactions/${id}/return`);
    return response.data;
  },

  markAsCompleted: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.patch(`/api/transactions/${id}/complete`);
    return response.data;
  },

  reportDispute: async (id: string, reason: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.patch(`/api/transactions/${id}/dispute`, { reason });
    return response.data;
  },
};
