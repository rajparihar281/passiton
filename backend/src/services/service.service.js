import supabase from '../config/supabase.js';

export const serviceService = {
  async createService(serviceData, providerId) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('college_id')
      .eq('id', providerId)
      .single();
      
    let collegeId = profile?.college_id;
    if (!collegeId) {
      const { data: defaultCollege } = await supabase
        .from('colleges')
        .select('id')
        .limit(1)
        .single();
      collegeId = defaultCollege?.id;
    }
    
    if (!collegeId) {
      throw new Error('No college available. Please contact admin.');
    }
    
    const { title, description, category, pricing_model, price } = serviceData;

    const serviceToInsert = {
      provider_id: providerId,
      college_id: collegeId,
      title,
      description,
      category,
      pricing_model: pricing_model || 'hourly',
      price: parseFloat(price) || 0,
      is_active: true,
    };

    const { data: service, error } = await supabase
      .from('services')
      .insert(serviceToInsert)
      .select()
      .single();

    if (error) throw error;
    return service;
  },

  async addServiceImages(serviceId, imageUrls) {
    const images = imageUrls.map((url, index) => ({
      service_id: serviceId,
      image_url: url,
      is_primary: index === 0,
    }));

    const { data, error } = await supabase
      .from('service_portfolio_images')
      .insert(images)
      .select();

    if (error) throw error;
    return data;
  },

  async getServices(filters = {}, page = 1, limit = 20) {
    const { search, category, pricing_model, college_id, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('services')
      .select(`
        *,
        provider:profiles!provider_id(id, full_name, avatar_url, trust_score),
        images:service_portfolio_images(*),
        reviews:service_reviews(rating)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (pricing_model) {
      query = query.eq('pricing_model', pricing_model);
    }

    if (college_id) {
      query = query.eq('college_id', college_id);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const servicesWithRatings = data.map(service => {
      const ratings = service.reviews?.map(r => r.rating) || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;
      return {
        ...service,
        average_rating: avgRating,
        review_count: ratings.length,
      };
    });

    return {
      data: servicesWithRatings,
      total: count,
      page,
      limit,
    };
  },

  async getServiceById(serviceId) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles!provider_id(id, full_name, avatar_url, phone, trust_score, bio),
        images:service_portfolio_images(*),
        reviews:service_reviews(*, reviewer:profiles!reviewer_id(full_name, avatar_url))
      `)
      .eq('id', serviceId)
      .single();

    if (error) throw error;

    const ratings = data.reviews?.map(r => r.rating) || [];
    const avgRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 0;

    return {
      ...data,
      average_rating: avgRating,
      review_count: ratings.length,
    };
  },

  async getMyServices(providerId) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        images:service_portfolio_images(*),
        bookings:service_bookings(id, status)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(service => ({
      ...service,
      booking_count: service.bookings?.length || 0,
      pending_bookings: service.bookings?.filter(b => b.status === 'pending').length || 0,
    }));
  },

  async updateService(serviceId, providerId, updates) {
    const { data: service, error: checkError } = await supabase
      .from('services')
      .select('provider_id')
      .eq('id', serviceId)
      .single();

    if (checkError) throw checkError;

    if (service.provider_id !== providerId) {
      throw new Error('Unauthorized to update this service');
    }

    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteService(serviceId, providerId) {
    const { data: service, error: checkError } = await supabase
      .from('services')
      .select('provider_id')
      .eq('id', serviceId)
      .single();

    if (checkError) throw checkError;

    if (service.provider_id !== providerId) {
      throw new Error('Unauthorized to delete this service');
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
    return { message: 'Service deleted successfully' };
  },

  async toggleActive(serviceId, providerId) {
    const { data: service, error: checkError } = await supabase
      .from('services')
      .select('provider_id, is_active')
      .eq('id', serviceId)
      .single();

    if (checkError) throw checkError;

    if (service.provider_id !== providerId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
