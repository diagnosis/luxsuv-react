import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';

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