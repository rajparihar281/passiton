import supabase from '../config/supabase.js';

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
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
