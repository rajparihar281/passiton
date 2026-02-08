import supabase from '../config/supabase.js';

export const borrowService = {
  async createRequest({ item_id, borrower_id, start_date, end_date, message }) {
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('owner_id, is_available')
      .eq('id', item_id)
      .single();

    if (itemError) throw itemError;

    if (!item.is_available) {
      throw new Error('Item is not available');
    }

    if (item.owner_id === borrower_id) {
      throw new Error('Cannot borrow your own item');
    }

    const { data, error } = await supabase
      .from('borrow_requests')
      .insert({
        item_id,
        borrower_id,
        owner_id: item.owner_id,
        start_date,
        end_date,
        message,
        status: 'pending',
      })
      .select(`
        *,
        item:items(*),
        borrower:profiles!borrower_id(id, full_name, avatar_url, trust_score),
        owner:profiles!owner_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return data;
  },

  async getMyRequests(borrowerId) {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *,
        item:items(*, images:item_images(*)),
        owner:profiles!owner_id(id, full_name, avatar_url, phone)
      `)
      .eq('borrower_id', borrowerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async getReceivedRequests(ownerId) {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *,
        item:items(*, images:item_images(*)),
        borrower:profiles!borrower_id(id, full_name, avatar_url, phone, trust_score)
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async getRequestById(requestId) {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *,
        item:items(*, images:item_images(*)),
        borrower:profiles!borrower_id(id, full_name, avatar_url, phone, trust_score),
        owner:profiles!owner_id(id, full_name, avatar_url, phone)
      `)
      .eq('id', requestId)
      .single();

    if (error) throw error;

    return data;
  },

  async approveRequest(requestId, ownerId) {
    const { data: request, error: checkError } = await supabase
      .from('borrow_requests')
      .select('owner_id, status, item_id, borrower_id, start_date, end_date')
      .eq('id', requestId)
      .single();

    if (checkError) throw checkError;

    if (request.owner_id !== ownerId) {
      throw new Error('Unauthorized');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const { data, error } = await supabase
      .from('borrow_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        request_id: requestId,
        item_id: request.item_id,
        borrower_id: request.borrower_id,
        owner_id: request.owner_id,
        status: 'active',
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    await supabase
      .from('items')
      .update({ is_available: false })
      .eq('id', request.item_id);

    return data;
  },

  async rejectRequest(requestId, ownerId) {
    const { data: request, error: checkError } = await supabase
      .from('borrow_requests')
      .select('owner_id, status')
      .eq('id', requestId)
      .single();

    if (checkError) throw checkError;

    if (request.owner_id !== ownerId) {
      throw new Error('Unauthorized');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const { data, error } = await supabase
      .from('borrow_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async cancelRequest(requestId, borrowerId) {
    const { data: request, error: checkError } = await supabase
      .from('borrow_requests')
      .select('borrower_id, status')
      .eq('id', requestId)
      .single();

    if (checkError) throw checkError;

    if (request.borrower_id !== borrowerId) {
      throw new Error('Unauthorized');
    }

    if (request.status !== 'pending') {
      throw new Error('Cannot cancel processed request');
    }

    const { data, error } = await supabase
      .from('borrow_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
