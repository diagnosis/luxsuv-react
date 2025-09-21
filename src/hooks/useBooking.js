import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';

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
    mutationFn: ({ email, bookingId }) => {
      console.log('🔑 useRequestAccess:', { email, bookingId });
      return bookingApi.requestAccess(email, bookingId);
    },
    onSuccess: (data) => {
      console.log('Access request successful:', data);
    },
    onError: (error) => {
      console.error('Access request failed:', error);
    },
  });
};

// Hook for verifying access code
export const useVerifyAccessCode = () => {
  return useMutation({
    mutationFn: ({ email, bookingId, code }) => {
      console.log('🔍 useVerifyAccessCode:', { email, bookingId, code });
      return bookingApi.verifyAccessCode(email, bookingId, code);
    },
    onSuccess: (data) => {
      console.log('Code verification successful:', data);
    },
    onError: (error) => {
      console.error('Code verification failed:', error);
    },
  });
};

// Hook for viewing booking via token
export const useViewBooking = (token) => {
  return useQuery({
    queryKey: ['booking', 'view', token],
    queryFn: () => bookingApi.viewBooking(token),
    enabled: !!token,
    staleTime: 0, // Don't cache since tokens are single-use
    retry: false, // Don't retry since tokens are single-use
    onSuccess: (data) => {
      console.log('View booking successful:', data);
    },
    onError: (error) => {
      console.error('View booking failed:', error);
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