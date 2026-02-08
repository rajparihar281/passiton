import apiClient from './api';
import type { ApiResponse, Profile } from '../types';

export const profileService = {
  getMyProfile: async (): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get('/api/profiles/me');
    return response.data;
  },
};