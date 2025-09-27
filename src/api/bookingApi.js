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
      luggage_count: bookingData.luggage_count || 0,
      passenger_count: bookingData.passenger_count || 1,
      trip_type: bookingData.trip_type || 'per_ride',
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
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Booking Created:', result);
    return result;
  },

  // Update booking with guest JWT token
  updateBooking: async (bookingId, bookingData, guestToken) => {
    console.log('📝 Updating Booking:', {
      bookingId,
      name: bookingData.name,
      phone: bookingData.phone,
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff,
      scheduled_at: bookingData.scheduled_at,
      luggage_count: bookingData.luggage_count,
      passenger_count: bookingData.passenger_count,
      trip_type: bookingData.trip_type,
      hasToken: !!guestToken
    });
    
    if (!guestToken) {
      throw new Error('Guest token required for booking updates');
    }

    const requestBody = {
      name: bookingData.name,
      phone: bookingData.phone,
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff,
      scheduled_at: bookingData.scheduled_at,
      luggage_count: bookingData.luggage_count || 0,
      passenger_count: bookingData.passenger_count || 1,
      trip_type: bookingData.trip_type || 'per_ride',
    };

    console.log('📦 Update Request Body:', requestBody);
    
    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.UPDATE}/${bookingId}`);
    const response = await apiRequest(url, {
      method: 'PATCH',
      headers: getAuthHeaders(guestToken),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Update Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Update Booking Error:', errorData);
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Booking Updated:', result);
    return result;
  },

  // Request access tokens for an existing booking
  requestAccess: async (email) => {
    console.log('🔑 Requesting Access:', { email });
    
    const requestBody = {
      email: email
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
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Access Requested:', result);
    return result;
  },

  // Verify 6-digit access code
  verifyAccessCode: async (email, code, status = null) => {
    console.log('🔍 Verifying Access Code:', { email, code, status });
    
    const requestBody = {
      email: email,
      code: code
    };

    // Add status filter if provided
    if (status) {
      requestBody.status = status;
    }

    console.log('📦 Verify Code Request Body:', requestBody);
    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.ACCESS_VERIFY);
    console.log('📡 Verify Code URL:', url);
    
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Verify Code Response Status:', response.status);
    console.log('📋 Verify Code Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Verify Code Error:', errorData);
      console.error('❌ Response Status:', response.status, response.statusText);
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Code Verified:', result);
    return result;
  },

  // View booking via magic link token
  viewBookings: async (token, status = null) => {
    console.log('👀 Viewing Bookings with Token:', token ? `${token.substring(0, 20)}...` : 'No token', 'Status:', status);
    
    if (!token) {
      throw new Error('Token is required');
    }

    let url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.VIEW);
    const params = new URLSearchParams({ token });
    
    // Add status filter if provided
    if (status) {
      params.append('status', status);
    }

    const response = await apiRequest(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📡 View Booking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ View Booking Error:', errorData);
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Bookings Retrieved:', result);
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
      const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
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
  },
  startCheckout: async (bookingId) => {
    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.PAY, { id: bookingId });
    const res = await apiRequest(url, { method: 'POST', headers: getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    const { url: checkoutUrl } = await res.json();
    return checkoutUrl;
  },
};