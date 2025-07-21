import { createLazyFileRoute, useSearch, Link } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useGetBookingsByEmail } from '../hooks/useBooking';
import { useAuth } from '../contexts/AuthContext';
import RiderTracking from '../components/tracking/RiderTracking';

export const Route = createLazyFileRoute('/track-ride')({
  validateSearch: (search) => ({
    bookingId: search.bookingId ? Number(search.bookingId) : undefined,
  }),
  component: TrackRide,
});

function TrackRide() {
  const { user, isAuthenticated } = useAuth();
  const search = useSearch({ from: '/track-ride' });
  const { bookingId } = search;

  // Get user's bookings to find the specific one
  const { data: bookings, isLoading, error } = useGetBookingsByEmail(user?.email);

  if (!bookingId) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <Link
            to="/manage-bookings"
            className="inline-flex items-center space-x-2 text-yellow hover:text-yellow/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookings</span>
          </Link>
          
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-light mb-4">No Booking Selected</h1>
            <p className="text-light/80 mb-6">
              Please select a booking from your booking history to view live tracking.
            </p>
            <Link
              to="/manage-bookings"
              className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
            <span className="ml-2 text-light">Loading booking...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <Link
            to="/manage-bookings"
            className="inline-flex items-center space-x-2 text-yellow hover:text-yellow/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookings</span>
          </Link>
          
          <div className="bg-red-600/20 text-red-400 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Error loading booking: {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Find the specific booking
  const booking = bookings?.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <Link
            to="/manage-bookings"
            className="inline-flex items-center space-x-2 text-yellow hover:text-yellow/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookings</span>
          </Link>
          
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-light mb-4">Booking Not Found</h1>
            <p className="text-light/80 mb-6">
              The booking you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link
              to="/manage-bookings"
              className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <Link
          to="/manage-bookings"
          className="inline-flex items-center space-x-2 text-yellow hover:text-yellow/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-light mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Booking ID</p>
                  <p className="text-light font-medium">#{booking.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Date & Time</p>
                  <p className="text-light font-medium">
                    {formatDate(booking.date)} at {formatTime(booking.time)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Pickup Location</p>
                  <p className="text-light">{booking.pickup_location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Drop-off Location</p>
                  <p className="text-light">{booking.dropoff_location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Passengers</p>
                    <p className="text-light font-medium">{booking.number_of_passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Luggage</p>
                    <p className="text-light font-medium">{booking.number_of_luggage || 0}</p>
                  </div>
                </div>
                
                {booking.additional_notes && (
                  <div>
                    <p className="text-sm text-gray-400">Notes</p>
                    <p className="text-light">{booking.additional_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Tracking */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-light mb-4 md:text-3xl">
              Live Tracking
            </h1>
            <RiderTracking booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}