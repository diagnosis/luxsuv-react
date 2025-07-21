import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Car,
  Navigation,
  Loader2,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useRiderLiveTracking, useTrackingStatus } from '../../hooks/useTracking';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTrackingNotifications } from '../../hooks/useTrackingNotifications';
import { useAuth } from '../../contexts/AuthContext';
import TrackingMap from './TrackingMap';

const RiderTracking = ({ booking }) => {
  const { user } = useAuth();
  const {
    showDriverAssigned,
    showRideStarted,
    showLocationUpdate,
    showRideCompleted,
    showConnectionLost,
    showConnectionRestored
  } = useTrackingNotifications();
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const { 
    data: trackingData, 
    isLoading: trackingLoading, 
    error: trackingError,
    refetch: refetchTracking 
  } = useRiderLiveTracking(booking?.id);

  const { 
    data: statusData,
    refetch: refetchStatus 
  } = useTrackingStatus(booking?.id);

  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket(booking?.id, {
    onLocationUpdate: (locationData) => {
      setDriverLocation(locationData);
      setLastUpdate(new Date());
      showLocationUpdate(locationData.speed);
      console.log('Driver location updated:', locationData);
    },
    onRideStatusUpdate: (statusData) => {
      setRideStatus(statusData);
      refetchTracking();
      refetchStatus();
      console.log('Ride status updated:', statusData);
    },
    onDriverAssigned: (driverData) => {
      console.log('Driver assigned:', driverData);
      if (driverData.name) {
        showDriverAssigned(driverData.name);
      }
      refetchTracking();
      refetchStatus();
    },
    onRideStarted: (rideData) => {
      console.log('Ride started:', rideData);
      showRideStarted();
      setRideStatus(prev => ({ ...prev, ride_status: 'In Progress' }));
    },
    onRideCompleted: (rideData) => {
      console.log('Ride completed:', rideData);
      showRideCompleted();
      setRideStatus(prev => ({ ...prev, ride_status: 'Completed' }));
    }
  });

  // Update local state when tracking data changes
  useEffect(() => {
    if (trackingData) {
      if (trackingData.current_location) {
        setDriverLocation(trackingData.current_location);
      }
      if (trackingData.status) {
        setRideStatus(trackingData.status);
      }
    }
  }, [trackingData]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp;
    }
  };

  const formatSpeed = (speed) => {
    if (!speed || speed === 0) return 'Stopped';
    return `${Math.round(speed)} mph`;
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-400';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400';
      case 'assigned':
        return 'text-blue-400';
      case 'accepted':
        return 'text-green-400';
      case 'in progress':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return AlertCircle;
    
    switch (status.toLowerCase()) {
      case 'pending':
        return Clock;
      case 'assigned':
      case 'accepted':
        return CheckCircle;
      case 'in progress':
        return Activity;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  if (!booking) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-light mb-2">No Booking Selected</h3>
        <p className="text-gray-400">Select a booking to view live tracking</p>
      </div>
    );
  }

  if (trackingLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow mx-auto mb-4" />
        <p className="text-light">Loading tracking information...</p>
      </div>
    );
  }

  const isTrackingActive = statusData?.tracking_active || trackingData?.tracking_active;
  const bookingStatus = rideStatus?.booking_status || statusData?.booking_status || booking.book_status;
  const rideStatusValue = rideStatus?.ride_status || statusData?.ride_status || booking.ride_status;
  const driverInfo = trackingData?.driver_info;

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-light font-medium">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
        {isTrackingActive && (
          <div className="flex items-center space-x-2 text-green-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Live Tracking Active</span>
          </div>
        )}
      </div>

      {/* Ride Status */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-light mb-4">Ride Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            {(() => {
              const StatusIcon = getStatusIcon(bookingStatus);
              return <StatusIcon className={`w-5 h-5 ${getStatusColor(bookingStatus)}`} />;
            })()}
            <div>
              <p className="text-sm text-gray-400">Booking Status</p>
              <p className={`font-medium ${getStatusColor(bookingStatus)}`}>
                {bookingStatus || 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Car className={`w-5 h-5 ${getStatusColor(rideStatusValue)}`} />
            <div>
              <p className="text-sm text-gray-400">Ride Status</p>
              <p className={`font-medium ${getStatusColor(rideStatusValue)}`}>
                {rideStatusValue || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        {driverInfo && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-md font-medium text-light mb-3">Your Driver</h4>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow text-dark rounded-full flex items-center justify-center font-bold">
                {driverInfo.name?.charAt(0).toUpperCase() || 'D'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-light">{driverInfo.name || 'Driver'}</p>
                {driverInfo.phone && (
                  <a 
                    href={`tel:${driverInfo.phone}`}
                    className="text-yellow hover:text-yellow/80 text-sm flex items-center space-x-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{driverInfo.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Location */}
      {isTrackingActive && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-light mb-4">Live Map</h3>
          
          {/* Interactive Map */}
          <div className="mb-6">
            <TrackingMap
              driverLocation={driverLocation}
              pickupLocation={booking?.pickup_location}
              dropoffLocation={booking?.dropoff_location}
              className="w-full h-64 md:h-80"
            />
          </div>
          
          {driverLocation ? (
            <div className="space-y-4">
              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-yellow" />
                  <div>
                    <p className="text-sm text-gray-400">Coordinates</p>
                    <p className="text-light text-sm">
                      {driverLocation.latitude?.toFixed(6)}, {driverLocation.longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-yellow" />
                  <div>
                    <p className="text-sm text-gray-400">Speed</p>
                    <p className="text-light font-medium">
                      {formatSpeed(driverLocation.speed)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow" />
                  <div>
                    <p className="text-sm text-gray-400">Last Update</p>
                    <p className="text-light text-sm">
                      {formatTime(driverLocation.timestamp || lastUpdate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Integration Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${driverLocation.latitude},${driverLocation.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                </button>
                
                <button
                  onClick={() => {
                    const url = `http://maps.apple.com/?q=${driverLocation.latitude},${driverLocation.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Apple Maps</span>
                </button>
                
                <button
                  onClick={() => {
                    const url = `https://waze.com/ul?q=${driverLocation.latitude},${driverLocation.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Waze</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-light mb-2">Waiting for Location</h4>
              <p className="text-gray-400">
                Your driver hasn't started sharing their location yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Tracking Active */}
      {!isTrackingActive && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-light mb-2">Tracking Not Active</h3>
          <p className="text-gray-400 mb-4">
            Live tracking will begin when your driver starts the trip.
          </p>
          {bookingStatus === 'Pending' && (
            <p className="text-yellow text-sm">
              Your booking is still pending driver acceptance.
            </p>
          )}
        </div>
      )}

      {/* Error State */}
      {trackingError && (
        <div className="bg-red-600/20 text-red-400 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          Error loading tracking data: {trackingError.message}
        </div>
      )}
    </div>
  );
};

export default RiderTracking;