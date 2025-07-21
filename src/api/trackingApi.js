import API_CONFIG, { buildUrl, getAuthHeaders, apiRequest } from '../config/api.js';

export const trackingApi = {
  // Get live driver location and ride status for riders
  getLiveTracking: async (bookingId, token) => {
    console.log('📍 Get Live Tracking API Call:', {
      bookingId,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    const url = buildUrl(`/tracking/bookings/${bookingId}/live`);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    console.log('📡 Live Tracking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Live Tracking Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Live Tracking Success:', result);
    return result;
  },

  // Check if tracking is active (lightweight status check)
  getTrackingStatus: async (bookingId, token) => {
    console.log('🔍 Get Tracking Status API Call:', {
      bookingId,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    const url = buildUrl(`/tracking/bookings/${bookingId}/status`);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    console.log('📡 Tracking Status Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Tracking Status Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Tracking Status Success:', result);
    return result;
  },

  // Get comprehensive tracking data including location history
  getTrackingDetails: async (bookingId, token) => {
    console.log('📊 Get Tracking Details API Call:', {
      bookingId,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    const url = buildUrl(`/tracking/bookings/${bookingId}`);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    console.log('📡 Tracking Details Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Tracking Details Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Tracking Details Success:', result);
    return result;
  },
};