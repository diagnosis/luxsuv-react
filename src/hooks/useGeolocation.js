import { useState, useEffect, useRef } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef(null);

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    onLocationUpdate,
    onError,
    updateInterval = 30000, // 30 seconds default
  } = options;

  const geolocationOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge,
  };

  const handleSuccess = (position) => {
    const locationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || 0,
      heading: position.coords.heading || 0,
      timestamp: new Date(position.timestamp).toISOString(),
    };

    setLocation(locationData);
    setError(null);
    onLocationUpdate?.(locationData);
  };

  const handleError = (err) => {
    let errorMessage;
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'An unknown location error occurred';
        break;
    }

    setError({ code: err.code, message: errorMessage });
    onError?.(err);
  };

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      const err = new Error('Geolocation is not supported by this browser');
      handleError(err);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );
  };

  const startWatching = () => {
    if (!navigator.geolocation) {
      const err = new Error('Geolocation is not supported by this browser');
      handleError(err);
      return;
    }

    if (watchIdRef.current) {
      stopWatching();
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );

    setIsWatching(true);
  };

  const stopWatching = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return {
    location,
    error,
    isWatching,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isSupported: !!navigator.geolocation,
  };
};