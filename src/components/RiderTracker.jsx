import { useState, useEffect } from 'react';
import { MapPin, Loader2, RefreshCw, AlertTriangle, Wifi, WifiOff, Clock, Navigation2 } from 'lucide-react';
import { useLiveTracking, useRealtimeTracking } from '../hooks/useTracking';
import LiveTrackingMap from './LiveTrackingMap';

const RiderTracker = ({ booking, onClose = null }) => {
  const [notifications, setNotifications] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Get live tracking data with polling
  const {
    data: trackingData,
    isLoading,
    error: trackingError,
    refetch: refetchTracking
  } = useLiveTracking(booking.id, {
    enabled: true,
    refetchInterval: 15000, // Poll every 15 seconds
  });

  // WebSocket for real-time updates
  const {
    connectionStatus,
    lastUpdate,
    error: wsError,
    connect,
    disconnect,
    isConnected
  } = useRealtimeTracking(booking.id, {
    enabled: true,
    autoReconnect: true,
    onLocationUpdate: (locationData) => {
      console.log('📍 Real-time location update:', locationData);
      // Force refresh of tracking data
      refetchTracking();
      
      addNotification('Driver location updated', 'info');
    },
    onRideStatusChange: (statusData) => {
      console.log('🚗 Real-time status change:', statusData);
      addNotification(`Ride status: ${statusData.status}`, 'info');
      
      // Force refresh of tracking data
      refetchTracking();
    },
    onDriverUpdate: (driverData) => {
      console.log('👨‍✈️ Driver info update:', driverData);
      addNotification('Driver information updated', 'info');
    }
  });

  // Add notification helper
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = { id, message, type, timestamp: new Date() };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep last 5
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Handle connection status changes
  useEffect(() => {
    if (connectionStatus === 'connected') {
      addNotification('Connected to live tracking', 'success');
    } else if (connectionStatus === 'error') {
      addNotification('Connection error - retrying...', 'error');
    }
  }, [connectionStatus]);

  // Check if tracking should be available
  const shouldShowTracking = () => {
    const status = booking.book_status || booking.status;
    return status && ['accepted', 'confirmed', 'in_progress'].includes(status.toLowerCase());
  };

  if (!shouldShowTracking()) {
    return (
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Tracking Not Available</span>
        </div>
        <p className="text-light/80 text-sm">
          Live tracking will be available once a driver accepts your booking.
        </p>
        <div className="mt-3 text-xs text-light/60">
          Current status: <span className="font-medium">{booking.book_status || booking.status || 'Pending'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-light">Live Tracking</h2>
          
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Connecting...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Refresh button */}
          <button
            onClick={() => refetchTracking()}
            disabled={isLoading}
            className="p-2 text-yellow hover:bg-yellow/10 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Refresh tracking"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Minimize/Maximize button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-400 hover:text-light rounded-lg transition-colors"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Navigation2 className={`w-4 h-4 transform transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
          </button>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
              aria-label="Close tracking"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center space-x-2 text-xs px-3 py-2 rounded-lg border ${
                notification.type === 'success' ? 'bg-green-900/20 border-green-400/30 text-green-400' :
                notification.type === 'error' ? 'bg-red-900/20 border-red-400/30 text-red-400' :
                'bg-blue-900/20 border-blue-400/30 text-blue-400'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
              <span>{notification.message}</span>
              <span className="ml-auto text-light/40">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error display */}
      {(trackingError || wsError) && (
        <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Tracking Error</span>
          </div>
          <p className="text-red-300 text-sm">
            {trackingError?.message || wsError || 'Unable to connect to tracking service'}
          </p>
          <button
            onClick={() => {
              refetchTracking();
              connect();
            }}
            className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main tracking content */}
      {!isMinimized && (
        <div className="space-y-4">
          {/* Live Map */}
          <LiveTrackingMap
            bookingId={booking.id}
            trackingData={trackingData}
            isLoading={isLoading}
            error={trackingError?.message}
            className="w-full"
          />

          {/* Booking Summary */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-medium text-light mb-3">Trip Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Pickup</p>
                  <p className="text-light">{booking.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Drop-off</p>
                  <p className="text-light">{booking.dropoff_location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                <Clock className="w-4 h-4 text-yellow" />
                <div>
                  <span className="text-gray-400">Scheduled: </span>
                  <span className="text-light">
                    {new Date(booking.date + ' ' + booking.time).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info (Development Only) */}
          {import.meta.env.DEV && (
            <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-400 font-mono">
              <p>WebSocket: {connectionStatus}</p>
              <p>Last Update: {lastUpdate ? new Date(lastUpdate.timestamp).toLocaleTimeString() : 'None'}</p>
              <p>Tracking Active: {trackingData?.tracking_active ? 'Yes' : 'No'}</p>
              <p>Driver Location: {trackingData?.current_location ? 'Available' : 'N/A'}</p>
            </div>
          )}
        </div>
      )}

      {/* Minimized view */}
      {isMinimized && trackingData?.tracking_active && (
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-light">Tracking Active</span>
              </div>
              {trackingData.driver_info?.name && (
                <span className="text-sm text-light/80">
                  Driver: {trackingData.driver_info.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-light/80">
              {trackingData.current_location?.speed && (
                <span>{Math.round(trackingData.current_location.speed)} mph</span>
              )}
              <span className="text-yellow">#{booking.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderTracker;