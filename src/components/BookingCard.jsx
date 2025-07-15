import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Luggage, Edit3, Save, X, Trash2, Mail, AlertTriangle } from 'lucide-react';
import { useUpdateBooking, useCancelBooking, useGenerateUpdateLink } from '../hooks/useBooking';
import { useAuth } from '../contexts/AuthContext';
import AddressAutocomplete from './AddressAutocomplete';

const BookingCard = ({ booking, onUpdate, secureToken = null }) => {
  const { isAuthenticated, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateLinkModal, setShowUpdateLinkModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [editData, setEditData] = useState({
    name: booking.your_name || '',
    email: booking.email || '',
    phone: booking.phone_number || '',
    rideType: booking.ride_type || 'hourly',
    pickupLocation: booking.pickup_location || '',
    dropoffLocation: booking.dropoff_location || '',
    date: booking.date || '',
    time: booking.time || '',
    passengers: booking.number_of_passengers || 1,
    luggage: booking.number_of_luggage || 0,
    notes: booking.additional_notes || '',
  });

  const updateBookingMutation = useUpdateBooking();
  const cancelBookingMutation = useCancelBooking();
  const generateUpdateLinkMutation = useGenerateUpdateLink();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to original booking data
    setEditData({
      name: booking.your_name || '',
      email: booking.email || '',
      phone: booking.phone_number || '',
      rideType: booking.ride_type || 'hourly',
      pickupLocation: booking.pickup_location || '',
      dropoffLocation: booking.dropoff_location || '',
      date: booking.date || '',
      time: booking.time || '',
      passengers: booking.number_of_passengers || 1,
      luggage: booking.number_of_luggage || 0,
      notes: booking.additional_notes || '',
    });
  };

  const handleSave = async () => {
    try {
      await updateBookingMutation.mutateAsync({
        bookingId: booking.id,
        bookingData: editData,
        secureToken: secureToken,
      });
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: booking.id,
        reason: cancelReason,
        secureToken: secureToken,
      });
      setShowCancelModal(false);
      setCancelReason('');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking: ' + error.message);
    }
  };

  const handleGenerateUpdateLink = async () => {
    try {
      await generateUpdateLinkMutation.mutateAsync({
        bookingId: booking.id,
        email: booking.email,
      });
      setShowUpdateLinkModal(false);
      alert('Update link has been sent to your email address!');
    } catch (error) {
      console.error('Failed to generate update link:', error);
      alert('Failed to generate update link: ' + error.message);
    }
  };
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
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
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Check if user can edit this booking
  const canEdit = () => {
    // If we have a secure token, user can edit
    if (secureToken) return true;
    
    // If authenticated, check if user owns the booking or if booking allows editing
    if (isAuthenticated && user) {
      // Check if user email matches booking email
      if (booking.email === user.email) return true;
      
      // Check if user ID matches (for authenticated bookings)
      if (booking.user_id && user.id && booking.user_id === user.id) return true;
    }
    
    // If booking is not cancelled
    return booking.status?.toLowerCase() !== 'cancelled';
  };

  // Check if user can cancel this booking
  const canCancel = () => {
    // Can't cancel if already cancelled
    if (booking.status?.toLowerCase() === 'cancelled') return false;
    
    // If we have a secure token, user can cancel
    if (secureToken) return true;
    
    // If authenticated, check if user owns the booking
    if (isAuthenticated && user) {
      // Check if user email matches booking email
      if (booking.email === user.email) return true;
      
      // Check if user ID matches (for authenticated bookings)
      if (booking.user_id && user.id && booking.user_id === user.id) return true;
    }
    
    return false;
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
        <div className="flex space-x-2">
          {!isEditing && canEdit() ? (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-yellow hover:bg-yellow/10 rounded-lg transition-colors"
                aria-label="Edit booking"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              {canCancel() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  aria-label="Cancel booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {!isAuthenticated && !secureToken && (
                <button
                  onClick={() => setShowUpdateLinkModal(true)}
                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  aria-label="Get update link"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={updateBookingMutation.isPending}
                className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Save changes"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
              />
            ) : (
              <p className="text-light">{booking.your_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
              />
            ) : (
              <p className="text-light">{booking.phone_number}</p>
            )}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Pickup Location</label>
              {isEditing ? (
                <AddressAutocomplete
                  value={editData.pickupLocation}
                  onChange={(value) => handleInputChange('pickupLocation', value)}
                  placeholder="Enter pickup location"
                  className="text-sm"
                />
              ) : (
                <p className="text-light">{booking.pickup_location}</p>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Drop-off Location</label>
              {isEditing ? (
                <AddressAutocomplete
                  value={editData.dropoffLocation}
                  onChange={(value) => handleInputChange('dropoffLocation', value)}
                  placeholder="Enter drop-off location"
                  className="text-sm"
                />
              ) : (
                <p className="text-light">{booking.dropoff_location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-yellow" />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
                />
              ) : (
                <p className="text-light">{formatDate(booking.date)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow" />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Time</label>
              {isEditing ? (
                <input
                  type="time"
                  value={editData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
                />
              ) : (
                <p className="text-light">{booking.time}</p>
              )}
            </div>
          </div>
        </div>

        {/* Passengers and Luggage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-yellow" />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Passengers</label>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={editData.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
                />
              ) : (
                <p className="text-light">{booking.number_of_passengers}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Luggage className="w-4 h-4 text-yellow" />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Luggage</label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={editData.luggage}
                  onChange={(e) => handleInputChange('luggage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
                />
              ) : (
                <p className="text-light">{booking.number_of_luggage || 0}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ride Type */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ride Type</label>
          {isEditing ? (
            <select
              value={editData.rideType}
              onChange={(e) => handleInputChange('rideType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm"
            >
              <option value="hourly">Hourly</option>
              <option value="per_ride">Per Ride</option>
            </select>
          ) : (
            <p className="text-light capitalize">{booking.ride_type?.replace('_', ' ')}</p>
          )}
        </div>

        {/* Additional Notes */}
        {(booking.additional_notes || isEditing) && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
            {isEditing ? (
              <textarea
                value={editData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow text-sm resize-none"
                placeholder="Any special requests or additional information..."
              />
            ) : (
              <p className="text-light">{booking.additional_notes}</p>
            )}
          </div>
        )}

        {/* Created Date */}
        {booking.created_at && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Booked on: {formatDate(booking.created_at)}
            </p>
          </div>
        )}
      </div>

      {/* Update Status */}
      {updateBookingMutation.isPending && (
        <div className="mt-3 p-2 bg-yellow/10 text-yellow rounded-lg text-sm">
          Updating booking...
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
                Are you sure you want to cancel booking #{booking.id}? This action cannot be undone.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-light mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow resize-none"
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-semibold rounded-lg transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelBookingMutation.isPending || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Update Link Modal */}
      {showUpdateLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-600">
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-light flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-2" />
                Get Update Link
              </h2>
              <button
                onClick={() => setShowUpdateLinkModal(false)}
                className="text-gray-400 hover:text-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-light/80 mb-4">
                We'll send a secure link to your email address that will allow you to update this booking.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-light mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={booking.email}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg opacity-75"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpdateLinkModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateUpdateLink}
                  disabled={generateUpdateLinkMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateUpdateLinkMutation.isPending ? 'Sending...' : 'Send Link'}
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