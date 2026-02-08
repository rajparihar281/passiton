import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Card, Badge, Spinner, EmptyState } from '../components';
import { Calendar, Clock, User, X } from 'lucide-react';
import { unifiedBookingService } from '../services';
import toast from 'react-hot-toast';
import { UnifiedCancelBookingModal } from '../components';

interface Booking {
  id: string;
  service_id: string;
  scheduled_at: string;
  estimated_duration_hours: number;
  agreed_price: number;
  status: string;
  requirements: string;
  created_at: string;
  service: {
    title: string;
    category: string;
    pricing_model: string;
  };
  provider: {
    id: string;
    full_name: string;
    avatar_url: string;
    phone: string;
  };
  client: {
    id: string;
    full_name: string;
    avatar_url: string;
    phone: string;
  };
}

interface BookingsData {
  as_client: Booking[];
  as_provider: Booking[];
}

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');
  const [bookings, setBookings] = useState<BookingsData>({ as_client: [], as_provider: [] });
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    const unifiedBooking = {
      id: booking.id,
      type: 'service' as const,
      title: booking.service.title,
      providerName: booking.provider.full_name,
      scheduledDate: booking.scheduled_at,
      price: booking.agreed_price
    };
    setCancelModal({ open: true, booking: unifiedBooking });
  };

  const handleCancelSuccess = () => {
    setCancelModal({ open: false, booking: null });
    fetchBookings();
    toast.success('Booking cancelled successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const canCancelBooking = (booking: Booking) => {
    return booking.status === 'pending' || booking.status === 'accepted';
  };

  const renderBookingCard = (booking: Booking, isClient: boolean) => (
    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.service.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusColor(booking.status) as any}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge variant="info">{booking.service.category}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-green-600">
              ${booking.agreed_price}
            </div>
            <div className="text-sm text-gray-500">
              {booking.service.pricing_model}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {isClient 
              ? booking.provider.full_name.charAt(0).toUpperCase()
              : booking.client.full_name.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {isClient ? booking.provider.full_name : booking.client.full_name}
            </div>
            <div className="text-sm text-gray-500">
              {isClient ? 'Service Provider' : 'Client'}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(booking.scheduled_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{new Date(booking.scheduled_at).toLocaleTimeString()}</span>
          </div>
        </div>

        {booking.estimated_duration_hours && (
          <div className="text-sm text-gray-600">
            <strong>Duration:</strong> {booking.estimated_duration_hours} hours
          </div>
        )}

        {booking.requirements && (
          <div className="text-sm">
            <strong className="text-gray-700">Requirements:</strong>
            <p className="text-gray-600 mt-1">{booking.requirements}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500">
            Booked {new Date(booking.created_at).toLocaleDateString()}
          </span>
          {canCancelBooking(booking) && (
            <button
              onClick={() => handleCancelBooking(booking)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel Booking
            </button>
          )}
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

  const currentBookings = activeTab === 'client' ? bookings.as_client : bookings.as_provider;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'client'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            As Client ({bookings.as_client.length})
          </button>
          <button
            onClick={() => setActiveTab('provider')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'provider'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            As Provider ({bookings.as_provider.length})
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBookings.length > 0 ? (
            currentBookings.map(booking => renderBookingCard(booking, activeTab === 'client'))
          ) : (
            <div className="col-span-full">
              <EmptyState 
                message={`No bookings found as ${activeTab === 'client' ? 'client' : 'provider'}.`} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal.open && cancelModal.booking && (
        <UnifiedCancelBookingModal
          booking={cancelModal.booking}
          onClose={() => setCancelModal({ open: false, booking: null })}
          onSuccess={handleCancelSuccess}
        />
      )}
    </MainLayout>
  );
};