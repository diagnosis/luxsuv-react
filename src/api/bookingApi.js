import API_CONFIG, { buildUrl, getAuthHeaders, apiRequest } from '../config/api.js';

export const bookingApi = {
  bookRide: async (bookingData) => {
    console.log('📋 Booking API Call:', {
      hasToken: !!bookingData.token,
      tokenPreview: bookingData.token ? `${bookingData.token.substring(0, 20)}...` : 'No token',
      userEmail: bookingData.email,
      isAuthenticated: !!bookingData.token
    });
    
    const headers = getAuthHeaders();
    
    // Add authorization header if user is authenticated
    if (bookingData.token) {
      headers['Authorization'] = `Bearer ${bookingData.token}`;
      console.log('🔑 Authorization header set:', `Bearer ${bookingData.token.substring(0, 20)}...`);
      delete bookingData.token; // Remove token from body
    } else {
      console.log('⚠️ No token provided - booking as guest');
    }

    // Enhanced request body with better field mapping
    const requestBody = {
      your_name: bookingData.name,
      email: bookingData.email,
      phone_number: bookingData.phone,
      ride_type: bookingData.rideType || 'hourly',
      pickup_location: bookingData.pickupLocation,
      dropoff_location: bookingData.dropoffLocation,
      date: bookingData.date,
      time: bookingData.time,
      number_of_passengers: parseInt(bookingData.passengers) || 1,
      number_of_luggage: parseInt(bookingData.luggage) || 0,
      additional_notes: bookingData.notes || '',
    };

    console.log('📦 Booking Request Body:', requestBody);
    console.log('📋 Request Headers:', headers);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.CREATE);
    const response = await apiRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Booking Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Booking Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Booking Success:', result);
    return result;
  },

  getBookingsByEmail: async (email) => {
    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.GET_BY_EMAIL}/${encodeURIComponent(email)}`);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getBookingsByUser: async (token) => {
    console.log('👤 getBookingsByUser API Call:', {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (!token) {
      console.error('❌ No token provided to getBookingsByUser');
      throw new Error('Authentication token required');
    }

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.GET_BY_USER);
    console.log('🌐 Request URL:', url);
    console.log('📋 Request Headers:', getAuthHeaders(token));
    
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    console.log('📡 getBookingsByUser Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const responseText = await response.text();
      console.log('📄 Error Response Text:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { error: responseText || 'Unknown error' };
      }
      
      console.error('❌ getBookingsByUser Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ getBookingsByUser Success:', result);
    return result;
  },

  updateBooking: async (bookingId, bookingData, token = null) => {
    console.log('📝 Update Booking API Call:', {
      bookingId,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    if (!token) {
      throw new Error('Authentication token required for booking updates');
    }

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.UPDATE}/${bookingId}`);
    const response = await apiRequest(url, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        your_name: bookingData.name,
        email: bookingData.email,
        phone_number: bookingData.phone,
        ride_type: bookingData.rideType || 'hourly',
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        date: bookingData.date,
        time: bookingData.time,
        number_of_passengers: bookingData.passengers,
        number_of_luggage: bookingData.luggage || 0,
        additional_notes: bookingData.notes || '',
      }),
    });

    console.log('📡 Update Booking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Update Booking Error Response:', errorData);
      
      // Enhanced error handling for 403 Forbidden
      if (response.status === 403) {
        const errorMessage = errorData.message || 'You don\'t have permission to modify this booking. This could be because:\n' +
          '• The booking belongs to a different user\n' +
          '• The booking status doesn\'t allow modifications\n' +
          '• Your session has expired\n' +
          'Please try signing in again or contact support if you believe this is an error.';
        throw new Error(errorMessage);
      }
      
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Update Booking Success:', result);
    return result;
  },

  // Update booking with secure token (for guest users)
  updateBookingWithToken: async (bookingId, bookingData, secureToken) => {
    console.log('🔐 Update Booking with Token API Call:', {
      bookingId,
      hasToken: !!secureToken,
      tokenPreview: secureToken ? `${secureToken.substring(0, 20)}...` : 'No token'
    });

    if (!secureToken) {
      throw new Error('Secure token required for guest booking updates');
    }

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.UPDATE_WITH_TOKEN}/${bookingId}/update?token=${encodeURIComponent(secureToken)}`);
    const response = await apiRequest(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        your_name: bookingData.name,
        email: bookingData.email,
        phone_number: bookingData.phone,
        ride_type: bookingData.rideType || 'hourly',
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        date: bookingData.date,
        time: bookingData.time,
        number_of_passengers: bookingData.passengers,
        number_of_luggage: bookingData.luggage || 0,
        additional_notes: bookingData.notes || '',
      }),
    });

    console.log('📡 Update Booking with Token Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Update Booking with Token Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Update Booking with Token Success:', result);
    return result;
  },

  // Generate secure update link for guest users
  generateUpdateLink: async (bookingId, email) => {
    console.log('🔗 Generate Update Link API Call:', { bookingId, email });

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.GENERATE_UPDATE_LINK}/${bookingId}/update-link`);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    console.log('📡 Generate Update Link Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Generate Update Link Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Generate Update Link Success:', result);
    return result;
  },

  // Cancel booking (authenticated users)
  cancelBooking: async (bookingId, reason, token) => {
    console.log('❌ Cancel Booking API Call:', {
      bookingId,
      reason,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.CANCEL}/${bookingId}/cancel`);
    const response = await apiRequest(url, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ reason }),
    });

    console.log('📡 Cancel Booking Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Cancel Booking Error Response:', errorData);
      
      // Enhanced error handling for 403 Forbidden
      if (response.status === 403) {
        const errorMessage = errorData.message || 'You don\'t have permission to cancel this booking. This could be because:\n' +
          '• The booking belongs to a different user\n' +
          '• The booking status doesn\'t allow cancellation\n' +
          '• Your session has expired\n' +
          'Please try signing in again or contact support if you believe this is an error.';
        throw new Error(errorMessage);
      }
      
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Cancel Booking Success:', result);
    return result;
  },

  // Cancel booking with secure token (for guest users)
  cancelBookingWithToken: async (bookingId, reason, secureToken) => {
    console.log('🔐 Cancel Booking with Token API Call:', {
      bookingId,
      reason,
      hasToken: !!secureToken,
      tokenPreview: secureToken ? `${secureToken.substring(0, 20)}...` : 'No token'
    });

    if (!secureToken) {
      throw new Error('Secure token required for guest booking cancellation');
    }

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.CANCEL_WITH_TOKEN}/${bookingId}/cancel?token=${encodeURIComponent(secureToken)}`);
    const response = await apiRequest(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    console.log('📡 Cancel Booking with Token Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Cancel Booking with Token Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Cancel Booking with Token Success:', result);
    return result;
  },

  acceptBooking: async (bookingId, token) => {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.ACCEPT}/${bookingId}/accept`);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getAvailableBookings: async (token) => {
    if (!token) {
      throw new Error('Authentication token required');
    }

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.AVAILABLE);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle both array response and object with bookings array
    if (Array.isArray(result)) {
      return {
        bookings: result,
        count: result.length,
        message: `Found ${result.length} booking(s)`
      };
    }
    
    return result;
  },
};