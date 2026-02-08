import apiClient from './api';

export const biddingService = {
  createSession: async (listingId: string, listingType: 'item' | 'service', endsAt?: string) => {
    const response = await apiClient.post('/api/bidding/sessions', {
      listing_id: listingId,
      listing_type: listingType,
      ends_at: endsAt,
    });
    return response.data;
  },

  getSession: async (listingId: string, listingType: 'item' | 'service') => {
    const response = await apiClient.get(`/api/bidding/sessions/${listingType}/${listingId}`);
    return response.data;
  },

  placeBid: async (sessionId: string, amount: number) => {
    const response = await apiClient.post(`/api/bidding/sessions/${sessionId}/bids`, {
      amount,
    });
    return response.data;
  },

  acceptBid: async (sessionId: string, bidId: string) => {
    const response = await apiClient.patch(`/api/bidding/sessions/${sessionId}/bids/${bidId}/accept`);
    return response.data;
  },

  rejectBid: async (sessionId: string, bidId: string) => {
    const response = await apiClient.patch(`/api/bidding/sessions/${sessionId}/bids/${bidId}/reject`);
    return response.data;
  },

  withdrawBid: async (sessionId: string, bidId: string) => {
    const response = await apiClient.patch(`/api/bidding/sessions/${sessionId}/bids/${bidId}/withdraw`);
    return response.data;
  },

  counterOffer: async (sessionId: string, bidderId: string, amount: number) => {
    const response = await apiClient.post(`/api/bidding/sessions/${sessionId}/counter-offer`, {
      bidder_id: bidderId,
      amount,
    });
    return response.data;
  },

  closeSession: async (sessionId: string) => {
    const response = await apiClient.patch(`/api/bidding/sessions/${sessionId}/close`);
    return response.data;
  },

  sendMessage: async (sessionId: string, message: string) => {
    const response = await apiClient.post(`/api/bidding/sessions/${sessionId}/messages`, {
      message,
    });
    return response.data;
  },
};