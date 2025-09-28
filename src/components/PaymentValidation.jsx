import { useState, useEffect } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, Shield, CircleCheck as CheckCircle, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';
import { bookingApi } from '../api/bookingApi';

const PaymentValidation = ({ booking, onComplete, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupIntent, setSetupIntent] = useState(null);
  const [validationComplete, setValidationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    console.log('PaymentValidation - Received booking:', {
      bookingId: booking?.id,
      hasBooking: !!booking,
      bookingKeys: booking ? Object.keys(booking) : [],
      fullBooking: booking
    });
    
    if (!booking?.id) {
      console.error('❌ PaymentValidation - No booking ID provided:', booking);
      setInitializationError(true);
      setError('Invalid booking data. Please try booking again.');
      return;
    }
    
    initializePaymentValidation();
  }, [booking]);

  const initializePaymentValidation = async () => {
    if (!booking?.id) {
      setInitializationError(true);
      setError('Invalid booking ID. Please try booking again.');
      return;
    }
    
    try {
      setInitializationError(false);
      console.log('🔄 Initializing payment validation for booking:', booking.id);
      const result = await bookingApi.validatePayment(booking.id);
      console.log('✅ Setup intent received:', result);
      setSetupIntent(result);
    } catch (error) {
      console.error('❌ Payment validation initialization failed:', error);
      setInitializationError(true);
      setError('Failed to initialize payment validation. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !setupIntent) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card information.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('💳 Starting payment validation...');
      const cardElement = elements.getElement(CardElement);

      // Confirm the SetupIntent with the card
      const { error, setupIntent: confirmedSetupIntent } = await stripe.confirmCardSetup(
        setupIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking.name,
              email: booking.email,
            },
          },
        }
      );

      if (error) {
        console.error('❌ Stripe setup intent failed:', error);
        throw error;
      }

      console.log('✅ Setup intent confirmed:', confirmedSetupIntent);

      // Confirm validation with backend
      await bookingApi.confirmValidation(confirmedSetupIntent.id);
      console.log('✅ Validation confirmed with backend');
      
      setValidationComplete(true);
      
      // Auto-complete after showing success
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('❌ Payment validation failed:', error);
      
      // Handle specific Stripe errors
      const errorMessages = {
        'card_declined': 'Your card was declined. Please try a different payment method.',
        'insufficient_funds': 'Insufficient funds. Please try a different payment method.',
        'expired_card': 'Your card has expired. Please use a different card.',
        'incorrect_cvc': 'Your card\'s security code is incorrect.',
        'processing_error': 'We encountered an error processing your payment. Please try again.',
        'authentication_required': 'Your bank requires additional authentication.',
      };

      setError(errorMessages[error.code] || error.message || 'Payment validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryValidation = () => {
    if (!booking?.id) {
      setError('Invalid booking data. Please go back and try booking again.');
      return;
    }
    
    setError('');
    setValidationComplete(false);
    setInitializationError(false);
    initializePaymentValidation();
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError('');
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

  if (validationComplete) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-light mb-2">Payment Method Validated!</h2>
          <p className="text-light/80">
            Your card has been successfully validated. Redirecting to confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-yellow hover:text-yellow/80 mb-4 transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Booking Details
        </button>
        
        <h2 className="text-2xl font-bold text-light mb-2">Validate Payment Method</h2>
        <p className="text-light/80 text-sm">
          We'll validate your card but won't charge it until after your ride is complete.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Secure Payment Validation</span>
        </div>
        <ul className="text-light/80 text-sm space-y-1">
          <li>• No charge will be made to your card now</li>
          <li>• Payment occurs only after ride completion</li>
          <li>• All payment data is encrypted and secure</li>
        </ul>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
        <h3 className="font-semibold text-yellow mb-3 flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          Booking Summary
        </h3>
        <div className="text-sm space-y-2 text-light/80">
          <div className="flex justify-between">
            <span>From:</span>
            <span className="text-light font-medium">{booking.pickup}</span>
          </div>
          <div className="flex justify-between">
            <span>To:</span>
            <span className="text-light font-medium">{booking.dropoff}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span className="text-light font-medium">
              {new Date(booking.scheduled_at).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Passengers:</span>
            <span className="text-light">{booking.passenger_count}</span>
          </div>
          <div className="flex justify-between">
            <span>Luggage:</span>
            <span className="text-light">{booking.luggage_count}</span>
          </div>
        </div>
      </div>

      {/* Initialization Error */}
      {initializationError && (
        <div className="mb-6 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-400/30">
          <div className="flex items-start space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Setup Failed</h4>
              <p className="text-sm">{error}</p>
              {!booking?.id && (
                <p className="text-sm mt-2 text-red-300">
                  Booking ID is missing. Please go back and complete your booking again.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Booking</span>
            </button>
            {booking?.id && (
              <button
                onClick={handleRetryValidation}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Setup</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Missing Booking ID Error */}
      {!booking?.id && !initializationError && (
        <div className="mb-6 p-4 bg-orange-900/20 text-orange-400 rounded-lg border border-orange-400/30">
          <div className="flex items-start space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Missing Booking Information</h4>
              <p className="text-sm">
                Booking ID is required for payment validation. Please return to the booking form.
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryValidation}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Booking</span>
          </button>
        </div>
      )}

      {/* Payment Form */}
      {setupIntent && !initializationError && (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-light mb-2">
              Card Details *
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 focus-within:ring-2 focus-within:ring-yellow focus-within:border-yellow transition-colors">
              <CardElement 
                options={cardOptions}
                onChange={handleCardChange}
              />
            </div>
            <p className="text-xs text-light/60 mt-2">
              Enter your card information to validate your payment method
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-400/30">
              <div className="flex items-start space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Payment Validation Failed</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading || validationComplete || !cardComplete || initializationError}
            className="w-full bg-yellow hover:bg-yellow/90 text-dark font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Validating Card...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Validate Payment Method</span>
              </>
            )}
          </button>

          <p className="text-xs text-light/60 mt-3 text-center">
            Your card will be validated but not charged. Payment occurs after ride completion.
          </p>
        </form>
      )}

      {/* Loading Setup */}
      {!setupIntent && !initializationError && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-light/80">Setting up secure payment validation...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentValidation;