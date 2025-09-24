import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Luggage, Edit3, Save, X, Trash2, Mail, AlertTriangle } from 'lucide-react';
import { useCancelBooking } from '../hooks/useBooking';

const BookingCard = ({ booking, guestToken = null, showCancelOption = false }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const cancelBookingMutation = useCancelBooking();

  const handleCancelBooking = async () => {
    if (!guestToken) {
      alert('Guest token required for cancellation');
      return;
    }

    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: booking.id,
        guestToken: guestToken,
      });
      setShowCancelModal(false);
      setCancelReason('');
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      
      if (error.isTokenExpired || error.isRateLimit) {
        alert(error.userFriendlyMessage + ' Please access your bookings again with a new code.');
        setShowCancelModal(false);
        // You might want to emit an event here to trigger parent component to reset
      } else if (error.isTokenInvalid) {
        alert(error.userFriendlyMessage + ' Please try accessing your bookings again.');
        setShowCancelModal(false);
      } else {
        alert('Cancellation failed: ' + (error.userFriendlyMessage || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      case 'completed':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Check if user can cancel this booking
  const canCancel = () => {
    // Can't cancel if already cancelled
    if (booking.status?.toLowerCase() === 'cancelled') return false;
    if (booking.status?.toLowerCase() === 'completed') return false;
    
    // Show cancel option if cancellation is enabled
    return showCancelOption;
  };
  
  // Check if cancellation is actually available
  const canActuallyCancel = () => {
    return canCancel() && !!guestToken;
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 hover:border-yellow/30 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-light mb-1">
            Booking #{booking.id}
          </h3>
          {booking.status && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <p className="text-light">{booking.name}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <p className="text-light">{booking.phone}</p>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Pickup Location</label>
              <p className="text-light">{booking.pickup}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Drop-off Location</label>
              <p className="text-light">{booking.dropoff}</p>
            </div>
          </div>
        </div>

        {/* Scheduled Time */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-yellow" />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Scheduled Time</label>
            <p className="text-light">
              {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString() : 'Not specified'}
            </p>
          </div>
        </div>

        {/* Created Date */}
        {booking.created_at && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Created: {formatDate(booking.created_at)}
            </p>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel() && (
          <button
            onClick={() => {
              if (canActuallyCancel()) {
                setShowCancelModal(true);
              } else {
                alert('Unable to cancel booking. Please try accessing via your 6-digit access code.');
              }
            }}
            className="p-2 rounded-lg transition-colors bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300"
            aria-label="Cancel booking"
            title="Cancel booking"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Cancel Status */}
      {cancelBookingMutation.isPending && (
        <div className="mt-3 p-2 bg-red-400/10 text-red-400 rounded-lg text-sm">
          Cancelling booking...
        </div>
      )}
    </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-600">
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-light flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                Cancel Booking
              </h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-light/80 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-semibold rounded-lg transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelBookingMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BookingCard;