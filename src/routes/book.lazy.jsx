import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBookRide } from '../hooks/useBooking';
import AddressAutocomplete from '../components/AddressAutocomplete';
import BookingForm from '../components/BookingForm';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError';
import BookingLoading from '../components/BookingLoading';

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isAuthenticated } = useAuth();
  const [bookingState, setBookingState] = useState('form'); // 'form', 'loading', 'success', 'error'
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingFormData, setBookingFormData] = useState(null); // Store form data for success screen
  const [error, setError] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const bookRideMutation = useBookRide();

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
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rideType: formData.rideType,
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        date: formData.date,
        time: formData.time,
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage) || 0,
        notes: formData.notes || '',
      };

      // Basic validation
      if (bookingData.passengers < 1 || bookingData.passengers > 8) {
        throw new Error('Number of passengers must be between 1 and 8.');
      }

      if (!pickupLocation.trim()) {
        throw new Error('Please enter a pickup location.');
      }

      if (!dropoffLocation.trim()) {
        throw new Error('Please enter a drop-off location.');
      }

      // Store form data for success screen
      setBookingFormData({
        ...bookingData,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        your_name: bookingData.name,
        phone_number: bookingData.phone,
        number_of_passengers: bookingData.passengers,
        number_of_luggage: bookingData.luggage,
        ride_type: bookingData.rideType,
        additional_notes: bookingData.notes,
        status: 'pending' // Set status to pending
      });

      const result = await bookRideMutation.mutateAsync(bookingData);
      
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
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        {renderContent()}
      </div>
    </div>
  );
}