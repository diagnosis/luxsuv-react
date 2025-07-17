import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../contexts/AuthContext';

// Hook for getting user's own bookings (authenticated users)
export const useGetUserBookings = () => {
  const { token, isAuthenticated } = useAuth();
  
  console.log('🔍 useGetUserBookings hook:', {
    isAuthenticated,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
  });
  
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: () => {
      console.log('📋 Executing getBookingsByUser query with token:', token ? `${token.substring(0, 20)}...` : 'No token');
      return bookingApi.getBookingsByUser(token);
    },
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    onError: (error) => {
      console.error('❌ User bookings query failed:', error);
    },
    onSuccess: (data) => {
      console.log('✅ User bookings query successful:', data);
    }
  });
};

export const useBookRide = () => {
  const { user, token, isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: (bookingData) => {
      console.log('🔐 useBookRide - Auth Status:', {
        isAuthenticated,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        userEmail: user?.email,
        formEmail: bookingData.email
      });
      
      // Automatically include user context for authenticated users
      const enhancedData = {
        ...bookingData,
        // Include token for authentication
        token: isAuthenticated && token ? token : null,
        // Ensure user info is consistent for authenticated users
        ...(isAuthenticated && user && {
          name: user.name || bookingData.name,
          email: user.email || bookingData.email,
          phone: user.phone || bookingData.phone,
        })
      };
      
      console.log('📋 Enhanced booking data:', {
        hasToken: !!enhancedData.token,
        email: enhancedData.email,
        name: enhancedData.name
      });
      
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
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: ({ bookingId, bookingData, secureToken }) => {
      console.log('🔄 useUpdateBooking mutation:', {
        bookingId,
        hasSecureToken: !!secureToken,
        hasAuthToken: !!token,
        secureTokenPreview: secureToken ? `${secureToken.substring(0, 20)}...` : 'None',
        authTokenPreview: token ? `${token.substring(0, 20)}...` : 'None'
      });
      
      if (secureToken) {
        console.log('📧 Using secure token for guest update');
        return bookingApi.updateBookingWithToken(bookingId, bookingData, secureToken);
      }
      
      if (!token) {
        throw new Error('Authentication required. Please sign in or use a secure update link.');
      }
      
      console.log('🔐 Using auth token for authenticated update');
      return bookingApi.updateBooking(bookingId, bookingData, token);
    },
    onSuccess: (data) => {
      console.log('Booking updated successfully:', data);
    },
    onError: (error) => {
      console.error('Booking update failed:', error);
    },
  });
};

export const useGenerateUpdateLink = () => {
  return useMutation({
    mutationFn: ({ bookingId, email }) => bookingApi.generateUpdateLink(bookingId, email),
    onSuccess: (data) => {
      console.log('Update link generated successfully:', data);
    },
    onError: (error) => {
      console.error('Update link generation failed:', error);
    },
  });
};

export const useCancelBooking = () => {
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: ({ bookingId, reason, secureToken }) => {
      console.log('🔄 useCancelBooking mutation:', {
        bookingId,
        reason,
        hasSecureToken: !!secureToken,
        hasAuthToken: !!token,
        secureTokenPreview: secureToken ? `${secureToken.substring(0, 20)}...` : 'None',
        authTokenPreview: token ? `${token.substring(0, 20)}...` : 'None'
      });
      
      if (secureToken) {
        console.log('📧 Using secure token for guest cancellation');
        return bookingApi.cancelBookingWithToken(bookingId, reason, secureToken);
      }
      
      if (!token) {
        throw new Error('Authentication required. Please sign in or use a secure cancellation link.');
      }
      
      console.log('🔐 Using auth token for authenticated cancellation');
      return bookingApi.cancelBooking(bookingId, reason, token);
    },
    onSuccess: (data) => {
      console.log('Booking cancelled successfully:', data);
    },
    onError: (error) => {
      console.error('Booking cancellation failed:', error);
    },
  });
};