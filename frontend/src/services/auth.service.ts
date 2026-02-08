import apiClient from './api';
import type { ApiResponse, AuthResponse } from '../types';

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  college_id: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  token: string;
  password: string;
}

export const authService = {
  signup: async (data: SignupData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/api/auth/verify-email', { token });
    return response.data;
  },

  requestPasswordReset: async (data: ResetPasswordData): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/api/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: UpdatePasswordData): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/api/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
