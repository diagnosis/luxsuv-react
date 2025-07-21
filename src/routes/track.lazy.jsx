import { createLazyFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLiveTracking, useTrackingStatus } from '../hooks/useTracking';
import RiderTracker from '../components/RiderTracker';
import { bookingApi } from '../api/bookingApi';

export const Route = createLazyFileRoute('/track')({
  validateSearch: (search) => ({
    id: search.id || undefined,
    email: search.email || undefined,
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const search = useSearch({ from: '/track' });
  const [booking, setBooking] = useState(null);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);
  const [error, setError] = useState(null);

  // Load booking data
  useEffect(() => {
    const loadBooking = async () => {
      if (!search.id) {
        setError('No booking ID provided');
        setIsLoadingBooking(false);
        return;
      }

      try {
        setIsLoadingBooking(true);
        
        // If user is authenticated, try to get from their bookings
        if (isAuthenticated) {
          // This would need to be implemented in bookingApi
          // For now, we'll simulate getting booking data
          console.log('Loading booking for authenticated user:', search.id);
        }
        
        // If email is provided, try to get booking by email
        if (search.email) {
          const response = await bookingApi.getBookingsByEmail(search.email);
          const bookings = response.bookings || [];
          const foundBooking = bookings.find(b => b.id.toString() === search.id.toString());
          
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError('Booking not found with the provided email');
          }
        } else if (!isAuthenticated) {
          setError('Please provide an email address or sign in to track your booking');
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
        setError(err.message || 'Failed to load booking information');
      } finally {
        setIsLoadingBooking(false);
      }
    };

    loadBooking();
  }, [search.id, search.email, isAuthenticated]);

  // Loading state
  if (isLoadingBooking) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-yellow animate-spin mx-auto mb-4" />
              <p className="text-light/80">Loading booking information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => navigate({ to: '/manage-bookings' })}
                className="p-2 text-gray-400 hover:text-light rounded-lg transition-colors"
                aria-label="Back to bookings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">Track Your Ride</h1>
            </div>

            {/* Error display */}
            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-400 mb-2">Tracking Unavailable</h2>
              <p className="text-red-300 mb-4">{error || 'Booking not found'}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/manage-bookings' })}
                  className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  View All Bookings
                </button>
                
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-red-400/30">
                    <p className="text-red-300 text-sm mb-3">
                      Sign in to access tracking for all your bookings
                    </p>
                    <button
                      onClick={() => navigate({ to: '/signin' })}
                      className="bg-gray-700 hover:bg-gray-600 text-light font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate({ to: '/manage-bookings' })}
              className="p-2 text-gray-400 hover:text-light rounded-lg transition-colors"
              aria-label="Back to bookings"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Live Tracking</h1>
              <p className="text-light/80">Booking #{booking.id}</p>
            </div>
          </div>

          {/* Tracking Interface */}
          <div className="space-y-6">
            <RiderTracker booking={booking} />
            
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-medium text-light mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate({ to: '/manage-bookings' })}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-light px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>All Bookings</span>
                </button>
                
                {booking.email && (
                  <a
                    href={`mailto:support@luxsuv.com?subject=Booking ${booking.id} - Support Request`}
                    className="flex items-center space-x-2 bg-yellow hover:bg-yellow/90 text-dark px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <span>Contact Support</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}