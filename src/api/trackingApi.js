import { API_CONFIG, buildApiUrl } from './config';

export const trackingApi = {
  // Driver Navigation - Get navigation URLs for pickup/dropoff
  getDriverNavigation: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DRIVER_NAVIGATION)}/${bookingId}/navigation`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Driver - Start tracking session
  startTracking: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.START_TRACKING)}/${bookingId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Driver - Update GPS location
  updateLocation: async (locationData, authToken) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.UPDATE_LOCATION), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Driver - Stop tracking session
  stopTracking: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.STOP_TRACKING)}/${bookingId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Rider - Get live tracking data
  getRiderLiveTracking: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.RIDER_LIVE_TRACKING)}/${bookingId}/live`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get tracking status (quick check)
  getTrackingStatus: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TRACKING_STATUS)}/${bookingId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Admin - Get all active rides
  getActiveRides: async (authToken) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_ACTIVE_RIDES), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Admin - Get all active tracking sessions
  getActiveSessions: async (authToken) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_ACTIVE_SESSIONS), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Driver - Get assigned bookings
  getDriverBookings: async (authToken) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DRIVER_BOOKINGS), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Driver - Accept booking
  acceptBooking: async (bookingId, authToken) => {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.ACCEPT_BOOKING)}/${bookingId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};