import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, Mail, RefreshCw } from 'lucide-react';
import { useGetBookingsByEmail } from '../hooks/useBooking';
import { queryClient } from '../lib/queryClient';
import BookingCard from '../components/BookingCard';

export const Route = createLazyFileRoute('/manage-bookings')({
  component: ManageBookings,
});

function ManageBookings() {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const {
    data: bookings,
    isLoading,
    error,
    refetch
  } = useGetBookingsByEmail(searchEmail);

  const handleSearch = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSearchEmail(email.trim());
    }
  };

  const handleRefresh = () => {
    if (searchEmail) {
      queryClient.invalidateQueries(['bookings', searchEmail]);
      refetch();
    }
  };

  const handleBookingUpdate = () => {
    // Invalidate and refetch bookings after update
    if (searchEmail) {
      queryClient.invalidateQueries(['bookings', searchEmail]);
      refetch();
    }
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
          Manage Your Bookings
        </h1>
        
        <p className="text-light/80 mb-6">
          Enter your email address to view and manage your ride bookings.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
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

        {/* Results Section */}
        {searchEmail && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Bookings for: {searchEmail}
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
                    We couldn't find any bookings associated with this email address.
                  </p>
                </div>
              </div>
            )}

            {/* Bookings List */}
            {!isLoading && !error && bookings && bookings.length > 0 && (
              <div className="space-y-4">
                <p className="text-light/80 mb-4">
                  Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </p>
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdate={handleBookingUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        {!searchEmail && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow mb-3">How it works</h3>
            <ul className="space-y-2 text-light/80">
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
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}