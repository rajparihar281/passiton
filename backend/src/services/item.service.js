import supabase from '../config/supabase.js';

export const itemService = {
  async createItem(itemData, ownerId) {
    console.log('🔧 Creating item with data:', itemData);
    console.log('👤 Owner ID:', ownerId);
    
    // Get user's college_id from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('college_id')
      .eq('id', ownerId)
      .single();
      
    console.log('👤 Profile data:', profile);
    
    // Use a default college if user doesn't have one set
    let collegeId = profile?.college_id;
    if (!collegeId) {
      // Get the first available college as default
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
    
    const { title, description, category, condition, deposit_amount, rental_price } = itemData;

    const itemToInsert = {
      owner_id: ownerId,
      college_id: collegeId,
      title,
      description,
      category,
      condition,
      deposit_amount: parseFloat(deposit_amount) || 0,
      rental_price: parseFloat(rental_price) || 0,
      is_available: true,
    };
    
    console.log('📝 Item to insert:', itemToInsert);

    const { data: item, error: itemError } = await supabase
      .from('items')
      .insert(itemToInsert)
      .select()
      .single();

    if (itemError) {
      console.log('❌ Item creation error:', itemError);
      throw itemError;
    }
    
    console.log('✅ Item created successfully:', item);
    return item;
  },

  async addItemImages(itemId, imageUrls) {
    const images = imageUrls.map((url, index) => ({
      item_id: itemId,
      image_url: url,
      is_primary: index === 0,
    }));

    const { data, error } = await supabase
      .from('item_images')
      .insert(images)
      .select();

    if (error) throw error;

    return data;
  },

  async getItems(filters = {}, page = 1, limit = 20) {
    const { search, category, condition, college_id, is_available } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('items')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url, trust_score),
        images:item_images(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (condition) {
      query = query.eq('condition', condition);
    }

    if (college_id) {
      query = query.eq('college_id', college_id);
    }

    if (is_available !== undefined) {
      query = query.eq('is_available', is_available);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data,
      total: count,
      page,
      limit,
    };
  },

  async getItemById(itemId) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, avatar_url, phone, trust_score, total_lends),
        images:item_images(*)
      `)
      .eq('id', itemId)
      .single();

    if (error) throw error;

    return data;
  },

  async getMyItems(ownerId) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*)
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async updateItem(itemId, ownerId, updates) {
    const { data: item, error: checkError } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', itemId)
      .single();

    if (checkError) throw checkError;

    if (item.owner_id !== ownerId) {
      throw new Error('Unauthorized to update this item');
    }

    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteItem(itemId, ownerId) {
    const { data: item, error: checkError } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', itemId)
      .single();

    if (checkError) throw checkError;

    if (item.owner_id !== ownerId) {
      throw new Error('Unauthorized to delete this item');
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return { message: 'Item deleted successfully' };
  },

  async toggleAvailability(itemId, ownerId) {
    const { data: item, error: checkError } = await supabase
      .from('items')
      .select('owner_id, is_available')
      .eq('id', itemId)
      .single();

    if (checkError) throw checkError;

    if (item.owner_id !== ownerId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('items')
      .update({ is_available: !item.is_available })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
