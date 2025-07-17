import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Search, Mail, RefreshCw, AlertCircle, User } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useGetBookingsByEmail, useGetUserBookings } from '../hooks/useBooking';
import { queryClient } from '../lib/queryClient';
import BookingCard from '../components/BookingCard';

export const Route = createLazyFileRoute('/manage-bookings')({
  validateSearch: (search) => ({
    token: search.token || null,
    id: search.id || null,
  }),
  component: ManageBookings,
});

function ManageBookings() {
  const { user, isAuthenticated } = useAuth();
  const search = useSearch({ from: '/manage-bookings' });
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [secureToken, setSecureToken] = useState(search.token || null);
  const [targetBookingId, setTargetBookingId] = useState(search.id || null);
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'email'

  // Query for authenticated user's bookings
  const {
    data: userBookings,
    isLoading: userBookingsLoading,
    error: userBookingsError,
    refetch: refetchUserBookings
  } = useGetUserBookings();

  // Query for email-based bookings
  const {
    data: emailBookings,
    isLoading: emailBookingsLoading,
    error: emailBookingsError,
    refetch: refetchEmailBookings
  } = useGetBookingsByEmail(searchEmail);

  // Auto-populate email if user is signed in
  useEffect(() => {
    if (isAuthenticated && user?.email && !email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user?.email]);

  // Handle secure token from URL
  useEffect(() => {
    if (search.token && search.id) {
      setSecureToken(search.token);
      setTargetBookingId(search.id);
      setViewMode('email'); // Switch to email mode for secure token access
      console.log('🔐 Secure token detected:', {
        hasToken: !!search.token,
        tokenPreview: search.token ? `${search.token.substring(0, 20)}...` : 'None',
        bookingId: search.id
      });
    }
  }, [search.token, search.id]);

  // Auto-load user bookings for authenticated users
  useEffect(() => {
    if (isAuthenticated && viewMode === 'user') {
      // User bookings are automatically loaded via the query
    }
  }, [isAuthenticated, viewMode]);

  const handleEmailSearch = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSearchEmail(email.trim());
      setViewMode('email');
    }
  };

  const handleRefresh = () => {
    if (viewMode === 'user') {
      queryClient.invalidateQueries(['bookings', 'user']);
      refetchUserBookings();
    } else if (searchEmail) {
      queryClient.invalidateQueries(['bookings', searchEmail]);
      refetchEmailBookings();
    }
  };

  const handleBookingUpdate = () => {
    // Invalidate and refetch bookings after update
    if (viewMode === 'user') {
      queryClient.invalidateQueries(['bookings', 'user']);
      refetchUserBookings();
    } else if (searchEmail) {
      queryClient.invalidateQueries(['bookings', searchEmail]);
      refetchEmailBookings();
    }
  };

  // Quick search for authenticated users
  const handleViewMyBookings = () => {
    setViewMode('user');
    setSearchEmail(''); // Clear email search
  };

  const handleViewByEmail = () => {
    setViewMode('email');
    if (user?.email) {
      setEmail(user.email);
    }
  };

  // Show secure token notice if accessing via secure link
  const renderSecureTokenNotice = () => {
    if (!secureToken) return null;

    return (
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Secure Access</span>
        </div>
        <p className="text-light/80 text-sm">
          You're accessing booking #{targetBookingId} via a secure link. You can update or cancel this booking without signing in.
        </p>
        <p className="text-light/60 text-xs mt-2">
          This secure link will expire after use for security purposes.
        </p>
      </div>
    );
  };

  // Get current bookings and loading state based on view mode
  const getCurrentBookings = () => {
    if (viewMode === 'user') {
      return {
        bookings: userBookings?.bookings || [],
        isLoading: userBookingsLoading,
        error: userBookingsError,
        count: userBookings?.count || 0
      };
    } else {
      return {
        bookings: emailBookings?.bookings || [],
        isLoading: emailBookingsLoading,
        error: emailBookingsError,
        count: emailBookings?.count || 0
      };
    }
  };

  const { bookings, isLoading, error, count } = getCurrentBookings();

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
          Manage Your Bookings
        </h1>

        {renderSecureTokenNotice()}

        {/* View Mode Selector for Authenticated Users */}
        {isAuthenticated && !secureToken && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleViewMyBookings}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'user'
                    ? 'bg-yellow text-dark'
                    : 'bg-gray-700 hover:bg-gray-600 text-light'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
              <button
                onClick={handleViewByEmail}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'email'
                    ? 'bg-yellow text-dark'
                    : 'bg-gray-700 hover:bg-gray-600 text-light'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Search by Email</span>
              </button>
            </div>
            
            {viewMode === 'user' && (
              <p className="text-light/80 text-sm">
                Viewing bookings for your account: {user?.email}
              </p>
            )}
          </div>
        )}

        {/* Email Search Form - Show for guests or when email mode is selected */}
        {(!isAuthenticated || viewMode === 'email') && (
          <>
            <p className="text-light/80 mb-6">
              {isAuthenticated 
                ? 'Search for bookings using any email address.'
                : 'Enter your email address to view and manage your ride bookings.'
              }
            </p>

            <form onSubmit={handleEmailSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!email.trim() || !email.includes('@')}
                  className="px-6 py-3 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Bookings</span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* Results Section */}
        {(viewMode === 'user' || searchEmail) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {viewMode === 'user' 
                  ? `Your Bookings`
                  : `Bookings for: ${searchEmail}`
                }
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-yellow hover:bg-yellow/10 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Refresh bookings"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
                <p className="mt-2 text-light/80">Loading your bookings...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-600/20 text-red-400 p-4 rounded-lg mb-4">
                <p className="font-medium">Error loading bookings</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            )}

            {/* No Bookings Found */}
            {!isLoading && !error && bookings && bookings.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-light mb-2">No bookings found</h3>
                  <p className="text-light/80">
                    {viewMode === 'user' 
                      ? "You haven't made any bookings yet."
                      : "We couldn't find any bookings associated with this email address."
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Bookings List */}
            {!isLoading && !error && bookings && bookings.length > 0 && (
              <div className="space-y-4">
                <p className="text-light/80 mb-4">
                  Found {count} booking{count !== 1 ? 's' : ''}
                </p>
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdate={handleBookingUpdate}
                    secureToken={secureToken && targetBookingId === booking.id ? secureToken : null}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section - Show when no search is active */}
        {!searchEmail && viewMode !== 'user' && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow mb-3">How it works</h3>
            <ul className="space-y-2 text-light/80">
              {isAuthenticated && (
                <>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">•</span>
                    <span>Click "My Bookings" to view all bookings associated with your account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">•</span>
                    <span>Use "Search by Email" to find bookings made with different email addresses</span>
                  </li>
                </>
              )}
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Enter the email address you used when making your booking</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>View all your current and past bookings</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Click the edit button to modify booking details</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Save your changes or cancel to keep original details</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Use the mail icon to get a secure update link sent to your email</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Click the trash icon to cancel a booking with a reason</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}