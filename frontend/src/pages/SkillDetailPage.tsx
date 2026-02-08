import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, User, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Spinner, Card } from '../components';
import { skillService } from '../services';
import { useAuth } from '../context/AuthContext';

export const SkillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleBookService = () => {
    navigate(`/skills/${id}/book`);
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

  const isOwnService = user?.id === service.provider_id;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {service.images?.[0] ? (
              <img
                src={service.images[0].image_url}
                alt={service.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            {service.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {service.images.slice(1, 5).map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.image_url}
                    alt={`${service.title} ${idx + 2}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                {service.category}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-600 mr-1" />
                <span className="text-2xl font-bold text-gray-900">
                  ₹{service.price}
                  {service.pricing_model === 'hourly' && <span className="text-lg">/hr</span>}
                </span>
              </div>
              {service.average_rating > 0 && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{service.average_rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({service.review_count} reviews)</span>
                </div>
              )}
            </div>

            <Card>
              <div className="flex items-center space-x-3">
                {service.provider?.avatar_url ? (
                  <img
                    src={service.provider.avatar_url}
                    alt={service.provider.full_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{service.provider?.full_name}</p>
                  <p className="text-sm text-gray-600">Trust Score: {service.provider?.trust_score}</p>
                </div>
              </div>
            </Card>

            {!isOwnService && (
              <Button onClick={handleBookService} className="w-full">
                <Calendar className="w-5 h-5 mr-2" />
                Book Service
              </Button>
            )}
          </div>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
        </Card>

        {service.reviews?.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {service.reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{review.reviewer?.full_name}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
