import { MainLayout } from '../layouts/MainLayout';
import { Card, EmptyState } from '../components';
import { Package, MessageSquare, FileText, User } from 'lucide-react';

export const MyItemsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">My Items</h1>
    <EmptyState message="Your listed items will appear here" icon={<Package className="w-16 h-16" />} />
  </MainLayout>
);

export const MyRequestsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">My Borrow Requests</h1>
    <EmptyState message="Your borrow requests will appear here" icon={<FileText className="w-16 h-16" />} />
  </MainLayout>
);

export const ReceivedRequestsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Received Requests</h1>
    <EmptyState message="Requests for your items will appear here" icon={<FileText className="w-16 h-16" />} />
  </MainLayout>
);

export const TransactionsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Transactions</h1>
    <EmptyState message="Your transactions will appear here" icon={<FileText className="w-16 h-16" />} />
  </MainLayout>
);

export const ChatPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Messages</h1>
    <EmptyState message="Your conversations will appear here" icon={<MessageSquare className="w-16 h-16" />} />
  </MainLayout>
);

export const ProfilePage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
              <p className="text-gray-600">Computer Science Student</p>
              <p className="text-sm text-gray-500">MIT College</p>
            </div>
            <div className="ml-auto">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100</div>
              <div className="text-sm text-gray-600">Trust Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Total Lends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Total Borrows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                Current Listings (2)
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                Previous Listings (3)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Sample Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">MacBook Pro</h3>
                  <p className="text-gray-600">Electronics</p>
                  <p className="text-lg font-bold text-gray-900">₹500/day</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                    Available
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">Canon Camera</h3>
                  <p className="text-gray-600">Photography</p>
                  <p className="text-lg font-bold text-gray-900">₹300/day</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const ItemDetailPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Item Details</h1>
    <EmptyState message="Item details will appear here" icon={<Package className="w-16 h-16" />} />
  </MainLayout>
);

export const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <Card className="max-w-md w-full">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-gray-600">Password reset functionality will be implemented here</p>
    </Card>
  </div>
);
