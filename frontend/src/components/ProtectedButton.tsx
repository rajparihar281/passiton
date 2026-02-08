import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { useProtectedAction } from '../hooks/useProtectedAction';

interface ProtectedButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  actionType: 'book_service' | 'borrow_item' | 'create_listing' | 'send_request' | 'access_dashboard' | 'wallet_action';
  payload?: any;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  showAuthHint?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const ProtectedButton = ({
  children,
  onClick,
  actionType,
  payload,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  showAuthHint = true,
  type = 'button',
  ...props
}: ProtectedButtonProps) => {
  const { executeProtectedAction, isAuthenticated } = useProtectedAction();

  const handleClick = () => {
    executeProtectedAction(onClick, {
      type: actionType,
      payload,
    });
  };

  if (!isAuthenticated && showAuthHint) {
    return (
      <div className="relative group">
        <Button
          onClick={handleClick}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          loading={loading}
          className={`${className} flex items-center space-x-2`}
          type={type}
          {...props}
        >
          <Lock className="w-4 h-4" />
          <span>{children}</span>
        </Button>
        
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          Login required to continue
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      loading={loading}
      className={className}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
};