import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Input, Card, Spinner } from '../components';
import { skillService } from '../services';

export const BookServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduled_at: '',
    estimated_duration_hours: '',
    requirements: '',
  });

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await skillService.getServiceById(id!);
      if (response.success) {
        setService(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.scheduled_at) {
      toast.error('Please select a date and time');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        service_id: id,
        scheduled_at: formData.scheduled_at,
        estimated_duration_hours: parseFloat(formData.estimated_duration_hours) || null,
        agreed_price: service.price,
        requirements: formData.requirements,
      };

      const response = await skillService.createBooking(bookingData);
      if (response.success) {
        toast.success('Booking request sent!');
        navigate('/skill-bookings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!service) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Service not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Service</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold">{service.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-semibold">{service.provider?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{service.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{service.price}
                  {service.pricing_model === 'hourly' && <span className="text-lg">/hr</span>}
                </p>
              </div>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              
              <div className="space-y-4">
                <Input
                  type="datetime-local"
                  label="Preferred Date & Time"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />

                {service.pricing_model === 'hourly' && (
                  <Input
                    type="number"
                    label="Estimated Duration (hours)"
                    placeholder="e.g., 2"
                    value={formData.estimated_duration_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_hours: e.target.value })}
                    min="0.5"
                    step="0.5"
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements / Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Any specific requirements or message for the provider..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="ghost" onClick={() => navigate(`/skills/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Send Booking Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
