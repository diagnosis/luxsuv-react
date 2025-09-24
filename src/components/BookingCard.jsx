import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Luggage, Edit3, Save, X, Trash2, Mail, AlertTriangle, Car, User } from 'lucide-react';
import { useCancelBooking, useUpdateBooking } from '../hooks/useBooking';
import BookingForm from './BookingForm';
import AlertModal from './AlertModal';
import AddressAutocomplete from './AddressAutocomplete';

const BookingCard = ({ booking, guestToken = null, showCancelOption = false, onBookingUpdated = null }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [editPickupLocation, setEditPickupLocation] = useState(booking.pickup || '');
  const [editDropoffLocation, setEditDropoffLocation] = useState(booking.dropoff || '');
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    details: null,
    onConfirm: null
  });

  const cancelBookingMutation = useCancelBooking();
  const updateBookingMutation = useUpdateBooking();

  const handleCancelBooking = async () => {
    if (!guestToken) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Authentication Required',
        message: 'Guest token required for cancellation. Please access your bookings using your 6-digit access code.',
        details: null
      });
      return;
    }

    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: booking.id,
        guestToken: guestToken,
      });
      setShowCancelModal(false);
      setCancelReason('');
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: 'Booking Cancelled',
        message: 'Your booking has been cancelled successfully. You will receive a confirmation email shortly.',
        details: null
      });
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      
      if (error.isTokenExpired || error.isRateLimit) {
        setAlertModal({
          isOpen: true,
          type: 'warning',
          title: 'Access Expired',
          message: error.userFriendlyMessage + ' Please access your bookings again with a new code.',
          details: null
        });
        setShowCancelModal(false);
        // You might want to emit an event here to trigger parent component to reset
      } else if (error.isTokenInvalid) {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Access',
          message: error.userFriendlyMessage + ' Please try accessing your bookings again.',
          details: null
        });
        setShowCancelModal(false);
      } else {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Cancellation Failed',
          message: error.userFriendlyMessage || error.message,
          details: ['Please try again in a few moments', 'Contact support if the problem persists']
        });
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

  // Check if user can edit this booking
  const canEdit = () => {
    if (booking.status?.toLowerCase() === 'cancelled') return false;
    if (booking.status?.toLowerCase() === 'completed') return false;
    // Only allow editing if we have a guest JWT token (not magic link token)
    // Magic link tokens are for viewing only
    return !!guestToken && !guestToken.includes('magic');
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditPickupLocation(booking.pickup || '');
    setEditDropoffLocation(booking.dropoff || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPickupLocation(booking.pickup || '');
    setEditDropoffLocation(booking.dropoff || '');
  };

  const handleUpdateBooking = async (formData) => {
    try {
      const updatedBooking = await updateBookingMutation.mutateAsync({
        bookingId: booking.id,
        bookingData: formData,
        guestToken: guestToken,
      });
      setIsEditing(false);
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: 'Booking Updated',
        message: 'Your booking has been updated successfully. You will receive a confirmation email with the updated details.',
        details: null
      });
      
      // Notify parent component to refresh data
      if (onBookingUpdated) {
        onBookingUpdated(updatedBooking);
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      
      if (error.isTokenExpired || error.isRateLimit) {
        setAlertModal({
          isOpen: true,
          type: 'warning',
          title: 'Access Expired',
          message: error.userFriendlyMessage + ' Please access your bookings again with a new code.',
          details: null
        });
        setIsEditing(false);
      } else if (error.isTokenInvalid) {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Access',
          message: error.userFriendlyMessage + ' Please try accessing your bookings again.',
          details: null
        });
        setIsEditing(false);
      } else if (error.isMagicLinkToken) {
        setAlertModal({
          isOpen: true,
          type: 'info',
          title: 'Magic Link Limitation',
          message: error.userFriendlyMessage,
          details: ['Magic links are for viewing only', 'Use your 6-digit access code to edit bookings']
        });
        setIsEditing(false);
      } else {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Update Failed',
          message: error.userFriendlyMessage || error.message,
          details: ['Please check your connection and try again', 'Contact support if the problem persists']
        });
      }
    }
  };

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch {
      return '';
    }
  };

  // Helper function to format time for input
  const formatTimeForInput = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toTimeString().slice(0, 5); // HH:MM
    } catch {
      return '';
    }
  };

  // Prepare initial data for edit form
  const getEditFormData = () => {
    return {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: formatDateForInput(booking.scheduled_at),
      time: formatTimeForInput(booking.scheduled_at),
      luggage_count: booking.luggage_count || 0,
      passenger_count: booking.passenger_count || 1,
      trip_type: booking.trip_type || 'per_ride',
    };
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-yellow/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-light">
            Edit Booking #{booking.id}
          </h3>
          <button
            onClick={handleCancelEdit}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-light transition-colors"
            aria-label="Cancel edit"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <BookingForm
          onSubmit={handleUpdateBooking}
          initialData={getEditFormData()}
          isUpdate={true}
          pickupLocation={editPickupLocation}
          setPickupLocation={setEditPickupLocation}
          dropoffLocation={editDropoffLocation}
          setDropoffLocation={setEditDropoffLocation}
          isSubmitting={updateBookingMutation.isPending}
        />
      </div>
    );
  }

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
          <div className="flex space-x-2">
            {canEdit() && (
              <button
                onClick={handleStartEdit}
                className="p-2 rounded-lg transition-colors bg-yellow/10 hover:bg-yellow/20 border border-yellow/30 text-yellow hover:text-yellow/80"
                aria-label="Edit booking"
                title="Edit booking"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            {canCancel() && (
              <button
                onClick={() => {
                  if (canActuallyCancel()) {
                    setShowCancelModal(true);
                  } else {
                    setAlertModal({
                      isOpen: true,
                      type: 'info',
                      title: 'Access Required',
                      message: 'Unable to cancel booking. Please try accessing via your 6-digit access code to enable editing and cancellation features.',
                      details: ['Magic links are for viewing only', '6-digit codes provide full access']
                    });
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

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400" />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Passengers</label>
                <p className="text-light">{booking.passenger_count || 1}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Luggage className="w-4 h-4 text-purple-400" />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Luggage</label>
                <p className="text-light">{booking.luggage_count || 0} bag{(booking.luggage_count || 0) !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-green-400" />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Trip Type</label>
                <p className="text-light capitalize">{(booking.trip_type || 'per_ride').replace('_', ' ')}</p>
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

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        details={alertModal.details}
      />

    </>
  );
};

export default BookingCard;