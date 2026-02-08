import { useState, useEffect } from 'react';
import { Modal, Button, Input } from './';
import { itemService, serviceService } from '../services';
import toast from 'react-hot-toast';

interface EditListingModalProps {
  type: 'service' | 'item';
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditListingModal = ({ type, data, onClose, onSuccess }: EditListingModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    pricing_model: 'hourly',
    condition: 'good',
    deposit_amount: '',
    rental_price: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        price: data.price?.toString() || '',
        pricing_model: data.pricing_model || 'hourly',
        condition: data.condition || 'good',
        deposit_amount: data.deposit_amount?.toString() || '',
        rental_price: data.rental_price?.toString() || ''
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'service') {
        const updateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          pricing_model: formData.pricing_model
        };
        
        const response = await serviceService.updateService(data.id, updateData);
        if (response.success) {
          onSuccess();
        }
      } else {
        const updateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          deposit_amount: parseFloat(formData.deposit_amount),
          rental_price: parseFloat(formData.rental_price)
        };
        
        const response = await itemService.updateItem(data.id, updateData);
        if (response.success) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast.error(error.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit ${type === 'service' ? 'Service' : 'Item'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        {type === 'service' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Model
                </label>
                <select
                  name="pricing_model"
                  value={formData.pricing_model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deposit Amount"
                name="deposit_amount"
                type="number"
                step="0.01"
                value={formData.deposit_amount}
                onChange={handleChange}
                required
              />
              <Input
                label="Rental Price (per day)"
                name="rental_price"
                type="number"
                step="0.01"
                value={formData.rental_price}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Update {type === 'service' ? 'Service' : 'Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};