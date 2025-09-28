import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import BookingForm from '../components/BookingForm';
import PaymentValidation from '../components/PaymentValidation';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import { useBooking } from '../hooks/useBooking';

export const Route = {
  component: Book,
};

function Book() {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'payment', 'success', 'error'
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [preservedFormData, setPreservedFormData] = useState(null);
  
  const { createBooking, loading } = useBooking();

  const handleBookingSubmit = async (formData) => {
    try {
      // Store form data in case we need to restore it
      setPreservedFormData(formData);
      
      const result = await createBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        scheduled_at: formData.scheduledAt,
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
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <BookingForm 
            onSubmit={handleBookingSubmit}
            loading={loading}
            initialFormData={preservedFormData}
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
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {renderCurrentStep()}
      </div>
    </div>
  );
}