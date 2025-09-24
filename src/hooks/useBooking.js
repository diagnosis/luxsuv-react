import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';

// Helper function to detect expired/used token errors
const isTokenExpiredError = (error, statusCode) => {
  // Check for 410 Gone status (expired or already used)
  if (statusCode === 410) return true;
  
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('expired') ||
    message.includes('already been used') ||
    message.includes('token_expired') ||
    message.includes('token expired') ||
    message.includes('access token has expired')
  );
};

// Helper function to detect invalid token format
const isTokenInvalidError = (error, statusCode) => {
  // Check for 400 Bad Request status
  if (statusCode === 400) return true;
  
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('invalid access') ||
    message.includes('check your code') ||
    message.includes('invalid token') ||
    message.includes('malformed')
  );
};

// Helper function to detect rate limiting
const isRateLimitError = (error, statusCode) => {
  return statusCode === 429;
};

// Helper function to detect not found
const isNotFoundError = (error, statusCode) => {
  return statusCode === 404;
};

// Helper function to detect email not found specifically
const isEmailNotFoundError = (error, statusCode) => {
  if (statusCode !== 404) return false;
  
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('not found') ||
    message.includes('email not found') ||
    message.includes('no bookings found') ||
    statusCode === 404
  );
};

// Helper function to get user-friendly error message with status context
const getTokenErrorMessage = (error, statusCode) => {
  if (isTokenExpiredError(error, statusCode)) {
    const message = error?.message || '';
    if (message.includes('already been used')) {
      return 'This access link or code has already been used. Please request a new one.';
    }
    return 'Your access has expired. Please request a new access code to view your bookings.';
  }
  
  if (isTokenInvalidError(error, statusCode)) {
    const message = error?.message || '';
    if (message.includes('access code')) {
      return 'Invalid access code format. Please check your 6-digit code and try again.';
    }
    return 'Invalid access link. Please check the link or request a new one.';
  }
  
  if (isRateLimitError(error, statusCode)) {
    return 'Too many failed attempts. Please wait a moment and request a new access code.';
  }
  
  if (isNotFoundError(error, statusCode)) {
    return 'Access link not found. Please request a new one.';
  }
  
  return error?.message || 'An unexpected error occurred';
};

// Helper function for email-specific errors
const getEmailErrorMessage = (error, statusCode) => {
  if (isEmailNotFoundError(error, statusCode)) {
    return 'No bookings found for this email address. Please double-check your email and try again, or contact support if you believe this is an error.';
  }
  
  if (isRateLimitError(error, statusCode)) {
    return 'Too many requests. Please wait a moment before trying again.';
  }
  
  return error?.message || 'An unexpected error occurred while requesting access codes.';
};

// Hook for creating guest booking
export const useCreateGuestBooking = () => {
  return useMutation({
    mutationFn: (bookingData) => {
      console.log('🔐 useCreateGuestBooking - Data:', bookingData);
      return bookingApi.createGuestBooking(bookingData);
    },
    onSuccess: (data) => {
      console.log('Guest booking successful:', data);
    },
    onError: (error) => {
      console.error('Guest booking failed:', error);
    },
  });
};

// Hook for requesting access tokens
export const useRequestAccess = () => {
  return useMutation({
    mutationFn: ({ email }) => {
      console.log('🔑 useRequestAccess:', { email });
      return bookingApi.requestAccess(email);
    },
    onSuccess: (data) => {
      console.log('Access request successful:', data);
    },
    onError: (error) => {
      console.error('Access request failed:', error);
      // Add specific handling for different error types
      const statusCode = error?.status || error?.response?.status;
      error.isEmailNotFound = isEmailNotFoundError(error, statusCode);
      error.isRateLimit = isRateLimitError(error, statusCode);
      error.userFriendlyMessage = getEmailErrorMessage(error, statusCode);
      error.statusCode = statusCode;
    },
  });
};

// Hook for verifying access code
export const useVerifyAccessCode = () => {
  return useMutation({
    mutationFn: ({ email, code, status }) => {
      console.log('🔍 useVerifyAccessCode:', { email, code, status });
      return bookingApi.verifyAccessCode(email, code, status);
    },
    onSuccess: (data) => {
      console.log('Code verification successful:', data);
      console.log('Success data details:', {
        hasBookings: !!data.bookings,
        bookingsCount: data.bookings?.length || 0,
        hasToken: !!data.token,
        tokenPreview: data.token ? `${data.token.substring(0, 20)}...` : 'No token'
      });
    },
    onError: (error) => {
      console.error('Code verification failed:', error);
      console.error('Full error object:', {
        name: error.name,
        message: error.message,
        status: error.status,
        response: error.response,
        stack: error.stack
      });
      // Add specific handling for different error types
      const statusCode = error?.status || error?.response?.status;
      error.isTokenExpired = isTokenExpiredError(error, statusCode);
      error.isTokenInvalid = isTokenInvalidError(error, statusCode);
      error.isRateLimit = isRateLimitError(error, statusCode);
      error.isNotFound = isNotFoundError(error, statusCode);
      error.userFriendlyMessage = getTokenErrorMessage(error, statusCode);
      error.statusCode = statusCode;
      console.error('Error categorization:', {
        isTokenExpired: error.isTokenExpired,
        isTokenInvalid: error.isTokenInvalid,
        isRateLimit: error.isRateLimit,
        isNotFound: error.isNotFound,
        userFriendlyMessage: error.userFriendlyMessage,
        statusCode: error.statusCode
      });
    },
  });
};

// Hook for viewing booking via token
export const useViewBookings = (token, status = null) => {
  return useQuery({
    queryKey: ['bookings', 'view', token, status],
    queryFn: () => bookingApi.viewBookings(token, status),
    enabled: !!token,
    staleTime: 0, // Don't cache since tokens are single-use
    retry: false, // Don't retry since tokens are single-use
    onSuccess: (data) => {
      console.log('View bookings successful:', data);
    },
    onError: (error) => {
      console.error('View bookings failed:', error);
      // Add specific handling for different error types
      const statusCode = error?.status || error?.response?.status;
      error.isTokenExpired = isTokenExpiredError(error, statusCode);
      error.isTokenInvalid = isTokenInvalidError(error, statusCode);
      error.isRateLimit = isRateLimitError(error, statusCode);
      error.isNotFound = isNotFoundError(error, statusCode);
      error.userFriendlyMessage = getTokenErrorMessage(error, statusCode);
      error.statusCode = statusCode;
    },
  });
};

// Hook for cancelling booking
export const useCancelBooking = () => {
  return useMutation({
    mutationFn: ({ bookingId, guestToken }) => {
      console.log('❌ useCancelBooking:', { bookingId, hasToken: !!guestToken });
      return bookingApi.cancelBooking(bookingId, guestToken);
    },
    onSuccess: (data) => {
      console.log('Booking cancellation successful:', data);
    },
    onError: (error) => {
      console.error('Booking cancellation failed:', error);
      // Add specific handling for different error types
      const statusCode = error?.status || error?.response?.status;
      error.isTokenExpired = isTokenExpiredError(error, statusCode);
      error.isTokenInvalid = isTokenInvalidError(error, statusCode);
      error.isRateLimit = isRateLimitError(error, statusCode);
      error.isNotFound = isNotFoundError(error, statusCode);
      error.userFriendlyMessage = getTokenErrorMessage(error, statusCode);
      error.statusCode = statusCode;
    },
  });
};

// Development hooks for email outbox
export const useGetOutboxEmails = () => {
  return useQuery({
    queryKey: ['outbox', 'emails'],
    queryFn: bookingApi.getOutboxEmails,
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
  });
};

export const useGetEmailContent = (filename) => {
  return useQuery({
    queryKey: ['outbox', 'email', filename],
    queryFn: () => bookingApi.getEmailContent(filename),
    enabled: !!filename,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

// Legacy hooks for backward compatibility (will need to be updated in components using them)
export const useBookRide = () => {
  console.warn('useBookRide is deprecated, use useCreateGuestBooking instead');
  return useCreateGuestBooking();
};

export const useGetUserBookings = () => {
  console.warn('useGetUserBookings is not available in guest-only mode');
  return {
    data: null,
    isLoading: false,
    error: new Error('User authentication not available in guest-only mode'),
  };
};

export const useGetBookingsByEmail = () => {
  console.warn('useGetBookingsByEmail is not available - use access code verification instead');
  return {
    data: null,
    isLoading: false,
    error: new Error('Direct email lookup not available - use access code verification'),
  };
};

export const useUpdateBooking = () => {
  console.warn('useUpdateBooking is not available in guest-only mode');
  return useMutation({
    mutationFn: () => {
      throw new Error('Booking updates not available in guest-only mode');
    },
  });
};

export const useGenerateUpdateLink = () => {
  console.warn('useGenerateUpdateLink is not available - use access request instead');
  return useRequestAccess();
};