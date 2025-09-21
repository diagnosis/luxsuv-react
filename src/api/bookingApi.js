import API_CONFIG, { buildUrl, getAuthHeaders, apiRequest } from '../config/api.js';

export const bookingApi = {
  // Create a guest booking
  createGuestBooking: async (bookingData) => {
    console.log('📋 Creating Guest Booking:', {
      name: bookingData.name,
      email: bookingData.email,
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff,
      scheduled_at: bookingData.scheduled_at
    });
    
    const requestBody = {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff,
      scheduled_at: bookingData.scheduled_at, // ISO 8601 format
    };

    console.log('📦 Request Body:', requestBody);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.CREATE_GUEST);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Create Booking Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Booking Created:', result);
    return result;
  },

  // Request access tokens for an existing booking
  requestAccess: async (email, bookingId) => {
    console.log('🔑 Requesting Access:', { email, bookingId });
    
    const requestBody = {
      email: email,
      booking_id: bookingId
    };

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.ACCESS_REQUEST);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Request Access Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Request Access Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Access Requested:', result);
    return result;
  },

  // Verify 6-digit access code
  verifyAccessCode: async (email, bookingId, code) => {
    console.log('🔍 Verifying Access Code:', { email, bookingId, code });
    
    const requestBody = {
      email: email,
      booking_id: bookingId,
      code: code
    };

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.ACCESS_VERIFY);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Verify Code Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Verify Code Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Code Verified:', result);
    return result;
  },

  // View booking via magic link token
  viewBooking: async (token) => {
    console.log('👀 Viewing Booking with Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      throw new Error('Token is required');
    }

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.VIEW);
    const response = await apiRequest(`${url}?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📡 View Booking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ View Booking Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Booking Retrieved:', result);
    return result;
  },

  // Cancel booking with guest JWT token
  cancelBooking: async (bookingId, guestToken) => {
    console.log('❌ Cancelling Booking:', {
      bookingId,
      hasToken: !!guestToken,
      tokenPreview: guestToken ? `${guestToken.substring(0, 20)}...` : 'No token'
    });

    if (!guestToken) {
      throw new Error('Guest token required for cancellation');
    }

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.CANCEL, { id: bookingId });
    const response = await apiRequest(url, {
      method: 'PATCH',
      headers: getAuthHeaders(guestToken),
    });

    console.log('📡 Cancel Booking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Cancel Booking Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Booking Cancelled:', result);
    return result;
  },

  // Development: List outbox emails
  getOutboxEmails: async () => {
    console.log('📧 Getting Outbox Emails');
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.DEV.OUTBOX);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get Outbox Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Outbox Emails:', result);
    return result;
  },

  // Development: Get specific email content
  getEmailContent: async (filename) => {
    console.log('📧 Getting Email Content:', filename);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.DEV.EMAIL);
    const response = await apiRequest(`${url}?file=${encodeURIComponent(filename)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Get Email Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text(); // Email content is plain text
    console.log('✅ Email Content Retrieved');
    return result;
  }
};