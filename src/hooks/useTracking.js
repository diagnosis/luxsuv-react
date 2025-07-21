import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';
import { useAuth } from '../contexts/AuthContext';
import API_CONFIG from '../config/api.js';

// Hook for getting live tracking data
export const useLiveTracking = (bookingId, options = {}) => {
  const { token } = useAuth();
  const { enabled = true, refetchInterval = 10000 } = options; // Refresh every 10 seconds
  
  return useQuery({
    queryKey: ['tracking', 'live', bookingId],
    queryFn: () => trackingApi.getLiveTracking(bookingId, token),
    enabled: enabled && !!bookingId && !!token,
    refetchInterval: refetchInterval,
    staleTime: 5000, // Consider data stale after 5 seconds
    retry: 3,
    onError: (error) => {
      console.error('❌ Live tracking query failed:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Live tracking query successful:', data);
    }
  });
};

// Hook for checking tracking status (lightweight)
export const useTrackingStatus = (bookingId, options = {}) => {
  const { token } = useAuth();
  const { enabled = true, refetchInterval = 30000 } = options; // Check every 30 seconds
  
  return useQuery({
    queryKey: ['tracking', 'status', bookingId],
    queryFn: () => trackingApi.getTrackingStatus(bookingId, token),
    enabled: enabled && !!bookingId && !!token,
    refetchInterval: refetchInterval,
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 2,
    onError: (error) => {
      console.error('❌ Tracking status query failed:', error);
    }
  });
};

// Hook for comprehensive tracking data
export const useTrackingDetails = (bookingId, options = {}) => {
  const { token } = useAuth();
  const { enabled = true } = options;
  
  return useQuery({
    queryKey: ['tracking', 'details', bookingId],
    queryFn: () => trackingApi.getTrackingDetails(bookingId, token),
    enabled: enabled && !!bookingId && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// WebSocket hook for real-time tracking updates
export const useRealtimeTracking = (bookingId, options = {}) => {
  const { user, token } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const { 
    enabled = true, 
    autoReconnect = true, 
    maxReconnectAttempts = 5,
    onLocationUpdate = null,
    onRideStatusChange = null,
    onDriverUpdate = null
  } = options;

  const connect = useCallback(() => {
    if (!enabled || !bookingId || !user || !token) {
      console.log('⚠️ WebSocket connection skipped - missing requirements:', {
        enabled,
        hasBookingId: !!bookingId,
        hasUser: !!user,
        hasToken: !!token
      });
      return;
    }

    // Prevent multiple connection attempts
    if (wsRef.current?.readyState === WebSocket.CONNECTING || 
        wsRef.current?.readyState === WebSocket.OPEN ||
        isConnectingRef.current) {
      console.log('⚠️ WebSocket connection already exists or in progress');
      return;
    }

    isConnectingRef.current = true;

    try {
      // Use the API base URL but replace http/https with ws/wss
      const wsUrl = API_CONFIG.BASE_URL
        .replace('https://', 'wss://')
        .replace('http://', 'ws://') +
        `/ws/tracking?user_id=${user.id}&role=rider&booking_id=${bookingId}&token=${encodeURIComponent(token)}`;
      
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected for booking:', bookingId);
        isConnectingRef.current = false;
        setConnectionStatus('connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          setLastUpdate({
            ...data,
            timestamp: new Date()
          });

          // Handle different message types
          switch (data.type) {
            case 'location_update':
              console.log('📍 Driver location update:', data.data);
              if (onLocationUpdate) {
                onLocationUpdate(data.data);
              }
              break;
            case 'ride_status_change':
              console.log('🚗 Ride status changed:', data.data);
              if (onRideStatusChange) {
                onRideStatusChange(data.data);
              }
              break;
            case 'driver_update':
              console.log('👨‍✈️ Driver info update:', data.data);
              if (onDriverUpdate) {
                onDriverUpdate(data.data);
              }
              break;
            case 'ride_started':
              console.log('🏁 Ride started');
              if (onRideStatusChange) {
                onRideStatusChange({ status: 'started' });
              }
              break;
            case 'ride_completed':
              console.log('🏁 Ride completed');
              if (onRideStatusChange) {
                onRideStatusChange({ status: 'completed' });
              }
              break;
            default:
              console.log('📋 Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error occurred.');
        // Don't update state here - let onclose handle it
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        isConnectingRef.current = false;
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Set error state only if it wasn't a manual close
        if (event.code !== 1000) {
          setError('Connection lost - attempting to reconnect...');
        } else {
          setError(null);
        }
        // Auto-reconnect if enabled and not a manual close
        if (autoReconnect && event.code !== 1000) {
          console.log('🔄 Attempting to reconnect...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      isConnectingRef.current = false;
      setError(error.message);
      setConnectionStatus('error');
    }
  }, [enabled, bookingId, user, token, onLocationUpdate, onRideStatusChange, onDriverUpdate, autoReconnect]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting WebSocket...');
    
    isConnectingRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setError(null);
  }, []);

  // Connect on mount and when dependencies change
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      isConnectingRef.current = false;
    };
  }, []);

  return {
    connectionStatus,
    lastUpdate,
    error,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
  };
};