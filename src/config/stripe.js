import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key
// For development, use test key: pk_test_...
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

export default stripePromise;