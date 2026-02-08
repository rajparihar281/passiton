import supabase from '../config/supabase.js';

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        college:colleges(name, location)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
  },

  async getMyProfile(userId) {
    const profile = await this.getProfile(userId);
    const stats = await this.getProfileStats(userId);
    
    return {
      ...profile,
      stats
    };
  },

  async getProfileStats(userId) {
    // Get service bookings stats
    const { data: serviceBookings } = await supabase
      .from('service_bookings')
      .select('status')
      .eq('client_id', userId);

    // Get resource transactions stats  
    const { data: resourceTransactions } = await supabase
      .from('transactions')
      .select('status')
      .eq('borrower_id', userId);

    // Get items listed
    const { data: itemsListed } = await supabase
      .from('items')
      .select('id')
      .eq('owner_id', userId);

    // Get services offered
    const { data: servicesOffered } = await supabase
      .from('services')
      .select('id')
      .eq('provider_id', userId);

    // Get average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', userId);

    const avgRating = reviews?.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      total_service_bookings: serviceBookings?.length || 0,
      completed_service_bookings: serviceBookings?.filter(b => b.status === 'completed').length || 0,
      total_resource_transactions: resourceTransactions?.length || 0,
      completed_resource_transactions: resourceTransactions?.filter(t => t.status === 'completed').length || 0,
      items_listed: itemsListed?.length || 0,
      services_offered: servicesOffered?.length || 0,
      average_rating: avgRating,
      total_reviews: reviews?.length || 0
    };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async getProfileReviews(userId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async getMyServiceBookings(userId) {
    const { data, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        service:services(title, category, pricing_model),
        provider:profiles!provider_id(full_name, avatar_url)
      `)
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getMyResourceBookings(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(title, category, condition),
        owner:profiles!owner_id(full_name, avatar_url)
      `)
      .eq('borrower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const collegeService = {
  async getColleges() {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('name');

    if (error) throw error;

    return data;
  },

  async getCollegeById(collegeId) {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();

    if (error) throw error;

    return data;
  },

  async verifyCollegeEmail(email) {
    const domain = email.split('@')[1];

    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('domain', domain)
      .single();

    if (error) {
      return { valid: false };
    }

    return { valid: true, college: data };
  },
};
