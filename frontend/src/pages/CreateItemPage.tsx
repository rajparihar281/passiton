import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Input, Card } from '../components';
import { itemService } from '../services';
import { useAuth } from '../context/AuthContext';
import { ITEM_CATEGORIES, ITEM_CONDITIONS, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, MAX_IMAGES_PER_ITEM } from '../utils/constants';
import type { ItemCondition } from '../types';

export const CreateItemPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'good' as ItemCondition,
    deposit_amount: '',
    rental_price: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > MAX_IMAGES_PER_ITEM) {
      toast.error(`Maximum ${MAX_IMAGES_PER_ITEM} images allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.deposit_amount || parseFloat(formData.deposit_amount) < 0) {
      newErrors.deposit_amount = 'Valid deposit amount is required';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('deposit_amount', formData.deposit_amount);
      formDataToSend.append('rental_price', formData.rental_price || '0');
      formDataToSend.append('college_id', profile?.college_id || '');
      
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await itemService.createItem(formDataToSend);
      if (response.success) {
        toast.success('Item listed successfully!');
        navigate('/my-items');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">List an Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Item Title"
                placeholder="e.g., Canon EOS Camera"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your item..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {ITEM_CONDITIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Security Deposit (₹)"
                  placeholder="0"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                  error={errors.deposit_amount}
                  required
                  min="0"
                  step="0.01"
                />

                <Input
                  type="number"
                  label="Rental Price (₹/day)"
                  placeholder="0"
                  value={formData.rental_price}
                  onChange={(e) => setFormData({ ...formData, rental_price: e.target.value })}
                  min="0"
                  step="0.01"
                  helperText="Optional"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload up to {MAX_IMAGES_PER_ITEM} images (max 5MB each)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="secondary" onClick={() => document.getElementById('image-upload')?.click()}>
                    Choose Images
                  </Button>
                </label>
              </div>

              {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/my-items')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              List Item
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
