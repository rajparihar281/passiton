import { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Spinner, EmptyState, Card } from '../components';
import { skillService } from '../services';
import { BOOKING_STATUSES } from '../utils/constants';

export const ServiceBookingsPage = () => {
  const [bookings, setBookings] = useState<any>({ as_client: [], as_provider: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await skillService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await skillService.updateBookingStatus(bookingId, status);
      toast.success('Booking status updated');
      loadBookings();
    } catch (error: any) {
      toast.error('Failed to update booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case BOOKING_STATUSES.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BOOKING_STATUSES.ACCEPTED:
        return 'bg-blue-100 text-blue-800';
      case BOOKING_STATUSES.COMPLETED:
        return 'bg-green-100 text-green-800';
      case BOOKING_STATUSES.REJECTED:
      case BOOKING_STATUSES.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBookingCard = (booking: any, isProvider: boolean) => (
    <Card key={booking.id}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.service?.title}
            </h3>
            <span className={`inline-block text-xs px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(booking.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>
              {isProvider ? booking.client?.full_name : booking.provider?.full_name}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(booking.scheduled_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>₹{booking.agreed_price}</span>
          </div>
          {booking.estimated_duration_hours && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{booking.estimated_duration_hours}h</span>
            </div>
          )}
        </div>

        {booking.requirements && (
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-700">{booking.requirements}</p>
          </div>
        )}

        <div className="flex space-x-2">
          {isProvider && booking.status === BOOKING_STATUSES.PENDING && (
            <>
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUSES.ACCEPTED)}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUSES.REJECTED)}
              >
                Reject
              </Button>
            </>
          )}
          {isProvider && booking.status === BOOKING_STATUSES.ACCEPTED && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUSES.COMPLETED)}
            >
              Mark as Completed
            </Button>
          )}
          {!isProvider && booking.status === BOOKING_STATUSES.PENDING && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUSES.CANCELLED)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const currentBookings = activeTab === 'client' ? bookings.as_client : bookings.as_provider;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Bookings</h1>

        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('client')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'client'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            My Requests ({bookings.as_client.length})
          </button>
          <button
            onClick={() => setActiveTab('provider')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'provider'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Received Requests ({bookings.as_provider.length})
          </button>
        </div>

        {currentBookings.length > 0 ? (
          <div className="space-y-4">
            {currentBookings.map((booking: any) =>
              renderBookingCard(booking, activeTab === 'provider')
            )}
          </div>
        ) : (
          <EmptyState
            message={
              activeTab === 'client'
                ? 'You have no service requests'
                : 'You have no received booking requests'
            }
          />
        )}
      </div>
    </MainLayout>
  );
};
