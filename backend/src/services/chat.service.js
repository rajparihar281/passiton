import supabase from '../config/supabase.js';

export const chatService = {
  async getConversations(userId) {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations:conversation_id(
          id,
          item_id,
          created_at
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const conversationIds = data.map(d => d.conversation_id);

    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        user:profiles!user_id(id, full_name, avatar_url)
      `)
      .in('conversation_id', conversationIds)
      .neq('user_id', userId);

    if (participantsError) throw participantsError;

    const { data: lastMessages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;

    const conversations = data.map(d => {
      const conversation = d.conversations;
      const otherParticipants = participants
        .filter(p => p.conversation_id === conversation.id)
        .map(p => p.user);
      const lastMessage = lastMessages.find(m => m.conversation_id === conversation.id);

      return {
        ...conversation,
        participants: otherParticipants,
        lastMessage,
      };
    });

    return conversations;
  },

  async getConversationById(conversationId, userId) {
    const { data: participant, error: checkError } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (checkError) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          user:profiles!user_id(id, full_name, avatar_url)
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) throw error;

    return data;
  },

  async createConversation(userId, participantId, itemId = null) {
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({ item_id: itemId })
      .select()
      .single();

    if (conversationError) throw conversationError;

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: userId },
        { conversation_id: conversation.id, user_id: participantId },
      ]);

    if (participantsError) throw participantsError;

    return conversation;
  },

  async getMessages(conversationId, userId) {
    const { data: participant, error: checkError } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (checkError) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
  },

  async sendMessage(conversationId, userId, content) {
    const { data: participant, error: checkError } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (checkError) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content,
      })
      .select(`
        *,
        sender:profiles!sender_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return data;
  },
};

export const reviewService = {
  async createReview({ transaction_id, reviewer_id, reviewee_id, rating, comment }) {
    const { data: transaction, error: checkError } = await supabase
      .from('transactions')
      .select('borrower_id, owner_id, status')
      .eq('id', transaction_id)
      .single();

    if (checkError) throw checkError;

    if (transaction.status !== 'completed') {
      throw new Error('Can only review completed transactions');
    }

    if (transaction.borrower_id !== reviewer_id && transaction.owner_id !== reviewer_id) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        transaction_id,
        reviewer_id,
        reviewee_id,
        rating,
        comment,
      })
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', reviewee_id);

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const trustScore = Math.round(avgRating * 20);

      await supabase
        .from('profiles')
        .update({ trust_score: trustScore })
        .eq('id', reviewee_id);
    }

    return data;
  },

  async getReviewsByUser(userId) {
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

  async getReviewsByTransaction(transactionId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url),
        reviewee:profiles!reviewee_id(id, full_name, avatar_url)
      `)
      .eq('transaction_id', transactionId);

    if (error) throw error;

    return data;
  },
};
