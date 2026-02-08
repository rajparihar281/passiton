import { useState } from 'react';
import { Modal, Button } from './';
import { unifiedBookingService } from '../services';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UnifiedBooking {
  id: string;
  type: 'service' | 'resource';
  title: string;
  providerName: string;
  scheduledDate?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  depositAmount?: number;
  rentalPrice?: number;
}

interface UnifiedCancelBookingModalProps {
  booking: UnifiedBooking;
  onClose: () => void;
  onSuccess: () => void;
}

export const UnifiedCancelBookingModal = ({ booking, onClose, onSuccess }: UnifiedCancelBookingModalProps) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);

    try {
      const response = await unifiedBookingService.cancelBooking(booking.id, reason || undefined, booking.type);
      if (response.success) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Cancel ${booking.type === 'service' ? 'Service Booking' : 'Resource Request'}`}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cancel {booking.type === 'service' ? 'booking' : 'request'} for "{booking.title}"?
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{booking.type === 'service' ? 'Service' : 'Item'}:</span>
                  <p className="text-gray-600">{booking.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{booking.type === 'service' ? 'Provider' : 'Owner'}:</span>
                  <p className="text-gray-600">{booking.providerName}</p>
                </div>
                {booking.scheduledDate && (
                  <div>
                    <span className="font-medium text-gray-700">Scheduled:</span>
                    <p className="text-gray-600">
                      {new Date(booking.scheduledDate).toLocaleDateString()} at{' '}
                      {new Date(booking.scheduledDate).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                {booking.startDate && (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Start Date:</span>
                      <p className="text-gray-600">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">End Date:</span>
                      <p className="text-gray-600">{new Date(booking.endDate!).toLocaleDateString()}</p>
                    </div>
                  </>
                )}
                <div>
                  <span className="font-medium text-gray-700">Price:</span>
                  <p className="text-gray-600">
                    {booking.type === 'service' 
                      ? `$${booking.price}` 
                      : `$${booking.rentalPrice}/day (Deposit: $${booking.depositAmount})`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Let the ${booking.type === 'service' ? 'provider' : 'owner'} know why you're cancelling...`}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    Important Notice
                  </h4>
                  <p className="text-sm text-yellow-700">
                    The {booking.type === 'service' ? 'provider' : 'owner'} will be notified of this cancellation. 
                    Frequent cancellations may affect your trust score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Keep {booking.type === 'service' ? 'Booking' : 'Request'}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            loading={loading}
          >
            Cancel {booking.type === 'service' ? 'Booking' : 'Request'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};