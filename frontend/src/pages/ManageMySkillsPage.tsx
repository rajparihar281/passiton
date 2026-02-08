import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Spinner, EmptyState, Card } from '../components';
import { skillService } from '../services';

export const ManageMySkillsPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await skillService.getMyServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await skillService.toggleActive(id);
      toast.success('Service status updated');
      loadServices();
    } catch (error: any) {
      toast.error('Failed to update service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await skillService.deleteService(id);
      toast.success('Service deleted');
      loadServices();
    } catch (error: any) {
      toast.error('Failed to delete service');
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <Button onClick={() => navigate('/skills/create')}>
            <Plus className="w-5 h-5 mr-2" />
            Offer New Skill
          </Button>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {service.images?.[0] && (
                      <img
                        src={service.images[0].image_url}
                        alt={service.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{service.category}</span>
                        <span className="font-semibold">₹{service.price}{service.pricing_model === 'hourly' && '/hr'}</span>
                        <span>{service.booking_count} bookings</span>
                        {service.pending_bookings > 0 && (
                          <span className="text-orange-600 font-semibold">
                            {service.pending_bookings} pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(service.id)}
                      title={service.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {service.is_active ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/skills/${service.id}`)}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            message="You haven't listed any services yet"
            action={
              <Button onClick={() => navigate('/skills/create')}>
                <Plus className="w-5 h-5 mr-2" />
                Offer Your First Skill
              </Button>
            }
          />
        )}
      </div>
    </MainLayout>
  );
};
