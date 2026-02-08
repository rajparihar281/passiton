import apiClient from './api';
import type { ApiResponse, Conversation, Message, College } from '../types';

export const chatService = {
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get('/api/conversations');
    return response.data;
  },

  getConversationById: async (id: string): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.get(`/api/conversations/${id}`);
    return response.data;
  },

  createConversation: async (participantId: string, itemId?: string): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post('/api/conversations', { participantId, itemId });
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post(`/api/conversations/${conversationId}/messages`, { content });
    return response.data;
  },
};

export const collegeService = {
  getColleges: async (): Promise<ApiResponse<College[]>> => {
    const response = await apiClient.get('/api/colleges');
    return response.data;
  },

  getCollegeById: async (id: string): Promise<ApiResponse<College>> => {
    const response = await apiClient.get(`/api/colleges/${id}`);
    return response.data;
  },

  verifyCollegeEmail: async (email: string): Promise<ApiResponse<{ valid: boolean; college?: College }>> => {
    const response = await apiClient.post('/api/colleges/verify-email', { email });
    return response.data;
  },
};
