import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useCreateGuestBooking } from '../hooks/useBooking';
import BookingForm from '../components/BookingForm';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import BookingLoading from '../components/BookingLoading';
import { Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/book')({
  validateSearch: (search) => ({
    guest: search.guest === true || search.guest === 'true',
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isAuthenticated, token } = useAuth();
  const search = useSearch({ from: '/book' });
  const [isGuestMode, setIsGuestMode] = useState(search.guest || false);
  const [bookingState, setBookingState] = useState('form'); // 'form', 'loading', 'success', 'error'
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingFormData, setBookingFormData] = useState(null); // Store form data for success screen
  const [error, setError] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const createGuestBookingMutation = useCreateGuestBooking();

  // Set guest mode based on URL search params
  useEffect(() => {
    if (search.guest) {
      setIsGuestMode(true);
    }
  }, [search.guest]);

  // Pre-fill form with user data if authenticated
  const getInitialFormData = () => {
    if (isAuthenticated && user) {
      return { name: user.name || '', email: user.email || '', phone: user.phone || '' };
    }
    return {};
  };

  const handleSubmit = async (formData) => {
    setBookingState('loading');
    setError(null);

    try {
      console.log('📋 Booking submission started:', {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        userEmail: user?.email,
        formEmail: formData.email
      });
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        scheduled_at: formData.scheduled_at,
      };

      // Enhanced validation
      const validationErrors = [];
      
      // Basic validation
      if (!bookingData.pickup?.trim()) {
        validationErrors.push('Please enter a pickup location');
      }

      if (!bookingData.dropoff?.trim()) {
        validationErrors.push('Please enter a drop-off location');
      }
      
      if (!bookingData.name?.trim()) {
        validationErrors.push('Please enter your full name');
      }
      
      if (!bookingData.email?.trim() || !bookingData.email.includes('@')) {
        validationErrors.push('Please enter a valid email address');
      }
      
      if (!bookingData.phone?.trim()) {
        validationErrors.push('Please enter your phone number');
      }
      
      if (!bookingData.scheduled_at) {
        validationErrors.push('Please select a date');
      }
      
      // Validate date is not in the past
      if (bookingData.scheduled_at) {
        const bookingDateTime = new Date(bookingData.scheduled_at);
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        
        if (bookingDateTime < oneHourFromNow) {
          validationErrors.push('Booking must be at least 1 hour in advance');
        }
      }
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('. '));
      }

      console.log('📋 Final booking data before submission:', bookingData);
      
      // Store form data for success screen
      setBookingFormData({
        ...bookingData,
        your_name: bookingData.name,
        phone_number: bookingData.phone,
        status: 'pending' // Set status to pending
      });

      // Submit guest booking
      const result = await createGuestBookingMutation.mutateAsync(bookingData);

      console.log('✅ Booking submission successful:', result);
      
      // Combine API result with form data for complete booking info
      setBookingResult({
        ...result,
        ...bookingFormData,
        id: result.id,
        status: 'pending' // Ensure status is pending
      });

      setBookingState('success');

      // Reset form data
      setPickupLocation('');
      setDropoffLocation('');
    } catch (err) {
      console.error('❌ Booking submission failed:', err);
      setError(err.message);
      setBookingState('error');
    }
  };

  const handleRetry = () => {
    setBookingState('form');
    setError(null);
  };

  const handleNewBooking = () => {
    setBookingState('form');
    setBookingResult(null);
    setBookingFormData(null);
    setError(null);
    setPickupLocation('');
    setDropoffLocation('');
  };

  // If user is not authenticated and hasn't chosen to continue as guest, show auth prompt
  if (!isAuthenticated && !isGuestMode) {
    return (
        <div className="w-full h-full bg-dark text-light overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
                Book Your Luxury SUV
              </h1>
              <p className="text-light/80 mb-8">
                Sign in to your account for a faster booking experience, or continue as a guest.
              </p>

              {/* Benefits of signing in */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left border border-gray-600">
                <h3 className="text-lg font-semibold text-yellow mb-4">Benefits of signing in:</h3>
                <ul className="space-y-2 text-light/90">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">✓</span>
                    <span>Auto-fill your contact information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">✓</span>
                    <span>Easy access to all your bookings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">✓</span>
                    <span>Faster future bookings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow mt-1">✓</span>
                    <span>Booking history and preferences</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/signin"
                    className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Sign In / Sign Up
                </Link>
                <Link
                    to="/book"
                    search={{ guest: true }}
                    className="bg-gray-700 hover:bg-gray-600 text-light font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Book as Guest
                </Link>
              </div>
            </div>
          </div>
        </div>
    );
  }

  // Render different screens based on booking state
  const renderContent = () => {
    switch (bookingState) {
      case 'loading':
        return <BookingLoading />;

      case 'success':
        return (
            <BookingSuccess
                bookingResult={bookingResult}
                onNewBooking={handleNewBooking}
            />
        );

      case 'error':
        return (
            <BookingError
                error={error}
                onRetry={handleRetry}
                onNewBooking={handleNewBooking}
            />
        );

      default:
        return (
            <BookingForm
                onSubmit={handleSubmit}
                initialData={getInitialFormData()}
                isGuestMode={isGuestMode}
                pickupLocation={pickupLocation}
                setPickupLocation={setPickupLocation}
                dropoffLocation={dropoffLocation}
                setDropoffLocation={setDropoffLocation}
                isSubmitting={bookingState === 'loading'}
            />
        );
    }
  };

  return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          {renderContent()}
        </div>
      </div>
  );
}