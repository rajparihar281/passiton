import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Card, Badge, Spinner, EmptyState } from '../components';
import { User } from 'lucide-react';
import { bookingService, borrowService } from '../services';
import toast from 'react-hot-toast';
import { UnifiedCancelBookingModal } from '../components';

interface Booking {
  id: string;
  service_id: string;
  scheduled_at: string;
  agreed_price: number;
  status: string;
  created_at: string;
  service: {
    title: string;
    category: string;
  };
  provider: {
    id: string;
    full_name: string;
  };
  client: {
    id: string;
    full_name: string;
  };
}

interface BorrowRequest {
  id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  item: {
    title: string;
    category: string;
  };
  owner: {
    id: string;
    full_name: string;
  };
  borrower: {
    id: string;
    full_name: string;
  };
}

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'resources'>('services');
  const [serviceBookings, setServiceBookings] = useState<{ as_client: Booking[]; as_provider: Booking[] }>({ as_client: [], as_provider: [] });
  const [borrowRequests, setBorrowRequests] = useState<{ my_requests: BorrowRequest[]; received_requests: BorrowRequest[] }>({ my_requests: [], received_requests: [] });
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; booking: any }>({ open: false, booking: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [servicesResponse, myRequestsResponse, receivedRequestsResponse] = await Promise.all([
        bookingService.getMyBookings(),
        borrowService.getMyRequests(),
        borrowService.getReceivedRequests()
      ]);
      
      if (servicesResponse.success) {
        setServiceBookings(servicesResponse.data);
      }
      if (myRequestsResponse.success) {
        setBorrowRequests(prev => ({ ...prev, my_requests: myRequestsResponse.data }));
      }
      if (receivedRequestsResponse.success) {
        setBorrowRequests(prev => ({ ...prev, received_requests: receivedRequestsResponse.data }));
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

  const handleCancelBorrowRequest = (request: BorrowRequest) => {
    const unifiedBooking = {
      id: request.id,
      type: 'resource' as const,
      title: request.item.title,
      providerName: request.owner.full_name,
      startDate: request.start_date,
      endDate: request.end_date
    };
    setCancelModal({ open: true, booking: unifiedBooking });
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await borrowService.approveRequest(requestId);
      if (response.success) {
        fetchBookings();
        toast.success('Request accepted');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await borrowService.rejectRequest(requestId);
      if (response.success) {
        fetchBookings();
        toast.success('Request rejected');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const handleCancelSuccess = () => {
    setCancelModal({ open: false, booking: null });
    fetchBookings();
    toast.success('Booking cancelled successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': case 'approved': return 'info';
      case 'completed': return 'success';
      case 'cancelled': case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const canCancel = (status: string) => {
    return status === 'pending' || status === 'accepted' || status === 'approved';
  };

  const renderServiceBookingCard = (booking: Booking, isProvider: boolean) => (
    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
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
              <Badge variant="default">{isProvider ? 'As Provider' : 'As Client'}</Badge>
            </div>
          </div>
          <div className="text-lg font-semibold text-green-600">
            ${booking.agreed_price}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500">
            {new Date(booking.created_at).toLocaleDateString()}
          </span>
          {canCancel(booking.status) && (
            <button
              onClick={() => handleCancelBooking(booking)}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  const renderBorrowRequestCard = (request: BorrowRequest, isOwner: boolean) => (
    <Card key={request.id} className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {request.item.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusColor(request.status) as any}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
              <Badge variant="info">{request.item.category}</Badge>
              <Badge variant="default">{isOwner ? 'As Owner' : 'As Borrower'}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500">
            {new Date(request.created_at).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            {isOwner && request.status === 'pending' && (
              <>
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            {canCancel(request.status) && (
              <button
                onClick={() => handleCancelBorrowRequest(request)}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Services ({serviceBookings.as_client.length + serviceBookings.as_provider.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'resources'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Resources ({borrowRequests.my_requests.length + borrowRequests.received_requests.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'services' ? (
            [...serviceBookings.as_client, ...serviceBookings.as_provider].length > 0 ? (
              [
                ...serviceBookings.as_client.map(b => renderServiceBookingCard(b, false)),
                ...serviceBookings.as_provider.map(b => renderServiceBookingCard(b, true))
              ]
            ) : (
              <div className="col-span-full">
                <EmptyState message="No service bookings found." />
              </div>
            )
          ) : (
            [...borrowRequests.my_requests, ...borrowRequests.received_requests].length > 0 ? (
              [
                ...borrowRequests.my_requests.map(r => renderBorrowRequestCard(r, false)),
                ...borrowRequests.received_requests.map(r => renderBorrowRequestCard(r, true))
              ]
            ) : (
              <div className="col-span-full">
                <EmptyState message="No resource requests found." />
              </div>
            )
          )}
        </div>
      </div>

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