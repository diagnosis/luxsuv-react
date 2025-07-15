// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'https://luxsuv-v4.onrender.com',
  ENDPOINTS: {
    // Auth endpoints
    SIGN_UP: '/auth/signup',
    SIGN_IN: '/auth/signin',
    
    // Booking endpoints
    BOOK_RIDE: '/rider/book-ride',
    GET_BOOKINGS: '/rider/book-rides',
    UPDATE_BOOKING: '/rider/book-ride',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};