import { useState } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';
import AlertModal from './AlertModal';

const formatDateTimeForAPI = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toISOString();
};

const AtomicBookingForm = ({ 
  onSubmit, 
  onBack,
  initialData = {},
  pickupLocation, 
  setPickupLocation, 
  dropoffLocation, 
  setDropoffLocation,
  isSubmitting 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState('');
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    details: null
  });

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Payment System Loading',
        message: 'Payment system is still loading. Please wait a moment and try again.'
      });
      return;
    }

    if (!cardComplete) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Incomplete Card Information',
        message: 'Please complete your card information before submitting.'
      });
      return;
    }

    const formData = new FormData(e.target);
    
    const bookingData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      luggage_count: parseInt(formData.get('luggage_count')) || 0,
      passenger_count: parseInt(formData.get('passenger_count')) || 1,
      trip_type: formData.get('trip_type') || 'per_ride',
      scheduled_at: formatDateTimeForAPI(formData.get('date'), formData.get('time')),
    };

    // Validate required fields
    if (!bookingData.name?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter your full name to continue with your booking.'
      });
      return;
    }
    
    if (!bookingData.email?.trim() || !bookingData.email.includes('@')) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email address to receive booking confirmations and updates.'
      });
      return;
    }
    
    if (!bookingData.phone?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter your phone number so we can contact you about your booking.'
      });
      return;
    }
    
    if (!pickupLocation?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a pickup location for your ride.'
      });
      return;
    }
    
    if (!dropoffLocation?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a drop-off location for your ride.'
      });
      return;
    }
    
    if (!bookingData.date) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select a date for your ride.'
      });
      return;
    }
    
    if (!bookingData.time) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select a time for your ride.'
      });
      return;
    }

    // Validate booking time
    const bookingDateTime = new Date(bookingData.scheduled_at);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));
    
    if (bookingDateTime <= oneHourFromNow) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Booking Time',
        message: 'Bookings must be scheduled at least 1 hour in advance.',
        details: [
          'Please select a date and time at least 1 hour from now',
          'This ensures we have enough time to prepare your luxury SUV'
        ]
      });
      return;
    }

    try {
      console.log('💳 Creating payment method...');
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
        },
      });

      if (error) {
        console.error('❌ Payment method creation failed:', error);
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Payment Method Error',
          message: error.message || 'Failed to process payment method. Please check your card information.',
          details: ['Verify your card details are correct', 'Try a different payment method if needed']
        });
        return;
      }

      console.log('✅ Payment method created:', paymentMethod.id);

      // Submit booking with payment method
      await onSubmit(bookingData, paymentMethod.id);

    } catch (error) {
      console.error('❌ Atomic booking submission failed:', error);
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Booking Failed',
        message: error.userFriendlyMessage || error.message || 'Failed to create booking. Please try again.',
        details: error.isPaymentError ? [
          'Your card information may be incorrect',
          'Try a different payment method',
          'Contact your bank if issues persist'
        ] : [
          'Please check your information and try again',
          'Contact support if the problem persists'
        ]
      });
    }
  };

  const cardOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#EEEEEE',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
      invalid: {
        color: '#EF4444',
      },
    },
  };

  return (
    <>
      <div className="mb-4 md:mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center text-yellow hover:text-yellow/80 mb-4 transition-colors"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}
        
        <h1 className="text-2xl font-bold mb-2 md:text-4xl">
          Book Your Luxury SUV
        </h1>
        <p className="text-light/80 text-sm mb-4">
          Complete booking and payment validation in one step
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Secure Payment Processing</span>
        </div>
        <ul className="text-light/80 text-sm space-y-1">
          <li>• Your payment method will be validated (no charge now)</li>
          <li>• Payment occurs only after ride completion</li>
          <li>• All payment data is encrypted and secure</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Contact Information */}
        <div className="space-y-3 md:space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 md:text-base">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData.name || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 md:text-base">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={initialData.email || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1 md:text-base">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={initialData.phone || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your phone number"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <div>
            <label htmlFor="passenger_count" className="block text-sm font-medium mb-1 md:text-base">
              Passengers *
            </label>
            <select
              id="passenger_count"
              name="passenger_count"
              defaultValue={initialData.passenger_count || 1}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            >
              {[1,2,3,4,5,6,7,8].map(count => (
                <option key={count} value={count}>{count} passenger{count > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="luggage_count" className="block text-sm font-medium mb-1 md:text-base">
              Luggage Count
            </label>
            <select
              id="luggage_count"
              name="luggage_count"
              defaultValue={initialData.luggage_count || 0}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            >
              {Array.from({length: 21}, (_, i) => i).map(count => (
                <option key={count} value={count}>{count} bag{count !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trip_type" className="block text-sm font-medium mb-1 md:text-base">
              Trip Type *
            </label>
            <select
              id="trip_type"
              name="trip_type"
              defaultValue={initialData.trip_type || 'per_ride'}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            >
              <option value="per_ride">Per Ride</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>

        {/* Pickup and Drop-off Locations */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium mb-1 md:text-base">
              Pickup Location *
            </label>
            <AddressAutocomplete
              id="pickupLocation"
              name="pickupLocation"
              value={pickupLocation}
              onChange={setPickupLocation}
              placeholder="Enter pickup location"
              required
              className="text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="dropoffLocation" className="block text-sm font-medium mb-1 md:text-base">
              Drop-off Location *
            </label>
            <AddressAutocomplete
              id="dropoffLocation"
              name="dropoffLocation"
              value={dropoffLocation}
              onChange={setDropoffLocation}
              placeholder="Enter drop-off location"
              required
              className="text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1 md:text-base">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={initialData.date || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              min="2025-05-31"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1 md:text-base">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              defaultValue={initialData.time || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Card Details *
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow focus-within:border-yellow transition-colors">
              <CardElement 
                options={cardOptions}
                onChange={handleCardChange}
              />
            </div>
            {cardError && (
              <p className="text-red-400 text-sm mt-2">{cardError}</p>
            )}
            <p className="text-xs text-light/60 mt-2">
              Your card will be validated but not charged. Payment occurs after ride completion.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-8 py-4 rounded-lg transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
            disabled={isSubmitting || !stripe || !cardComplete}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Booking...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Book & Validate Payment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        details={alertModal.details}
      />
    </>
  );
};

export default AtomicBookingForm;