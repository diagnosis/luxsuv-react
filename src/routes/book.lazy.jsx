import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useBookRide } from '../hooks/useBooking';
import AddressAutocomplete from '../components/AddressAutocomplete';
import BookingForm from '../components/BookingForm';
import BookingSuccess from '../components/BookingSuccess';
import BookingError from '../components/BookingError.jsx';
import BookingLoading from '../components/BookingLoading';

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
});

function RouteComponent() {
  const [bookingState, setBookingState] = useState('form'); // 'form', 'loading', 'success', 'error'
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  
  const bookRideMutation = useBookRide();

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

      const result = await bookRideMutation.mutateAsync(bookingData);
      setBookingResult(result);
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