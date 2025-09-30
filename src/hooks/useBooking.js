import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { enrichError, getEmailErrorMessage } from '../utils/errorHandling';

export const useCreateGuestBooking = () => {
  return useMutation({
    mutationFn: (bookingData) => bookingApi.createGuestBooking(bookingData),
    onError: (error) => {
      console.error('Guest booking failed:', error);
    },
  });
};

export const useCreateGuestBookingWithPayment = () => {
  return useMutation({
    mutationFn: ({ bookingData, paymentMethodId }) =>
      bookingApi.createGuestBookingWithPayment(bookingData, paymentMethodId),
    onError: (error) => {
      console.error('Atomic booking with payment failed:', error);
      const statusCode = error?.status || error?.response?.status;
      error.statusCode = statusCode;

      if (error.isPaymentError) {
        error.userFriendlyMessage = 'Payment validation failed. Please check your card information and try again.';
      } else if (error.isPaymentMethodError) {
        error.userFriendlyMessage = 'Invalid payment method. Please check your card details.';
      } else {
        error.userFriendlyMessage = error.message || 'Failed to create booking. Please try again.';
      }
    },
  });
};

export const useUpdateBooking = () => {
  return useMutation({
    mutationFn: ({ bookingId, bookingData, guestToken }) =>
      bookingApi.updateBooking(bookingId, bookingData, guestToken),
    onError: (error) => {
      console.error('Booking update failed:', error);
      const statusCode = error?.status || error?.response?.status;

      if (statusCode === 404 && error?.message?.includes('not found')) {
        error.isMagicLinkToken = true;
        error.userFriendlyMessage = 'Magic links are for viewing only. To update bookings, please use your 6-digit access code.';
        return;
      }

      Object.assign(error, enrichError(error));
    },
  });
};

export const useRequestAccess = () => {
  return useMutation({
    mutationFn: ({ email }) => bookingApi.requestAccess(email),
    onError: (error) => {
      console.error('Access request failed:', error);
      const statusCode = error?.status || error?.response?.status;
      const enriched = enrichError(error);

      error.isEmailNotFound = enriched.isEmailNotFound;
      error.isRateLimit = enriched.isRateLimit;
      error.userFriendlyMessage = getEmailErrorMessage(error, statusCode);
      error.statusCode = statusCode;
    },
  });
};

export const useVerifyAccessCode = () => {
  return useMutation({
    mutationFn: ({ email, code, status }) =>
      bookingApi.verifyAccessCode(email, code, status),
    onError: (error) => {
      console.error('Code verification failed:', error);
      Object.assign(error, enrichError(error));
    },
  });
};

export const useViewBookings = (token, status = null) => {
  return useQuery({
    queryKey: ['bookings', 'view', token, status],
    queryFn: () => bookingApi.viewBookings(token, status),
    enabled: !!token,
    staleTime: 0,
    retry: false,
    onError: (error) => {
      console.error('View bookings failed:', error);
      Object.assign(error, enrichError(error));
    },
  });
};

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: ({ bookingId, guestToken }) =>
      bookingApi.cancelBooking(bookingId, guestToken),
    onError: (error) => {
      console.error('Booking cancellation failed:', error);
      Object.assign(error, enrichError(error));
    },
  });
};

export const useStartPayment = () => {
  return useMutation({
    mutationFn: (bookingId) => bookingApi.startCheckout(bookingId),
    onSuccess: (checkoutUrl) => {
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    },
    onError: (error) => {
      console.error('Payment initiation failed:', error);
      const statusCode = error?.status || error?.response?.status;
      error.userFriendlyMessage = error?.message || 'Failed to start payment process. Please try again.';
      error.statusCode = statusCode;
    },
  });
};

export const useValidatePayment = () => {
  return useMutation({
    mutationFn: (bookingId) => bookingApi.validatePayment(bookingId),
    onError: (error) => {
      console.error('Payment validation setup failed:', error);
      const statusCode = error?.status || error?.response?.status;
      error.userFriendlyMessage = error?.message || 'Failed to setup payment validation. Please try again.';
      error.statusCode = statusCode;
    },
  });
};

export const useConfirmValidation = () => {
  return useMutation({
    mutationFn: (setupIntentId) => bookingApi.confirmValidation(setupIntentId),
    onError: (error) => {
      console.error('Payment validation confirmation failed:', error);
      const statusCode = error?.status || error?.response?.status;
      error.userFriendlyMessage = error?.message || 'Failed to confirm payment validation. Please try again.';
      error.statusCode = statusCode;
    },
  });
};

export const useGetOutboxEmails = () => {
  return useQuery({
    queryKey: ['outbox', 'emails'],
    queryFn: bookingApi.getOutboxEmails,
    staleTime: 1000 * 60,
    retry: 1,
  });
};

export const useGetEmailContent = (filename) => {
  return useQuery({
    queryKey: ['outbox', 'email', filename],
    queryFn: () => bookingApi.getEmailContent(filename),
    enabled: !!filename,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
