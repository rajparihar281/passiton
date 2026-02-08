import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, MessageSquare, LogOut, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components';

export const Navbar = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PassItOn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/browse" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Package className="w-5 h-5" />
              <span>Browse</span>
            </Link>
            <Link to="/my-items" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Package className="w-5 h-5" />
              <span>My Items</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </Link>
            <Link to="/transactions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Transactions
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative text-gray-700 hover:text-blue-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <Link to={`/profile/${profile?.id}`} className="flex items-center space-x-2">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.full_name || 'User'}
                size="sm"
                fallback={profile?.full_name?.charAt(0)}
              />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/my-items"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Items
            </Link>
            <Link
              to="/chat"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              to="/transactions"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              to={`/profile/${profile?.id}`}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
