import apiClient from './api';

export const skillService = {
  async getServices(filters = {}) {
    const response = await apiClient.get('/api/services', { params: filters });
    return response.data;
  },

  async getServiceById(id: string) {
    const response = await apiClient.get(`/api/services/${id}`);
    return response.data;
  },

  async getMyServices() {
    const response = await apiClient.get('/api/services/my-services');
    return response.data;
  },

  async createService(formData: FormData) {
    const response = await apiClient.post('/api/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateService(id: string, data: any) {
    const response = await apiClient.put(`/api/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: string) {
    const response = await apiClient.delete(`/api/services/${id}`);
    return response.data;
  },

  async toggleActive(id: string) {
    const response = await apiClient.patch(`/api/services/${id}/active`);
    return response.data;
  },

  async createBooking(data: any) {
    const response = await apiClient.post('/api/bookings', data);
    return response.data;
  },

  async getMyBookings() {
    const response = await apiClient.get('/api/bookings/my-bookings');
    return response.data;
  },

  async getBookingById(id: string) {
    const response = await apiClient.get(`/api/bookings/${id}`);
    return response.data;
  },

  async updateBookingStatus(id: string, status: string) {
    const response = await apiClient.patch(`/api/bookings/${id}/status`, { status });
    return response.data;
  },
};
