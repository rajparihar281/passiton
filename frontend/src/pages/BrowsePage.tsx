import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { ItemCard, Spinner, EmptyState, Button } from '../components';
import { itemService } from '../services';
import { debounce } from '../utils/helpers';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../utils/constants';
import type { Item, ItemFilters } from '../types';

export const BrowsePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ItemFilters>({
    search: '',
    category: '',
    condition: undefined,
    is_available: true,
  });

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await itemService.getItems(filters);
      if (response.success && response.data) {
        setItems(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = debounce((value: string) => {
    setFilters({ ...filters, search: value });
  }, 500);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition || ''}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  {ITEM_CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.is_available ? 'true' : 'false'}
                  onChange={(e) => setFilters({ ...filters, is_available: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Available Only</option>
                  <option value="false">All Items</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setFilters({ search: '', category: '', condition: undefined, is_available: true })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Items Grid */}
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
          <EmptyState message="No items found matching your criteria" />
        )}
      </div>
    </MainLayout>
  );
};
