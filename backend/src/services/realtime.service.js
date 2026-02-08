import supabase from '../config/supabase.js';

export const realtimeService = {
  subscribeToBiddingSession(sessionId, callbacks) {
    const channel = supabase
      .channel(`bidding:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callbacks.onNewBid?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bidding_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callbacks.onNewMessage?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bidding_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          callbacks.onSessionUpdate?.(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
