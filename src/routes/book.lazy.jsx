import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useCreateGuestBooking } from '../hooks/useBooking';
import BookingForm from '../components/BookingForm';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import BookingLoading from '../components/BookingLoading';

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
});

function RouteComponent() {
  const [bookingState, setBookingState] = useState('form'); // 'form', 'loading', 'success', 'error'
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingFormData, setBookingFormData] = useState(null); // Store form data for success screen
  const [error, setError] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const createGuestBookingMutation = useCreateGuestBooking();

  const getInitialFormData = () => {
    return {};
  };

  const handleSubmit = async (formData) => {
    setBookingState('loading');
    setError(null);

    try {
      console.log('📋 Booking submission started:', {
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
          {renderContent()}
        </div>
      </div>
  );
}