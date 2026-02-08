import { useState } from 'react';
import { Modal, Button } from './';
import { itemService, serviceService } from '../services';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeleteConfirmationModalProps {
  type: 'service' | 'item';
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteConfirmationModal = ({ type, data, onClose, onSuccess }: DeleteConfirmationModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (type === 'service') {
        const response = await serviceService.deleteService(data.id);
        if (response.success) {
          if (response.data?.soft_delete) {
            toast.success('Service deactivated due to active bookings');
          } else {
            toast.success('Service deleted successfully');
          }
          onSuccess();
        }
      } else {
        const response = await itemService.deleteItem(data.id);
        if (response.success) {
          if (response.data?.soft_delete) {
            toast.success('Item marked as unavailable due to active requests');
          } else {
            toast.success('Item deleted successfully');
          }
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast.error(error.message || 'Failed to delete listing');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveBookings = type === 'service' ? data.pending_bookings > 0 : false;

  return (
    <Modal isOpen={true} onClose={onClose} title="Delete Listing">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete "{data.title}"?
            </h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone.
            </p>

            {hasActiveBookings && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">
                      Active Bookings Detected
                    </h4>
                    <p className="text-sm text-yellow-700">
                      This {type} has {data.pending_bookings} pending booking(s). 
                      Instead of deleting, it will be deactivated and affected users will be notified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {type === 'item' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  If there are active borrow requests, the item will be marked as unavailable 
                  instead of being deleted, and affected users will be notified.
                </p>
              </div>
            )}
          </div>
        </div>

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
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={loading}
          >
            {hasActiveBookings ? 'Deactivate' : 'Delete'} {type === 'service' ? 'Service' : 'Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};