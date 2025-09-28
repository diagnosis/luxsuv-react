import { useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import BookingForm from '../components/BookingForm';
import PaymentValidation from '../components/PaymentValidation';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import { useCreateGuestBooking } from '../hooks/useBooking';

export const Route = createLazyFileRoute('/book')({
  component: Book,
});

function Book() {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'payment', 'success', 'error'
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [preservedFormData, setPreservedFormData] = useState({});
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const { mutateAsync: createBooking, isPending: loading } = useCreateGuestBooking();

  const handleBookingSubmit = async (formData) => {
    try {
      // Store form data in case we need to restore it
      setPreservedFormData({
        ...formData,
        pickup: pickupLocation,
        dropoff: dropoffLocation
      });
      
      const result = await createBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        scheduled_at: formData.scheduled_at,
        luggage_count: parseInt(formData.luggageCount) || 0,
        passenger_count: parseInt(formData.passengerCount) || 1,
        trip_type: formData.tripType || 'per_ride',
      });

      console.log('📋 Booking created:', result);
      
      // Extract booking ID from various possible response formats
      let bookingData = null;
      if (result?.id) {
        bookingData = result;
      } else if (result?.booking?.id) {
        bookingData = result.booking;
      } else if (result?.data?.id) {
        bookingData = result.data;
      }

      if (bookingData && bookingData.id) {
        setBooking(bookingData);
        setCurrentStep('payment');
        setError(null);
      } else {
        throw new Error('Invalid booking response - missing booking ID');
      }
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      setError(error.message || 'Failed to create booking');
      setCurrentStep('error');
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep('success');
    setPreservedFormData(null); // Clear preserved data on success
  };

  const handlePaymentError = (errorMsg) => {
    setError(errorMsg);
    setCurrentStep('error');
  };

  const handleBackToBooking = () => {
    setCurrentStep('form');
  };

  const handleStartOver = () => {
    // Keep preserved form data for fixing errors
    setCurrentStep('form');
    setError(null);
  };

  const handleCompletelyNewBooking = () => {
    // Clear everything for a fresh start
    setCurrentStep('form');
    setBooking(null);
    setError(null);
    setPreservedFormData(null);
    setPickupLocation('');
    setDropoffLocation('');
  };

  // Restore location data when preserving form data
  useState(() => {
    if (preservedFormData) {
      if (preservedFormData.pickup) setPickupLocation(preservedFormData.pickup);
      if (preservedFormData.dropoff) setDropoffLocation(preservedFormData.dropoff);
    }
  }, [preservedFormData]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <BookingForm 
            onSubmit={handleBookingSubmit}
            isSubmitting={loading}
            initialData={preservedFormData}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            dropoffLocation={dropoffLocation}
            setDropoffLocation={setDropoffLocation}
          />
        );
        
      case 'payment':
        return (
          <Elements stripe={stripePromise}>
            <PaymentValidation 
              booking={booking}
              onComplete={handlePaymentComplete}
              onBack={handleBackToBooking}
              onError={handlePaymentError}
            />
          </Elements>
        );
        
      case 'success':
        return (
          <BookingSuccess 
            booking={booking}
            onNewBooking={handleCompletelyNewBooking}
          />
        );
        
      case 'error':
        return (
          <BookingError 
            error={error}
            onStartOver={handleStartOver}
            onNewBooking={handleCompletelyNewBooking}
          />
        );
        
      default:
        return (
          <BookingForm 
            onSubmit={handleBookingSubmit}
            isSubmitting={loading}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            dropoffLocation={dropoffLocation}
            setDropoffLocation={setDropoffLocation}
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
        {renderCurrentStep()}
      </div>
    </div>
  );
}