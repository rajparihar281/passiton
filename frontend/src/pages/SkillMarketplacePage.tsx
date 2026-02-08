import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Spinner, EmptyState } from '../components';
import { skillService } from '../services';
import { debounce } from '../utils/helpers';
import { SERVICE_CATEGORIES, PRICING_MODELS } from '../utils/constants';

export const SkillMarketplacePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    pricing_model: '',
    is_active: true,
  });

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await skillService.getServices(filters);
      if (response.success && response.data) {
        setServices(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to load services');
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
          <h1 className="text-3xl font-bold text-gray-900">Skill Marketplace</h1>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Model
                </label>
                <select
                  value={filters.pricing_model}
                  onChange={(e) => setFilters({ ...filters, pricing_model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Pricing</option>
                  {PRICING_MODELS.map((pm) => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setFilters({ search: '', category: '', pricing_model: '', is_active: true })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/skills/${service.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                {service.images?.[0] && (
                  <img
                    src={service.images[0].image_url}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{service.price}
                      {service.pricing_model === 'hourly' && '/hr'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{service.provider?.full_name}</span>
                    {service.average_rating > 0 && (
                      <span>⭐ {service.average_rating.toFixed(1)} ({service.review_count})</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No services found matching your criteria" />
        )}
      </div>
    </MainLayout>
  );
};
