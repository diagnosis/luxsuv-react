// API Configuration for LuxSUV Backend
const API_CONFIG = {
  // Base URL - can be overridden by environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // API Endpoints
  ENDPOINTS: {
    // Guest booking endpoints
    BOOKING: {
      CREATE_GUEST: '/api/v1/bookings/guest',
      ACCESS_REQUEST: '/api/v1/bookings/access/request',
      ACCESS_VERIFY: '/api/v1/bookings/access/verify',
      VIEW: '/api/v1/bookings/view',
      UPDATE: '/api/v1/bookings',
      CANCEL: '/api/v1/bookings/{id}/cancel',
      PAY: '/api/v1/bookings/{id}/pay',
    },
    
    // Admin endpoints (for future admin app)
    ADMIN: {
      LOGIN: '/api/v1/admin/login',
      BOOKINGS: '/api/v1/admin/bookings',
      UPDATE_STATUS: '/api/v1/admin/bookings/{id}/status',
    },
    //
    
    // Development endpoints
    DEV: {
      OUTBOX: '/dev/outbox',
      EMAIL: '/dev/outbox/email',
    }
  },
  
  // Request configuration
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Helper function to build full URL
export const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Replace path parameters like {id}
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  
  return url;
};

// Helper function to get headers with auth token
export const getAuthHeaders = (token = null) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function for API requests with retry logic
export const apiRequest = async (url, options = {}, retryCount = 0) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS && !error.name === 'AbortError') {
      console.warn(`API request failed, retrying... (${retryCount + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiRequest(url, options, retryCount + 1);
    }
    throw error;
  }
};

export default API_CONFIG;