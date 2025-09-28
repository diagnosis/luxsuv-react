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
        <div className="bg-green-900/20 border border-green-400/