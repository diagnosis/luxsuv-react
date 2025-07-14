const API_BASE_URL = 'http://localhost:8080';

export const bookingApi = {
  bookRide: async (bookingData) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (bookingData.token) {
      headers['Authorization'] = `Bearer ${bookingData.token}`;
      delete bookingData.token; // Remove token from body
    }

    const response = await fetch(`${API_BASE_URL}/book-ride`, {
      method: 'POST',
      headers,
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