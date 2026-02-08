import supabase from '../config/supabase.js';

export const bookingService = {
  async createBooking(bookingData, clientId) {
    const { service_id, scheduled_at, estimated_duration_hours, agreed_price, requirements } = bookingData;

    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('provider_id, is_active')
      .eq('id', service_id)
      .single();

    if (serviceError) throw serviceError;

    if (!service.is_active) {
      throw new Error('Service is not available');
    }

    const bookingToInsert = {
      service_id,
      client_id: clientId,
      provider_id: service.provider_id,
      scheduled_at,
      estimated_duration_hours: parseFloat(estimated_duration_hours) || null,
      agreed_price: parseFloat(agreed_price),
      requirements,
      status: 'pending',
    };

    const { data: booking, error } = await supabase
      .from('service_bookings')
      .insert(bookingToInsert)
      .select(`
        *,
        service:services(title, category),
        provider:profiles!provider_id(full_name, avatar_url, phone)
      `)
      .single();

    if (error) throw error;
    return booking;
  },

  async getMyBookings(userId) {
    const { data, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        service:services(title, category, pricing_model),
        provider:profiles!provider_id(id, full_name, avatar_url, phone),
        client:profiles!client_id(id, full_name, avatar_url, phone)
      `)
      .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      as_client: data.filter(b => b.client_id === userId),
      as_provider: data.filter(b => b.provider_id === userId),
    };
  },

  async getBookingById(bookingId) {
    const { data, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        service:services(title, description, category, pricing_model),
        provider:profiles!provider_id(id, full_name, avatar_url, phone, trust_score),
        client:profiles!client_id(id, full_name, avatar_url, phone, trust_score)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateBookingStatus(bookingId, userId, newStatus) {
    const { data: booking, error: checkError } = await supabase
      .from('service_bookings')
      .select('provider_id, client_id, status')
      .eq('id', bookingId)
      .single();

    if (checkError) throw checkError;

    if (newStatus === 'accepted' || newStatus === 'rejected') {
      if (booking.provider_id !== userId) {
        throw new Error('Only provider can accept/reject bookings');
      }
    } else if (newStatus === 'cancelled') {
      if (booking.client_id !== userId && booking.provider_id !== userId) {
        throw new Error('Unauthorized');
      }
    } else if (newStatus === 'completed') {
      if (booking.provider_id !== userId) {
        throw new Error('Only provider can mark as completed');
      }
    }

    const { data, error } = await supabase
      .from('service_bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
