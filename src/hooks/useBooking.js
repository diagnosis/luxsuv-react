import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../contexts/AuthContext';

export const useBookRide = () => {
  return useMutation({
    mutationFn: bookingApi.bookRide,
    onSuccess: (data) => {
      console.log('Booking successful:', data);
    },
    onError: (error) => {
      console.error('Booking failed:', error);
    },
  });
};

export const useGetBookingsByEmail = (email) => {
  return useQuery({
    queryKey: ['bookings', email],
    queryFn: () => bookingApi.getBookingsByEmail(email),
    enabled: !!email && email.includes('@'), // Only run query if email is valid
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateBooking = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ bookingId, bookingData }) => bookingApi.updateBooking(bookingId, bookingData, user?.token),
    onSuccess: (data) => {
      console.log('Booking updated successfully:', data);
    },
    onError: (error) => {
      console.error('Booking update failed:', error);
    },
  });
};