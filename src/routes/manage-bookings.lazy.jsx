import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Search, Mail, RefreshCw, AlertCircle, User, Key, Eye } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { useRequestAccess, useVerifyAccessCode, useViewBooking } from '../hooks/useBooking';
import { queryClient } from '../lib/queryClient';
import BookingCard from '../components/BookingCard';

export const Route = createLazyFileRoute('/manage-bookings')({
  validateSearch: (search) => ({
    token: search.token || undefined,
  }),
  component: ManageBookings,
});

function ManageBookings() {
  const search = useSearch({ from: '/manage-bookings' });
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('request'); // 'request', 'verify', or 'view'
  const [currentBookings, setCurrentBookings] = useState([]);
  const [guestToken, setGuestToken] = useState(null);

  const requestAccessMutation = useRequestAccess();
  const verifyCodeMutation = useVerifyAccessCode();
  
  // Handle magic link token from URL
  const {
    data: tokenBookings,
    isLoading: tokenBookingsLoading,
    error: tokenBookingsError
  } = useViewBookings(search.token, statusFilter);

  useEffect(() => {
    if (search.token) {
      setViewMode('view');
      console.log('🔐 Magic link token detected:', search.token.substring(0, 20) + '...');
    }
  }, [search.token]);

  useEffect(() => {
    if (tokenBookings) {
      setCurrentBookings(tokenBookings.bookings || []);
    }
  }, [tokenBookings]);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const result = await requestAccessMutation.mutateAsync({
        email: email.trim()
      });
      
      setViewMode('verify');
      alert('Access codes sent to your email! Please check your inbox for your 6-digit access code.');
    } catch (error) {
      console.error('Request access failed:', error);
      alert('Failed to send access code: ' + error.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!accessCode.trim() || accessCode.trim().length !== 6) {
      alert('Please enter a valid 6-digit access code');
      return;
    }

    try {
      const result = await verifyCodeMutation.mutateAsync({
        email: email.trim(),
        code: accessCode.trim(),
        status: statusFilter || undefined
      });
      
      setCurrentBookings(result.bookings || []);
      setGuestToken(result.token);
      setViewMode('view');
    } catch (error) {
      console.error('Code verification failed:', error);
      alert('Code verification failed: ' + error.message);
    }
  };

  const handleStartOver = () => {
    setEmail('');
    setAccessCode('');
    setStatusFilter('');
    setCurrentBookings([]);
    setGuestToken(null);
    setViewMode('request');
  };

  const renderMagicLinkNotice = () => {
    if (!search.token) return null;

    return (
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Magic Link Access</span>
        </div>
        <p className="text-light/80 text-sm">
          You're accessing your booking via a magic link from your email.
        </p>
        <p className="text-light/60 text-xs mt-2">
          This link expires after use for security purposes.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
          Access Your Booking
        </h1>

        {renderMagicLinkNotice()}

        {/* Access Request Form */}
        {viewMode === 'request' && (
          <>
            <p className="text-light/80 mb-6">
              Enter your email address to request new access codes. You'll receive an email with your booking ID, a fresh 6-digit code, and magic link.
            </p>

            <form onSubmit={handleRequestAccess} className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Email Address *
                </label>
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
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={requestAccessMutation.isPending || !email.trim()}
                  className="px-6 py-3 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>{requestAccessMutation.isPending ? 'Sending...' : 'Send Access Codes'}</span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* Code Verification Form */}
        {viewMode === 'verify' && (
          <>
            <p className="text-light/80 mb-6">
              We've sent your 6-digit access code to {email}. Enter the code below to access your bookings.
            </p>

            <form onSubmit={handleVerifyCode} className="mb-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  6-Digit Access Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-center text-2xl tracking-wider"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light mb-2">
                  Filter by Status (Optional)
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                >
                  <option value="">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-light font-semibold rounded-lg transition-colors"
                >
                  Start Over
                </button>
                <button
                  type="submit"
                  disabled={verifyCodeMutation.isPending || accessCode.length !== 6}
                  className="px-6 py-3 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>{verifyCodeMutation.isPending ? 'Verifying...' : 'Access Booking'}</span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* Booking View */}
        {viewMode === 'view' && (
          <div>
            {/* Loading State */}
            {tokenBookingsLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
                <p className="mt-2 text-light/80">Loading your bookings...</p>
              </div>
            )}

            {/* Error State */}
            {tokenBookingsError && (
              <div className="bg-red-600/20 text-red-400 p-4 rounded-lg mb-4">
                <p className="font-medium">Error loading bookings</p>
                <p className="text-sm mt-1">{tokenBookingsError.message}</p>
                <button
                  onClick={handleStartOver}
                  className="mt-2 px-4 py-2 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors"
                >
                  Try Another Method
                </button>
              </div>
            )}

            {/* Status Filter for Magic Links */}
            {search.token && !tokenBookingsLoading && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-light mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full max-w-xs px-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                >
                  <option value="">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            {/* Bookings List */}
            {currentBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Your Bookings ({currentBookings.length})
                  </h2>
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-semibold rounded-lg transition-colors"
                  >
                    Access Other Bookings
                  </button>
                </div>
                
                <div className="space-y-4">
                  {currentBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      guestToken={guestToken}
                      showCancelOption={!!guestToken}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

            {/* No Bookings Found */}
            {!tokenBookingsLoading && !tokenBookingsError && currentBookings.length === 0 && viewMode === 'view' && (
              <div className="text-center py-8">
                <p className="text-light/80">No bookings found{statusFilter && ` with status "${statusFilter}"`}.</p>
                <button
                  onClick={handleStartOver}
                  className="mt-4 px-4 py-2 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors"
                >
                  Try Different Email
                </button>
              </div>
            )}
        {/* Help Section - Show only on access screen */}
        {viewMode === 'request' && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow mb-3">How it works</h3>
            <ul className="space-y-2 text-light/80">
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Enter your email address to request new access codes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>We'll send you a fresh 6-digit access code and magic link via email</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Enter the 6-digit code from the email to access your bookings</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>You can filter bookings by status (pending, approved, completed, cancelled)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>Use the guest token to cancel bookings if needed</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}