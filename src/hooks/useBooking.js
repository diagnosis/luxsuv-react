import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../contexts/AuthContext';

export const useBookRide = () => {
  const { user, token, isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: (bookingData) => {
      // Automatically include user context for authenticated users
      const enhancedData = {
        ...bookingData,
        // Include token for authentication
        token: isAuthenticated ? token : null,
        // Ensure user info is consistent for authenticated users
        ...(isAuthenticated && user && {
          name: user.name || bookingData.name,
          email: user.email || bookingData.email,
          phone: user.phone || bookingData.phone,
        })
      };
      
      return bookingApi.bookRide(enhancedData);
    },
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
  return useMutation({
    mutationFn: ({ bookingId, bookingData }) => bookingApi.updateBooking(bookingId, bookingData),
    onSuccess: (data) => {
      console.log('Booking updated successfully:', data);
    },
    onError: (error) => {
      console.error('Booking update failed:', error);
    },
  });
};