import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Clock, Zap, Phone, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNGRkQzNjkiLz4KPHBhdGggZD0iTTEyLjUgNUMxNS44MTM3IDUgMTguNSA3LjY4NjI5IDE4LjUgMTFDMTguNSAxNC4zMTM3IDE1LjgxMzcgMTcgMTIuNSAxN0M5LjE4NjI5IDE3IDYuNSAxNC4zMTM3IDYuNSAxMUM2LjUgNy42ODYyOSA5LjE4NjI5IDUgMTIuNSA1WiIgZmlsbD0iIzIyMjgzMSIvPgo8cGF0aCBkPSJNMTIuNSAyNUwxOS41IDM1SDUuNUwxMi41IDI1WiIgZmlsbD0iI0ZGRDM2OSIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNGRkQzNjkiLz4KPHBhdGggZD0iTTEyLjUgNUMxNS44MTM3IDUgMTguNSA3LjY4NjI5IDE4LjUgMTFDMTguNSAxNC4zMTM3IDE1LjgxMzcgMTcgMTIuNSAxN0M5LjE4NjI5IDE3IDYuNSAxNC4zMTM3IDYuNSAxMUM2LjUgNy42ODYyOSA5LjE4NjI5IDUgMTIuNSA1WiIgZmlsbD0iIzIyMjgzMSIvPgo8cGF0aCBkPSJNMTIuNSAyNUwxOS41IDM1SDUuNUwxMi41IDI1WiIgZmlsbD0iI0ZGRDM2OSIvPgo8L3N2Zz4K',
  shadowUrl: '',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom driver marker
const driverIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiMyMkM1NUUiLz4KPHN2ZyB4PSI3IiB5PSI3IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Component to update map view when location changes
const MapController = ({ location, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      // Center map on driver location
      map.setView([location.latitude, location.longitude], 15);
    } else if (userLocation) {
      // Center map on user location if no driver location
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [location, userLocation, map]);

  return null;
};

const LiveTrackingMap = ({ 
  bookingId, 
  trackingData, 
  isLoading = false, 
  error = null,
  className = "" 
}) => {
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
          // Default to a central location if geolocation fails
          setUserLocation({
            lat: 40.7128, // New York City
            lng: -74.0060
          });
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({
        lat: 40.7128,
        lng: -74.0060
      });
    }
  }, []);

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

  // Default center if no location data
  const center = location 
    ? [location.latitude, location.longitude]
    : userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [40.7128, -74.0060]; // Default to NYC

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-600 overflow-hidden ${className}`}>
      {/* Map Container */}
      <div className="relative">
        <div className="h-64 relative">
          {userLocation ? (
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="rounded-t-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Driver location marker */}
              {location && (
                <Marker
                  position={[location.latitude, location.longitude]}
                  icon={driverIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <div className="font-semibold text-green-600 mb-2">
                        {driverInfo?.name || 'Your Driver'}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Speed: {location.speed ? `${Math.round(location.speed)} mph` : 'N/A'}</div>
                        <div>Updated: {new Date(location.timestamp).toLocaleTimeString()}</div>
                        {driverInfo?.phone && (
                          <div className="mt-2">
                            <a 
                              href={`tel:${driverInfo.phone}`}
                              className="inline-block bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Call Driver
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* User location marker if available */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-semibold mb-2">Your Location</div>
                      <div className="text-sm text-gray-600">
                        Current position
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Map controller to update view */}
              <MapController location={location} userLocation={userLocation} />
            </MapContainer>
          ) : (
            <div className="h-full bg-gray-700 flex items-center justify-center">
              <div className="text-light text-center">
                <div className="w-5 h-5 border-2 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Real-time indicator */}
        {trackingData?.tracking_active && (
          <div className="absolute top-3 right-3 flex items-center space-x-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}

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

        {/* Coordinates display */}
        {location && (
          <div className="bg-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Driver Coordinates</p>
            <p className="text-xs font-mono text-yellow">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
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