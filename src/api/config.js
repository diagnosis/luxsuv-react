// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'https://luxsuv-v4.onrender.com',
  ENDPOINTS: {
    // Auth endpoints
    SIGN_UP: '/register',
    SIGN_IN: '/login',
    
    // Booking endpoints
    BOOK_RIDE: '/book-ride',
    GET_BOOKINGS: '/bookings/email',
    UPDATE_BOOKING: '/bookings',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};