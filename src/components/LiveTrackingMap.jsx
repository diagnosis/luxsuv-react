import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Zap, Phone, AlertCircle } from 'lucide-react';

const LiveTrackingMap = ({ 
  bookingId, 
  trackingData, 
  isLoading = false, 
  error = null,
  className = "" 
}) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location for better map centering
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get user location:', error);
        }
      );
    }
  }, []);

  // Initialize or update map when tracking data changes
  useEffect(() => {
    if (!trackingData?.current_location || !mapRef.current) return;

    try {
      // For this example, I'll create a simple map placeholder
      // In production, you'd integrate with Google Maps, Mapbox, or similar
      const location = trackingData.current_location;
      console.log('📍 Updating map with location:', location);
      
      // This is where you'd update your actual map component
      // Example: map.setCenter({ lat: location.latitude, lng: location.longitude });
      
    } catch (error) {
      console.error('Map update error:', error);
      setMapError(error.message);
    }
  }, [trackingData]);

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-400/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Tracking Error</span>
        </div>
        <p className="text-red-300 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-600 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-yellow">
          <div className="w-5 h-5 border-2 border-yellow border-t-transparent rounded-full animate-spin"></div>
          <span>Loading tracking information...</span>
        </div>
      </div>
    );
  }

  if (!trackingData?.tracking_active) {
    return (
      <div className={`bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-blue-400 mb-2">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Tracking Not Active</span>
        </div>
        <p className="text-light/80 text-sm">
          Your driver will start location tracking when they begin your trip.
        </p>
      </div>
    );
  }

  const location = trackingData.current_location;
  const driverInfo = trackingData.driver_info;

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-600 overflow-hidden ${className}`}>
      {/* Map Container */}
      <div className="relative">
        {/* Map Placeholder - Replace with actual map component */}
        <div 
          ref={mapRef}
          className="h-64 bg-gray-700 flex items-center justify-center relative"
        >
          {mapError ? (
            <div className="text-red-400 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Map unavailable</p>
            </div>
          ) : (
            <div className="text-light text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-yellow" />
              <p className="text-sm mb-1">Live Driver Location</p>
              {location && (
                <p className="text-xs text-light/60">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Real-time indicator */}
          <div className="absolute top-3 right-3 flex items-center space-x-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>

        {/* Driver Status Bar */}
        {driverInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-semibold text-sm">
                  {driverInfo.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-medium text-sm">{driverInfo.name || 'Your Driver'}</p>
                  <p className="text-xs text-white/80">
                    {trackingData.status?.ride_status || 'En Route'}
                  </p>
                </div>
              </div>
              {driverInfo.phone && (
                <a 
                  href={`tel:${driverInfo.phone}`}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full text-xs transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tracking Details */}
      <div className="p-4 space-y-3">
        {/* Location and Speed */}
        {location && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-yellow" />
              <div>
                <p className="text-xs text-gray-400">Speed</p>
                <p className="text-sm font-medium text-light">
                  {location.speed ? `${Math.round(location.speed)} mph` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow" />
              <div>
                <p className="text-xs text-gray-400">Last Update</p>
                <p className="text-sm font-medium text-light">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ride Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-light">
              {trackingData.status?.booking_status || 'Processing'}
            </span>
          </div>
          <div className="text-sm text-light/80">
            Booking #{bookingId}
          </div>
        </div>

        {/* Additional ride info */}
        {trackingData.status?.ride_status && (
          <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow rounded-full animate-pulse"></div>
              <span className="text-yellow font-medium text-sm">
                {trackingData.status.ride_status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingMap;