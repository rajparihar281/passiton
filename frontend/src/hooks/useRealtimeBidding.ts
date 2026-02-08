import { useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useRealtimeBidding = (sessionId: string | null, onUpdate: () => void) => {
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`bidding:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `session_id=eq.${sessionId}`,
        },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bidding_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bidding_sessions',
          filter: `id=eq.${sessionId}`,
        },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, onUpdate]);
};
