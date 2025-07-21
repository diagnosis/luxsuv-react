import { useEffect, useRef, useState } from 'react';
import { buildWsUrl } from '../api/config';
import { useAuth } from '../contexts/AuthContext';

export const useWebSocket = (bookingId = null, options = {}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const {
    onLocationUpdate,
    onRideStatusUpdate,
    onDriverAssigned,
    onRideStarted,
    onRideCompleted,
    autoReconnect = true,
    maxReconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const connect = () => {
    if (!user?.id || !user?.token) {
      console.warn('WebSocket: User not authenticated');
      return;
    }

    try {
      const params = new URLSearchParams({
        user_id: user.id,
        role: user.role || 'rider',
      });

      if (bookingId) {
        params.append('booking_id', bookingId);
      }

      const wsUrl = buildWsUrl(`/ws/tracking?${params.toString()}`);
      console.log('WebSocket connecting to:', wsUrl);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          setLastMessage(data);

          // Handle different message types
          switch (data.type) {
            case 'location_update':
              onLocationUpdate?.(data.data);
              break;
            case 'ride_status_update':
              onRideStatusUpdate?.(data.data);
              break;
            case 'driver_assigned':
              onDriverAssigned?.(data.data);
              break;
            case 'ride_started':
              onRideStarted?.(data.data);
              break;
            case 'ride_completed':
              onRideCompleted?.(data.data);
              break;
            default:
              console.log('Unknown WebSocket message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`WebSocket reconnect attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectAttempts.current);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('WebSocket connection failed');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create WebSocket connection');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;
  };

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  // Connect when user is authenticated
  useEffect(() => {
    if (user?.id && user?.token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user?.id, user?.token, bookingId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    connect,
    disconnect,
  };
};