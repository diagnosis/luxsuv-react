import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Search, Mail, RefreshCw, AlertCircle, User, Key, Eye, ArrowRight } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { useRequestAccess, useVerifyAccessCode, useViewBookings } from '../hooks/useBooking';
import { queryClient } from '../lib/queryClient';
import BookingCard from '../components/BookingCard';
import ErrorModal from '../components/ErrorModal';

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
  const [viewMode, setViewMode] = useState('request'); // 'request', 'verify', 'direct-code', or 'view'
  const [accessMethod, setAccessMethod] = useState('request'); // 'request' or 'direct-code'
  const [currentBookings, setCurrentBookings] = useState([]);
  const [guestToken, setGuestToken] = useState(null);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
    details: null,
    onRetry: null
  });

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
    setErrorModal({ isOpen: false });
    
    if (!email.trim() || !email.includes('@')) {
      setErrorModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email address to request access codes.',
        details: null,
        onRetry: null
      });
      return;
    }

    try {
      const result = await requestAccessMutation.mutateAsync({
        email: email.trim()
      });
      
      setViewMode('verify');
    } catch (error) {
      console.error('Request access failed:', error);
      
      if (error.isEmailNotFound) {
        setErrorModal({
          isOpen: true,
          type: 'email',
          title: 'Email Not Found',
          message: 'No bookings found for this email address. Please double-check your email and try again.',
          details: [
            'Email address was typed incorrectly',
            'You used a different email when booking',
            'No bookings have been made with this email'
          ],
          onRetry: () => {
            setEmail('');
          }
        });
      } else if (error.isRateLimit) {
        setErrorModal({
          isOpen: true,
          type: 'warning',
          title: 'Too Many Requests',
          message: 'Too many requests have been made. Please wait a moment before trying again.',
          details: null,
          onRetry: null
        });
      } else {
        setErrorModal({
          isOpen: true,
          type: 'error',
          title: 'Request Failed',
          message: error.userFriendlyMessage || error.message || 'Failed to send access codes. Please try again.',
          details: null,
          onRetry: null
        });
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerifyError(null);
    
    if (!email.trim() || !email.includes('@')) {
      setVerifyError('Please enter a valid email address');
      return;
    }
    
    if (!accessCode.trim() || accessCode.trim().length !== 6) {
      setVerifyError('Please enter a valid 6-digit access code');
      return;
    }

    console.log('🔍 Verifying access code:', {
      email: email.trim(),
      code: accessCode.trim(),
      statusFilter: statusFilter || 'none'
    });
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
      console.error('Direct code error details:', {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        isTokenExpired: error.isTokenExpired,
        isTokenInvalid: error.isTokenInvalid,
        isRateLimit: error.isRateLimit,
        userFriendlyMessage: error.userFriendlyMessage
      });
      
      if (error.isTokenExpired || error.isRateLimit) {
        // Reset to request new access
        setAccessCode('');
        setViewMode('request');
        setRequestError(error.userFriendlyMessage);
      } else if (error.isTokenInvalid) {
        // Clear the invalid code but stay on same screen
        setAccessCode('');
        setVerifyError(error.userFriendlyMessage);
      } else {
        setVerifyError(error.userFriendlyMessage || error.message);
      }
    }
  };

  const handleStartOver = () => {
    setEmail('');
    setAccessCode('');
    setStatusFilter('');
    setAccessMethod('request');
    setCurrentBookings([]);
    setGuestToken(null);
    setViewMode('request');
    setRequestError(null);
    setVerifyError(null);
  };

  const handleDirectCodeAccess = () => {
    setAccessMethod('direct-code');
    setViewMode('direct-code');
  };

  const handleRequestNewAccess = () => {
    setAccessMethod('request');
    setViewMode('request');
    setErrorModal({ isOpen: false });
  };

  const handleDirectCodeSubmit = async (e) => {
    e.preventDefault();
    setVerifyError(null);
    
    console.log('🔍 Direct code verification:', {
      email: email.trim(),
      code: accessCode.trim(),
      statusFilter: statusFilter || 'none'
    });
    
    if (!email.trim() || !email.includes('@')) {
      setVerifyError('Please enter a valid email address');
      return;
    }
    
    if (!accessCode.trim() || accessCode.trim().length !== 6) {
      setVerifyError('Please enter a valid 6-digit access code');
      return;
    }

    try {
      const result = await verifyCodeMutation.mutateAsync({
        email: email.trim(),
        code: accessCode.trim(),
        status: statusFilter || undefined
      });
      
      console.log('✅ Direct verification successful:', {
        bookingsCount: result.bookings?.length || 0,
        hasToken: !!result.token,
        result
      });
      
      setCurrentBookings(result.bookings || []);
      setGuestToken(result.token);
      setViewMode('view');
    } catch (error) {
      console.error('Code verification failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        isTokenExpired: error.isTokenExpired,
        isTokenInvalid: error.isTokenInvalid,
        isRateLimit: error.isRateLimit,
        userFriendlyMessage: error.userFriendlyMessage
      });
      
      if (error.isTokenExpired || error.isRateLimit) {
        // Reset to request new access
        setAccessCode('');
        setViewMode('request');
        setRequestError(error.userFriendlyMessage);
      } else if (error.isTokenInvalid) {
        // Clear the invalid code but stay on same screen
        setAccessCode('');
        setVerifyError(error.userFriendlyMessage);
      } else {
        setVerifyError(error.userFriendlyMessage || error.message);
      }
    }
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
    <div 
      className="w-full h-full bg-cover bg-center bg-no-repeat text-light overflow-y-auto relative"
      style={{
        backgroundImage: 'url("../public/images/hero.jpg")',
        minHeight: '100%',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/60"></div>
      
      {/* Content */}
      <div className="relative max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
          Access Your Booking
        </h1>

        {renderMagicLinkNotice()}

        {/* Access Request Form */}
        {viewMode === 'request' && (
          <>
            {accessMethod === 'request' ? (
              <>
                <div className="mb-6">
                  <p className="text-light/80 mb-4">
                    Enter your email address to request new access codes. You'll receive an email with your booking ID, a fresh 6-digit code, and magic link.
                  </p>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleDirectCodeAccess}
                      className="text-yellow hover:text-yellow/80 text-sm underline"
                    >
                      Already have a code? Click here
                    </button>
                  </div>
                </div>

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
            ) : null}
            
            {/* Success Message for Access Request */}
            {requestAccessMutation.isSuccess && viewMode === 'request' && !errorModal.isOpen && (
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-dark text-xs font-bold">✓</span>
                  </div>
                  <span className="text-green-400 font-semibold">Access Codes Sent!</span>
                </div>
                <p className="text-light/80 text-sm">
                  Check your email inbox for your 6-digit access code and magic link. If you don't see it, please check your spam folder.
                </p>
              </div>
            )}

          </>
        )}

        {/* Direct Code Access Form */}
        {viewMode === 'direct-code' && (
          <>
            <div className="mb-6">
              <p className="text-light/80 mb-4">
                Enter your email address and the 6-digit access code from your previous email to access your bookings.
              </p>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRequestNewAccess}
                  className="text-yellow hover:text-yellow/80 text-sm underline"
                >
                  Don't have a code? Request new access codes
                </button>
              </div>
            </div>

            <form onSubmit={handleDirectCodeSubmit} className="mb-6 space-y-4">
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

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={verifyCodeMutation.isPending || !email.trim() || accessCode.length !== 6}
                  className="px-6 py-3 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Key className="w-5 h-5" />
                  <span>{verifyCodeMutation.isPending ? 'Verifying...' : 'Access Bookings'}</span>
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
              <div className={`p-4 rounded-lg mb-4 border ${
                tokenBookingsError.isTokenExpired || tokenBookingsError.isRateLimit
                  ? 'bg-yellow-600/20 text-yellow-400 border-yellow-400/30' 
                  : tokenBookingsError.isTokenInvalid
                  ? 'bg-orange-600/20 text-orange-400 border-orange-400/30'
                  : 'bg-red-600/20 text-red-400 border-red-400/30'
              }`}>
                <p className="font-medium">
                  {tokenBookingsError.isTokenExpired ? 'Access Expired' 
                   : tokenBookingsError.isRateLimit ? 'Rate Limited'
                   : tokenBookingsError.isTokenInvalid ? 'Invalid Access'
                   : tokenBookingsError.isNotFound ? 'Access Not Found'
                   : 'Error loading bookings'}
                </p>
                <p className="text-sm mt-1">
                  {tokenBookingsError.userFriendlyMessage || tokenBookingsError.message}
                </p>
                {tokenBookingsError.isTokenExpired || tokenBookingsError.isRateLimit || tokenBookingsError.isNotFound ? (
                  <button
                    onClick={handleStartOver}
                    className="mt-2 px-4 py-2 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors"
                  >
                    Request New Access
                  </button>
                ) : tokenBookingsError.isTokenInvalid ? (
                  <button
                    onClick={handleStartOver}
                    className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Check Link & Try Again
                  </button>
                ) : (
                  <button
                    onClick={handleStartOver}
                    className="mt-2 px-4 py-2 bg-yellow hover:bg-yellow/90 text-dark font-semibold rounded-lg transition-colors"
                  >
                    Try Another Method
                  </button>
                )}
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
          </div>
        )}

        {/* Help Section - Show only on access screen */}
        {(viewMode === 'request' || viewMode === 'direct-code') && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow mb-3">How it works</h3>
            <ul className="space-y-2 text-light/80">
              <li className="flex items-start space-x-2">
                <span className="text-yellow mt-1">•</span>
                <span>If you already have a 6-digit code from a previous email, use "Already have a code?" option</span>
              </li>
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

        {/* Error Modal */}
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal({ isOpen: false })}
          title={errorModal.title}
          message={errorModal.message}
          type={errorModal.type}
          details={errorModal.details}
          onRetry={errorModal.onRetry}
        />
      </div>
    </div>
  );
}