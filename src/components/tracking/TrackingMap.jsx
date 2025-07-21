import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';

const TrackingMap = ({ 
  driverLocation, 
  pickupLocation, 
  dropoffLocation, 
  className = "w-full h-64 md:h-96" 
}) => {
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  // Since we don't have Google Maps API key, we'll use a static map approach
  // In production, you would integrate with Google Maps, Mapbox, or similar
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const openInGoogleMaps = () => {
    if (!driverLocation) return;
    
    const url = `https://www.google.com/maps?q=${driverLocation.latitude},${driverLocation.longitude}`;
    window.open(url, '_blank');
  };

  const openDirections = () => {
    if (!driverLocation || !dropoffLocation) return;
    
    // Create directions URL from driver location to dropoff
    const url = `https://www.google.com/maps/dir/${driverLocation.latitude},${driverLocation.longitude}/${encodeURIComponent(dropoffLocation)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow mx-auto mb-2" />
          <p className="text-light">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className={`${className} bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center`}>
        <div className="text-center p-4">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 font-medium">Map Error</p>
          <p className="text-gray-400 text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden`}>
      {/* Map placeholder - In production, integrate with actual map service */}
      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900 relative">
        {/* Grid overlay for map-like appearance */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-600"></div>
            ))}
          </div>
        </div>
        
        {/* Driver location marker */}
        {driverLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-yellow rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute -top-1 -left-1 w-8 h-8 bg-yellow/30 rounded-full animate-ping"></div>
            </div>
          </div>
        )}
        
        {/* Location info overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="font-medium mb-2">Live Tracking</h3>
            {driverLocation ? (
              <div className="space-y-1 text-sm">
                <p>Lat: {driverLocation.latitude?.toFixed(6)}</p>
                <p>Lng: {driverLocation.longitude?.toFixed(6)}</p>
                {driverLocation.speed > 0 && (
                  <p>Speed: {Math.round(driverLocation.speed)} mph</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-300">Waiting for driver location...</p>
            )}
          </div>
        </div>
        
        {/* Map controls */}
        <div className="absolute bottom-4 right-4 space-y-2">
          <button
            onClick={openInGoogleMaps}
            disabled={!driverLocation}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>View in Maps</span>
          </button>
          
          <button
            onClick={openDirections}
            disabled={!driverLocation || !dropoffLocation}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Directions</span>
          </button>
        </div>
      </div>
      
      {/* No location message */}
      {!driverLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Waiting for Driver</h3>
            <p className="text-gray-300">
              Your driver hasn't started sharing their location yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;