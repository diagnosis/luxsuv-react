import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';
import { useAuth } from '../contexts/AuthContext';

// Driver - Get navigation URLs
export const useDriverNavigation = (bookingId) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['driver-navigation', bookingId],
    queryFn: () => trackingApi.getDriverNavigation(bookingId, user?.token),
    enabled: !!bookingId && !!user?.token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Driver - Start tracking
export const useStartTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId) => trackingApi.startTracking(bookingId, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries(['tracking-status']);
      queryClient.invalidateQueries(['driver-bookings']);
    },
    onError: (error) => {
      console.error('Start tracking failed:', error);
    },
  });
};

// Driver - Stop tracking
export const useStopTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId) => trackingApi.stopTracking(bookingId, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries(['tracking-status']);
      queryClient.invalidateQueries(['driver-bookings']);
    },
    onError: (error) => {
      console.error('Stop tracking failed:', error);
    },
  });
};

// Rider - Get live tracking
export const useRiderLiveTracking = (bookingId) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['rider-live-tracking', bookingId],
    queryFn: () => trackingApi.getRiderLiveTracking(bookingId, user?.token),
    enabled: !!bookingId && !!user?.token,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
    staleTime: 10000, // 10 seconds
  });
};

// Get tracking status
export const useTrackingStatus = (bookingId) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tracking-status', bookingId],
    queryFn: () => trackingApi.getTrackingStatus(bookingId, user?.token),
    enabled: !!bookingId && !!user?.token,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

// Admin - Get active rides
export const useActiveRides = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['active-rides'],
    queryFn: () => trackingApi.getActiveRides(user?.token),
    enabled: !!user?.token && (user?.role === 'admin' || user?.role === 'dispatcher'),
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 5000,
  });
};

// Driver - Get assigned bookings
export const useDriverBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['driver-bookings'],
    queryFn: () => trackingApi.getDriverBookings(user?.token),
    enabled: !!user?.token && user?.role === 'driver',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Driver - Accept booking
export const useAcceptBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId) => trackingApi.acceptBooking(bookingId, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver-bookings']);
    },
    onError: (error) => {
      console.error('Accept booking failed:', error);
    },
  });
};