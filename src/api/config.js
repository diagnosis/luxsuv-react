// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    // Auth endpoints
    SIGN_UP: '/register',
    SIGN_IN: '/login',
    
    // Booking endpoints
    BOOK_RIDE: '/book-ride',
    GET_BOOKINGS: '/bookings/email',
    UPDATE_BOOKING: '/bookings',
    
    // Tracking endpoints
    DRIVER_NAVIGATION: '/driver/bookings',
    START_TRACKING: '/driver/tracking/bookings',
    UPDATE_LOCATION: '/driver/tracking/location',
    STOP_TRACKING: '/driver/tracking/bookings',
    RIDER_LIVE_TRACKING: '/tracking/bookings',
    TRACKING_STATUS: '/tracking/bookings',
    ADMIN_ACTIVE_RIDES: '/admin/tracking/rides/active',
    ADMIN_ACTIVE_SESSIONS: '/admin/tracking/sessions/active',
    
    // Driver endpoints
    DRIVER_BOOKINGS: '/driver/bookings/assigned',
    ACCEPT_BOOKING: '/driver/bookings',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
// WebSocket URL for real-time tracking
export const buildWsUrl = (path) => {
  const wsProtocol = API_CONFIG.BASE_URL.startsWith('https') ? 'wss' : 'ws';
  const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '');
  return `${wsProtocol}://${baseUrl}${path}`;
};