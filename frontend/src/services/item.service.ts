import apiClient from './api';
import type { ApiResponse, Item, ItemFilters, PaginatedResponse } from '../types';

export const itemService = {
  getItems: async (filters?: ItemFilters, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    params.append('page', String(page));
    params.append('limit', String(limit));
    
    const response = await apiClient.get(`/api/items?${params.toString()}`);
    return response.data;
  },

  getItemById: async (id: string): Promise<ApiResponse<Item>> => {
    const response = await apiClient.get(`/api/items/${id}`);
    return response.data;
  },

  getMyItems: async (): Promise<ApiResponse<Item[]>> => {
    const response = await apiClient.get('/api/items/my-items');
    return response.data;
  },

  createItem: async (formData: FormData): Promise<ApiResponse<Item>> => {
    const response = await apiClient.post('/api/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateItem: async (id: string, data: any): Promise<ApiResponse<Item>> => {
    const response = await apiClient.put(`/api/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/items/${id}`);
    return response.data;
  },

  toggleAvailability: async (id: string): Promise<ApiResponse<Item>> => {
    const response = await apiClient.patch(`/api/items/${id}/availability`);
    return response.data;
  },
};
