import { useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import AtomicBookingForm from '../components/AtomicBookingForm';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import { useCreateGuestBookingWithPayment } from '../hooks/useBooking';

export const Route = createLazyFileRoute('/book')({
  component: Book,
});

function Book() {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'success', 'error'
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [preservedFormData, setPreservedFormData] = useState({});
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const { mutateAsync: createBookingWithPayment, isPending: loading } = useCreateGuestBookingWithPayment();

  const handleAtomicBookingSubmit = async (bookingData, paymentMethodId) => {
    try {
      const completeFormData = bookingData;
      setPreservedFormData(completeFormData);
      
      const result = await createBookingWithPayment({
        bookingData,
        paymentMethodId
      });

      console.log('📋 Atomic booking created:', result);
      
      // Extract booking data from the atomic response
      let finalBookingData = null;
      if (result?.booking?.id) {
        finalBookingData = result.booking;
      } else if (result?.id) {
        finalBookingData = result;
      }

      if (finalBookingData && finalBookingData.id) {
        console.log('📋 Complete form data:', completeFormData);
        console.log('📋 API response data:', finalBookingData);
        
        // Merge form data with API response
        setBooking({
          ...completeFormData,
          ...finalBookingData,
          // Keep form data for proper display
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          pickup: bookingData.pickup,
          dropoff: bookingData.dropoff,
          scheduled_at: bookingData.scheduled_at,
          passenger_count: bookingData.passenger_count,
          luggage_count: bookingData.luggage_count,
          trip_type: bookingData.trip_type,
          // Keep API response data for status
          id: finalBookingData.id,
          status: finalBookingData.status || 'pending',
          payment_status: 'validated', // Atomic operation means payment is validated
        });
        
        // Go directly to success - no separate payment validation step
        setCurrentStep('success');
        setError(null);
      } else {
        throw new Error('Invalid atomic booking response - missing booking ID');
      }
    } catch (error) {
      console.error('❌ Atomic booking creation failed:', error);
      setError(error.userFriendlyMessage || error.message || 'Failed to create booking with payment validation');
      setCurrentStep('error');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setError(null);
    if (preservedFormData.pickup) {
      setPickupLocation(preservedFormData.pickup);
    }
    if (preservedFormData.dropoff) {
      setDropoffLocation(preservedFormData.dropoff);
    }
  };

  const handleCompletelyNewBooking = () => {
    // Clear everything for a fresh start
    setCurrentStep('form');
    setBooking(null);
    setError(null);
    setPreservedFormData({});
    setPickupLocation('');
    setDropoffLocation('');
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <Elements stripe={stripePromise}>
            <AtomicBookingForm 
              onSubmit={handleAtomicBookingSubmit}
              initialData={preservedFormData}
              pickupLocation={pickupLocation}
              setPickupLocation={setPickupLocation}
              dropoffLocation={dropoffLocation}
              setDropoffLocation={setDropoffLocation}
              isSubmitting={loading}
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
          <Elements stripe={stripePromise}>
            <AtomicBookingForm 
            onSubmit={handleAtomicBookingSubmit}
            isSubmitting={loading}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            dropoffLocation={dropoffLocation}
            setDropoffLocation={setDropoffLocation}
            />
          </Elements>
        );
    }
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat text-light overflow-y-auto"
      style={{
        backgroundImage: 'linear-gradient(rgba(31, 41, 55, 0.6), rgba(31, 41, 55, 0.6)), url("../public/images/hero.jpg")',
        minHeight: '100%',
      }}
    >
      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}