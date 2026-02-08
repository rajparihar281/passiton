import supabase from '../config/supabase.js';

export const transactionService = {
  async getMyTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(*, images:item_images(*)),
        borrower:profiles!borrower_id(id, full_name, avatar_url, phone),
        owner:profiles!owner_id(id, full_name, avatar_url, phone)
      `)
      .or(`borrower_id.eq.${userId},owner_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async getTransactionById(transactionId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(*, images:item_images(*)),
        borrower:profiles!borrower_id(id, full_name, avatar_url, phone),
        owner:profiles!owner_id(id, full_name, avatar_url, phone)
      `)
      .eq('id', transactionId)
      .single();

    if (error) throw error;

    return data;
  },

  async confirmHandover(transactionId, userId) {
    const { data: transaction, error: checkError } = await supabase
      .from('transactions')
      .select('owner_id, borrower_id')
      .eq('id', transactionId)
      .single();

    if (checkError) throw checkError;

    if (transaction.owner_id !== userId && transaction.borrower_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ handover_time: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async confirmReturn(transactionId, userId) {
    const { data: transaction, error: checkError } = await supabase
      .from('transactions')
      .select('owner_id, item_id')
      .eq('id', transactionId)
      .single();

    if (checkError) throw checkError;

    if (transaction.owner_id !== userId) {
      throw new Error('Only owner can confirm return');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        return_time: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('items')
      .update({ is_available: true })
      .eq('id', transaction.item_id);

    return data;
  },

  async markAsCompleted(transactionId, userId) {
    const { data: transaction, error: checkError } = await supabase
      .from('transactions')
      .select('owner_id, borrower_id, item_id')
      .eq('id', transactionId)
      .single();

    if (checkError) throw checkError;

    if (transaction.owner_id !== userId && transaction.borrower_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('items')
      .update({ is_available: true })
      .eq('id', transaction.item_id);

    return data;
  },

  async reportDispute(transactionId, userId, reason) {
    const { data: transaction, error: checkError } = await supabase
      .from('transactions')
      .select('owner_id, borrower_id')
      .eq('id', transactionId)
      .single();

    if (checkError) throw checkError;

    if (transaction.owner_id !== userId && transaction.borrower_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ status: 'disputed' })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
