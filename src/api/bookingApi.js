const API_BASE_URL = 'http://localhost:8080';

export const bookingApi = {
  bookRide: async (bookingData) => {
    console.log('📋 Booking API Call:', {
      hasToken: !!bookingData.token,
      tokenPreview: bookingData.token ? `${bookingData.token.substring(0, 20)}...` : 'No token',
      userEmail: bookingData.email,
      isAuthenticated: !!bookingData.token
    });
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
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
    
    const response = await fetch(`${API_BASE_URL}/book-ride`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateBooking: async (bookingId, bookingData) => {
    const response = await fetch(`${API_BASE_URL}/book-ride/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};