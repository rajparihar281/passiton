import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, ChevronLeft, ChevronRight, Briefcase, ShoppingBag, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home className="w-5 h-5" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/browse"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
            isActive('/browse') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {!collapsed && <span>Browse Items</span>}
        </Link>
        <Link
          to="/skills"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
            isActive('/skills') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          {!collapsed && <span>Browse Skills</span>}
        </Link>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link
          to="/login"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
            isActive('/login') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LogIn className="w-5 h-5" />
          {!collapsed && <span>Login</span>}
        </Link>
        <Link
          to="/signup"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
            isActive('/signup') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          {!collapsed && <span>Sign Up</span>}
        </Link>
      </div>
    </aside>
  );
};