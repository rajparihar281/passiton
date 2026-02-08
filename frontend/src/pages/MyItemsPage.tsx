import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { itemService } from '../services';
import { Button, EditListingModal, DeleteConfirmationModal } from '../components';

interface Item {
  id: string;
  title: string;
  category: string;
  condition: string;
  rental_price: number;
  is_available: boolean;
  created_at: string;
  images?: { image_url: string }[];
}

export const MyItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await itemService.getMyItems();
        if (response.success) {
          setItems(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const handleDelete = async (itemId: string) => {
    try {
      const response = await itemService.deleteItem(itemId);
      if (response.success) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
    setDeletingItem(null);
  };

  const handleUpdate = async (itemId: string, updates: any) => {
    try {
      const response = await itemService.updateItem(itemId, updates);
      if (response.success) {
        setItems(items.map(item => item.id === itemId ? { ...item, ...updates } : item));
        toast.success('Item updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    }
    setEditingItem(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
        <Link to="/items/create">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
          <p className="text-gray-500 mb-4">Start by listing your first item</p>
          <Link to="/items/create">
            <Button>List Your First Item</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {item.images?.[0] ? (
                  <img 
                    src={item.images[0].image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                <p className="text-lg font-bold text-blue-600 mb-3">₹{item.rental_price}/day</p>
                <div className="flex space-x-2">
                  <Link to={`/items/${item.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setDeletingItem(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {editingItem && (
        <EditListingModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          listing={editingItem}
          type="item"
          onUpdate={(updates) => handleUpdate(editingItem.id, updates)}
        />
      )}

      {deletingItem && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => handleDelete(deletingItem.id)}
          title={`Delete ${deletingItem.title}`}
          message="Are you sure you want to delete this item? This action cannot be undone."
        />
      )}
    </MainLayout>
  );
};