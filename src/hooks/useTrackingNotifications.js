import { useState, useCallback } from 'react';

export const useTrackingNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Predefined notification types for tracking events
  const showDriverAssigned = useCallback((driverName) => {
    return addNotification({
      type: 'success',
      title: 'Driver Assigned',
      message: `${driverName} has been assigned to your ride`,
      duration: 6000,
    });
  }, [addNotification]);

  const showRideStarted = useCallback(() => {
    return addNotification({
      type: 'status',
      title: 'Ride Started',
      message: 'Your driver has started the trip. Live tracking is now active.',
      duration: 6000,
    });
  }, [addNotification]);

  const showLocationUpdate = useCallback((speed) => {
    const speedText = speed && speed > 0 ? ` (${Math.round(speed)} mph)` : '';
    return addNotification({
      type: 'location',
      title: 'Location Updated',
      message: `Driver location updated${speedText}`,
      duration: 3000,
    });
  }, [addNotification]);

  const showRideCompleted = useCallback(() => {
    return addNotification({
      type: 'success',
      title: 'Ride Completed',
      message: 'Your ride has been completed. Thank you for using LUX SUV!',
      duration: 8000,
    });
  }, [addNotification]);

  const showDriverArrived = useCallback(() => {
    return addNotification({
      type: 'success',
      title: 'Driver Arrived',
      message: 'Your driver has arrived at the pickup location',
      duration: 6000,
    });
  }, [addNotification]);

  const showConnectionLost = useCallback(() => {
    return addNotification({
      type: 'warning',
      title: 'Connection Lost',
      message: 'Lost connection to live tracking. Trying to reconnect...',
      autoClose: false,
    });
  }, [addNotification]);

  const showConnectionRestored = useCallback(() => {
    return addNotification({
      type: 'success',
      title: 'Connection Restored',
      message: 'Live tracking connection restored',
      duration: 4000,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    // Predefined helpers
    showDriverAssigned,
    showRideStarted,
    showLocationUpdate,
    showRideCompleted,
    showDriverArrived,
    showConnectionLost,
    showConnectionRestored,
  };
};