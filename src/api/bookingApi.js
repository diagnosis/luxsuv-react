import API_CONFIG, { buildUrl, getAuthHeaders, apiRequest } from '../config/api.js';

const isDev = import.meta.env.DEV;

const logRequest = (method, endpoint, data = null) => {
  if (isDev) {
    console.log(`🔵 API ${method}: ${endpoint}`, data ? { preview: data } : '');
  }
};

const logSuccess = (method, endpoint) => {
  if (isDev) {
    console.log(`✅ API ${method} Success: ${endpoint}`);
  }
};

const logError = (method, endpoint, error) => {
  console.error(`❌ API ${method} Error: ${endpoint}`, error);
};

const handleResponse = async (response, method, endpoint) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    logError(method, endpoint, errorData);
    const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.response = { status: response.status };
    throw error;
  }

  logSuccess(method, endpoint);
  return response.json();
};

export const bookingApi = {
  createGuestBooking: async (bookingData) => {
    logRequest('POST', 'Create Guest Booking', {
      name: bookingData.name,
      email: bookingData.email,
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff
    });

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.CREATE_GUEST);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    return handleResponse(response, 'POST', 'Create Guest Booking');
  },

  createGuestBookingWithPayment: async (bookingData, paymentMethodId) => {
    logRequest('POST', 'Create Booking with Payment', {
      name: bookingData.name,
      email: bookingData.email,
      hasPaymentMethod: !!paymentMethodId
    });

    const url = buildUrl('/api/v1/bookings/guest-with-payment');
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...bookingData,
        payment_method_id: paymentMethodId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError('POST', 'Create Booking with Payment', errorData);

      if (response.status === 422) {
        const error = new Error(errorData.error || 'Payment validation failed. Please check your card information and try again.');
        error.status = response.status;
        error.isPaymentError = true;
        throw error;
      } else if (response.status === 400) {
        const error = new Error(errorData.error || 'Invalid payment method. Please try again.');
        error.status = response.status;
        error.isPaymentMethodError = true;
        throw error;
      } else {
        const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.response = { status: response.status };
        throw error;
      }
    }

    logSuccess('POST', 'Create Booking with Payment');
    return response.json();
  },

  updateBooking: async (bookingId, bookingData, guestToken) => {
    if (!guestToken) {
      throw new Error('Guest token required for booking updates');
    }

    logRequest('PATCH', `Update Booking ${bookingId}`);

    const url = buildUrl(`${API_CONFIG.ENDPOINTS.BOOKING.UPDATE}/${bookingId}`);
    const response = await apiRequest(url, {
      method: 'PATCH',
      headers: getAuthHeaders(guestToken),
      body: JSON.stringify(bookingData),
    });

    return handleResponse(response, 'PATCH', `Update Booking ${bookingId}`);
  },

  requestAccess: async (email) => {
    logRequest('POST', 'Request Access', { email });

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.ACCESS_REQUEST);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    return handleResponse(response, 'POST', 'Request Access');
  },

  verifyAccessCode: async (email, code, status = null) => {
    logRequest('POST', 'Verify Access Code', { email, hasStatus: !!status });

    const requestBody = { email, code };
    if (status) {
      requestBody.status = status;
    }

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.ACCESS_VERIFY);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    return handleResponse(response, 'POST', 'Verify Access Code');
  },

  viewBookings: async (token, status = null) => {
    if (!token) {
      throw new Error('Token is required');
    }

    logRequest('GET', 'View Bookings', { hasToken: true, hasStatus: !!status });

    let url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.VIEW);
    const params = new URLSearchParams({ token });

    if (status) {
      params.append('status', status);
    }

    const response = await apiRequest(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response, 'GET', 'View Bookings');
  },

  cancelBooking: async (bookingId, guestToken) => {
    if (!guestToken) {
      throw new Error('Guest token required for cancellation');
    }

    logRequest('PATCH', `Cancel Booking ${bookingId}`);

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.CANCEL, { id: bookingId });
    const response = await apiRequest(url, {
      method: 'PATCH',
      headers: getAuthHeaders(guestToken),
    });

    return handleResponse(response, 'PATCH', `Cancel Booking ${bookingId}`);
  },

  getOutboxEmails: async () => {
    const url = buildUrl(API_CONFIG.ENDPOINTS.DEV.OUTBOX);
    const response = await apiRequest(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response, 'GET', 'Get Outbox Emails');
  },

  getEmailContent: async (filename) => {
    const url = buildUrl(API_CONFIG.ENDPOINTS.DEV.EMAIL);
    const response = await apiRequest(`${url}?file=${encodeURIComponent(filename)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('GET', 'Get Email Content', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    logSuccess('GET', 'Get Email Content');
    return response.text();
  },

  startCheckout: async (bookingId) => {
    logRequest('POST', `Start Checkout ${bookingId}`);

    const url = buildUrl(API_CONFIG.ENDPOINTS.BOOKING.PAY, { id: bookingId });
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      logError('POST', `Start Checkout ${bookingId}`, err);
      throw new Error(err.error || err.message || `HTTP ${response.status}`);
    }

    logSuccess('POST', `Start Checkout ${bookingId}`);
    const { url: checkoutUrl } = await response.json();
    return checkoutUrl;
  },

  validatePayment: async (bookingId) => {
    if (!bookingId) {
      throw new Error('Booking ID is required for payment validation');
    }

    logRequest('POST', `Validate Payment ${bookingId}`);

    const url = buildUrl(`/api/v1/bookings/${bookingId}/validate-payment`);
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return handleResponse(response, 'POST', `Validate Payment ${bookingId}`);
  },

  confirmValidation: async (setupIntentId) => {
    logRequest('POST', 'Confirm Validation', { setupIntentId });

    const url = buildUrl('/api/v1/payments/confirm-validation');
    const response = await apiRequest(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ setup_intent_id: setupIntentId }),
    });

    return handleResponse(response, 'POST', 'Confirm Validation');
  },
};
