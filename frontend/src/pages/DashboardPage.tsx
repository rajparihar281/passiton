import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Card, ItemCard, Spinner, EmptyState } from '../components';
import { itemService } from '../services';
import { useAuth } from '../context/AuthContext';
import type { Item } from '../types';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentItems();
  }, []);

  const loadRecentItems = async () => {
    try {
      const response = await itemService.getItems({ is_available: true }, 1, 12);
      if (response.success && response.data) {
        setItems(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-blue-100 mb-6">
            Share what you don't need, borrow what you do.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/items/create')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            List an Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trust Score</p>
                <p className="text-3xl font-bold text-blue-600">{profile?.trust_score || 100}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Lent</p>
                <p className="text-3xl font-bold text-green-600">{profile?.total_lends || 0}</p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Borrowed</p>
                <p className="text-3xl font-bold text-purple-600">{profile?.total_borrows || 0}</p>
              </div>
              <Users className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Recent Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Items</h2>
            <Button variant="ghost" onClick={() => navigate('/browse')}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No items available yet"
              icon={<Package className="w-16 h-16 text-gray-400" />}
            />
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Browse Items</p>
            </button>
            <button
              onClick={() => navigate('/my-items')}
              className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">My Listings</p>
            </button>
            <button
              onClick={() => navigate('/my-requests')}
              className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">My Requests</p>
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Transactions</p>
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
