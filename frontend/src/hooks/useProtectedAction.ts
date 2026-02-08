import { useAuth } from '../context/AuthContext';

interface ProtectedActionOptions {
  type: 'book_service' | 'borrow_item' | 'create_listing' | 'send_request' | 'access_dashboard' | 'wallet_action';
  payload?: any;
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useProtectedAction = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const executeProtectedAction = (
    action: () => void | Promise<void>,
    options: ProtectedActionOptions
  ) => {
    if (isAuthenticated) {
      // User is authenticated, execute action immediately
      return action();
    } else {
      // User not authenticated, show auth modal with pending action
      openAuthModal({
        type: options.type,
        payload: options.payload,
        callback: action,
        redirectTo: options.redirectTo,
      });
    }
  };

  const requireAuth = (
    action: () => void | Promise<void>,
    actionType: ProtectedActionOptions['type'],
    payload?: any
  ) => {
    return executeProtectedAction(action, { type: actionType, payload });
  };

  return {
    executeProtectedAction,
    requireAuth,
    isAuthenticated,
  };
};

// Convenience hooks for specific actions
export const useBookingAction = () => {
  const { requireAuth } = useProtectedAction();
  
  return (bookingAction: () => void | Promise<void>, serviceId?: string) => {
    return requireAuth(bookingAction, 'book_service', { serviceId });
  };
};

export const useBorrowAction = () => {
  const { requireAuth } = useProtectedAction();
  
  return (borrowAction: () => void | Promise<void>, itemId?: string) => {
    return requireAuth(borrowAction, 'borrow_item', { itemId });
  };
};

export const useListingAction = () => {
  const { requireAuth } = useProtectedAction();
  
  return (listingAction: () => void | Promise<void>) => {
    return requireAuth(listingAction, 'create_listing');
  };
};

export const useWalletAction = () => {
  const { requireAuth } = useProtectedAction();
  
  return (walletAction: () => void | Promise<void>) => {
    return requireAuth(walletAction, 'wallet_action');
  };
};