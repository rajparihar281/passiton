import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ChevronLeft, ChevronRight, Briefcase, ShoppingBag, LogIn, UserPlus, LogOut, User, Settings, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, profile, logout, loading } = useAuth();
  const isAuthenticated = !!user;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  // Don't render auth section while loading
  if (loading) {
    return (
      <aside className={`${collapsed ? 'w-22' : 'w-64'} bg-white shadow-lg h-screen sticky top-0 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed ? (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PassItOn</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <Package className="w-8 h-8 text-blue-600" />
            </Link>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Home className="w-5 h-5" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/browse" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <ShoppingBag className="w-5 h-5" />
            {!collapsed && <span>Browse Items</span>}
          </Link>
          <Link to="/skills" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Briefcase className="w-5 h-5" />
            {!collapsed && <span>Browse Skills</span>}
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${collapsed ? 'w-22' : 'w-64'} bg-white shadow-lg h-screen sticky top-0 transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed ? (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PassItOn</span>
          </Link>
        ) : (
          <Link to="/dashboard" className="mx-auto">
            <Package className="w-8 h-8 text-blue-600" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white border rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isActive('/dashboard') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/browse"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isActive('/browse') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          {!collapsed && <span>Browse Items</span>}
        </Link>
        <Link
          to="/skills"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isActive('/skills') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          {!collapsed && <span>Browse Skills</span>}
        </Link>
      </nav>

      <div className="p-4 border-t space-y-2">
        {isAuthenticated ? (
          <>
            {/* User Info Section */}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg bg-gray-50`}>
              <User className="w-5 h-5 text-blue-600" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
            
            {/* Authenticated Navigation */}
            <Link
              to="/profile"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/profile') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Profile</span>}
            </Link>
            
            <Link
              to="/my-items"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/my-items') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>My Listings</span>}
            </Link>
            
            <Link
              to="/wallet"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/wallet') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wallet className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Wallet</span>}
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/settings') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Settings</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-red-600 hover:bg-red-50`}
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Logout</span>}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/login') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LogIn className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Login</span>}
            </Link>
            <Link
              to="/signup"
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive('/signup') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              {!collapsed && <span>Sign Up</span>}
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};