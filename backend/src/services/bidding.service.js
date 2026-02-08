import supabase from '../config/supabase.js';
import { notificationService } from './notification.service.js';

const MIN_BID_INCREMENT = 10; // Minimum bid increment
const BID_COOLDOWN_MS = 5000; // 5 seconds between bids

export const biddingService = {
  async createSession(listingId, listingType, ownerId, endsAt) {
    const sessionData = {
      listing_id: listingId,
      listing_type: listingType,
      owner_id: ownerId,
    };
    
    if (endsAt) {
      sessionData.ends_at = endsAt;
    }

    const { data, error } = await supabase
      .from('bidding_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSession(listingId, listingType) {
    const { data, error } = await supabase
      .from('bidding_sessions')
      .select(`
        *,
        bids(*, bidder:profiles(id, full_name, avatar_url)),
        messages:bidding_messages(*, sender:profiles(id, full_name, avatar_url))
      `)
      .eq('listing_id', listingId)
      .eq('listing_type', listingType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // Auto-close if past end time
    if (data && data.is_active && data.ends_at) {
      const endTime = new Date(data.ends_at);
      if (endTime <= new Date()) {
        await supabase
          .from('bidding_sessions')
          .update({ 
            is_active: false,
            closed_at: new Date().toISOString()
          })
          .eq('id', data.id);
        
        data.is_active = false;
      }
    }
    
    return data;
  },

  async placeBid(sessionId, bidderId, amount) {
    // Check session is active
    const { data: session } = await supabase
      .from('bidding_sessions')
      .select('is_active, owner_id')
      .eq('id', sessionId)
      .single();

    if (!session?.is_active) throw new Error('Bidding session is closed');
    if (session.owner_id === bidderId) throw new Error('Owner cannot bid');

    // Check bid cooldown
    const { data: lastBid } = await supabase
      .from('bids')
      .select('created_at')
      .eq('session_id', sessionId)
      .eq('bidder_id', bidderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastBid) {
      const timeSinceLastBid = Date.now() - new Date(lastBid.created_at).getTime();
      if (timeSinceLastBid < BID_COOLDOWN_MS) {
        throw new Error('Please wait before placing another bid');
      }
    }

    // Get current highest bid
    const { data: highestBid } = await supabase
      .from('bids')
      .select('amount')
      .eq('session_id', sessionId)
      .eq('status', 'active')
      .order('amount', { ascending: false })
      .limit(1)
      .single();

    if (highestBid && amount < highestBid.amount + MIN_BID_INCREMENT) {
      throw new Error(`Bid must be at least $${MIN_BID_INCREMENT} higher than current bid`);
    }

    const { data: bid, error } = await supabase
      .from('bids')
      .insert({
        session_id: sessionId,
        bidder_id: bidderId,
        amount,
      })
      .select('*, bidder:profiles(full_name)')
      .single();

    if (error) throw error;

    // Create system message
    await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        message_type: 'bid',
        message_text: `${bid.bidder.full_name} placed a bid of $${amount}`,
        bid_id: bid.id,
      });

    // Notify previous highest bidder
    if (highestBid) {
      const { data: prevBidder } = await supabase
        .from('bids')
        .select('bidder_id')
        .eq('session_id', sessionId)
        .eq('amount', highestBid.amount)
        .single();

      if (prevBidder) {
        await notificationService.createNotification(
          prevBidder.bidder_id,
          'bid_outbid',
          `You've been outbid! New bid: $${amount}`,
          { session_id: sessionId }
        );
      }
    }

    return bid;
  },

  async withdrawBid(sessionId, bidId, userId) {
    const { data: bid, error } = await supabase
      .from('bids')
      .select('bidder_id, amount, bidder:profiles(full_name)')
      .eq('id', bidId)
      .eq('session_id', sessionId)
      .single();

    if (error) throw error;
    if (bid.bidder_id !== userId) throw new Error('Unauthorized');

    const { data: updated, error: updateError } = await supabase
      .from('bids')
      .update({ status: 'withdrawn' })
      .eq('id', bidId)
      .select()
      .single();

    if (updateError) throw updateError;

    await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        message_type: 'system',
        message_text: `${bid.bidder.full_name} withdrew their bid of $${bid.amount}`,
      });

    return updated;
  },

  async rejectBid(sessionId, bidId, ownerId) {
    const { data: session, error: sessionError } = await supabase
      .from('bidding_sessions')
      .select('owner_id')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (session.owner_id !== ownerId) throw new Error('Unauthorized');

    const { data: bid, error } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('id', bidId)
      .select('*, bidder:profiles(full_name)')
      .single();

    if (error) throw error;

    await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        message_type: 'system',
        message_text: `Bid of $${bid.amount} by ${bid.bidder.full_name} was rejected`,
      });

    return bid;
  },

  async counterOffer(sessionId, ownerId, bidderId, amount) {
    const { data: session, error: sessionError } = await supabase
      .from('bidding_sessions')
      .select('owner_id')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (session.owner_id !== ownerId) throw new Error('Unauthorized');

    const { data: message, error } = await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        sender_id: ownerId,
        message_type: 'counter_offer',
        message_text: `Counter offer: $${amount}`,
      })
      .select('*, sender:profiles(full_name)')
      .single();

    if (error) throw error;

    await notificationService.createNotification(
      bidderId,
      'counter_offer',
      `You received a counter offer of $${amount}`,
      { session_id: sessionId }
    );

    return message;
  },

  async closeSession(sessionId, ownerId) {
    const { data: session, error: sessionError } = await supabase
      .from('bidding_sessions')
      .select('owner_id')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (session.owner_id !== ownerId) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('bidding_sessions')
      .update({ 
        is_active: false,
        closed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        message_type: 'system',
        message_text: 'Bidding session has been closed',
      });

    return data;
  },

  async acceptBid(sessionId, bidId, ownerId) {
    const { data: session, error: sessionError } = await supabase
      .from('bidding_sessions')
      .select('owner_id, listing_id, listing_type')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (session.owner_id !== ownerId) throw new Error('Unauthorized');

    // Update bid status
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId)
      .select('*, bidder:profiles(full_name)')
      .single();

    if (bidError) throw bidError;

    // Close session
    await supabase
      .from('bidding_sessions')
      .update({ 
        is_active: false, 
        winning_bid_id: bidId,
        closed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Create booking based on listing type
    if (session.listing_type === 'item') {
      await supabase
        .from('borrow_requests')
        .insert({
          item_id: session.listing_id,
          borrower_id: bid.bidder_id,
          owner_id: ownerId,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'approved',
          message: `Winning bid: $${bid.amount}`,
        });
    }

    // System message
    await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        message_type: 'system',
        message_text: `Bid of $${bid.amount} by ${bid.bidder.full_name} has been accepted!`,
      });

    // Notify winner
    await notificationService.createNotification(
      bid.bidder_id,
      'bid_accepted',
      `Your bid of $${bid.amount} was accepted!`,
      { session_id: sessionId }
    );

    return bid;
  },

  async sendMessage(sessionId, senderId, messageText) {
    const { data, error } = await supabase
      .from('bidding_messages')
      .insert({
        session_id: sessionId,
        sender_id: senderId,
        message_text: messageText,
        message_type: 'normal',
      })
      .select('*, sender:profiles(id, full_name, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },
};