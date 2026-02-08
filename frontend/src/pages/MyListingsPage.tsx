import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Card, Badge, Spinner, EmptyState } from '../components';
import { Edit, Trash2, Eye, EyeOff, Package, Briefcase } from 'lucide-react';
import { itemService, serviceService } from '../services';
import toast from 'react-hot-toast';
import { EditListingModal } from '../components/EditListingModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  deposit_amount: number;
  rental_price: number;
  is_available: boolean;
  created_at: string;
  images?: { image_url: string; is_primary: boolean }[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing_model: string;
  price: number;
  is_active: boolean;
  created_at: string;
  booking_count: number;
  pending_bookings: number;
  images?: { image_url: string; is_primary: boolean }[];
}

export const MyListingsPage = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'items'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ open: boolean; type: 'service' | 'item'; data: any }>({
    open: false,
    type: 'service',
    data: null
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'service' | 'item'; data: any }>({
    open: false,
    type: 'service',
    data: null
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const [servicesResponse, itemsResponse] = await Promise.all([
        serviceService.getMyServices(),
        itemService.getMyItems()
      ]);

      if (servicesResponse.success) {
        setServices(servicesResponse.data);
      }
      if (itemsResponse.success) {
        setItems(itemsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: 'service' | 'item', data: any) => {
    setEditModal({ open: true, type, data });
  };

  const handleDelete = (type: 'service' | 'item', data: any) => {
    setDeleteModal({ open: true, type, data });
  };

  const handleToggleAvailability = async (type: 'service' | 'item', id: string) => {
    try {
      if (type === 'service') {
        const response = await serviceService.toggleActive(id);
        if (response.success) {
          setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
          toast.success('Service status updated');
        }
      } else {
        const response = await itemService.toggleAvailability(id);
        if (response.success) {
          setItems(prev => prev.map(i => i.id === id ? { ...i, is_available: !i.is_available } : i));
          toast.success('Item availability updated');
        }
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEditSuccess = () => {
    setEditModal({ open: false, type: 'service', data: null });
    fetchListings();
    toast.success('Listing updated successfully');
  };

  const handleDeleteSuccess = () => {
    setDeleteModal({ open: false, type: 'service', data: null });
    fetchListings();
    toast.success('Listing deleted successfully');
  };

  const renderServiceCard = (service: Service) => (
    <Card key={service.id} className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={service.is_active ? 'success' : 'danger'}>
              {service.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="info">{service.category}</Badge>
            <Badge variant="default">${service.price}/{service.pricing_model}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{service.booking_count} total bookings</span>
            {service.pending_bookings > 0 && (
              <span className="text-orange-600 font-medium">
                {service.pending_bookings} pending
              </span>
            )}
          </div>
        </div>
        {service.images && service.images.length > 0 && (
          <img
            src={service.images.find(img => img.is_primary)?.image_url || service.images[0].image_url}
            alt={service.title}
            className="w-20 h-20 object-cover rounded-lg ml-4"
          />
        )}
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-gray-500">
          Created {new Date(service.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleAvailability('service', service.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={service.is_active ? 'Deactivate' : 'Activate'}
          >
            {service.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleEdit('service', service)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete('service', service)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );

  const renderItemCard = (item: Item) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={item.is_available ? 'success' : 'danger'}>
              {item.is_available ? 'Available' : 'Unavailable'}
            </Badge>
            <Badge variant="info">{item.category}</Badge>
            <Badge variant="default">{item.condition}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Deposit: ${item.deposit_amount}</span>
            <span>Rental: ${item.rental_price}/day</span>
          </div>
        </div>
        {item.images && item.images.length > 0 && (
          <img
            src={item.images.find(img => img.is_primary)?.image_url || item.images[0].image_url}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg ml-4"
          />
        )}
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-gray-500">
          Created {new Date(item.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleAvailability('item', item.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={item.is_available ? 'Mark Unavailable' : 'Mark Available'}
          >
            {item.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleEdit('item', item)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete('item', item)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'items'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Items ({items.length})
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'services' ? (
            services.length > 0 ? (
              services.map(renderServiceCard)
            ) : (
              <div className="col-span-full">
                <EmptyState message="No services found. Create your first service to get started!" />
              </div>
            )
          ) : (
            items.length > 0 ? (
              items.map(renderItemCard)
            ) : (
              <div className="col-span-full">
                <EmptyState message="No items found. List your first item to get started!" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <EditListingModal
          type={editModal.type}
          data={editModal.data}
          onClose={() => setEditModal({ open: false, type: 'service', data: null })}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <DeleteConfirmationModal
          type={deleteModal.type}
          data={deleteModal.data}
          onClose={() => setDeleteModal({ open: false, type: 'service', data: null })}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </MainLayout>
  );
};