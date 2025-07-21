import { useState, useEffect } from 'react';
import { X, MapPin, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const TrackingNotification = ({ 
  isVisible, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  autoClose = true, 
  duration = 5000 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'location':
        return MapPin;
      case 'status':
        return Activity;
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'location':
        return 'bg-blue-600/90 border-blue-500 text-blue-100';
      case 'status':
        return 'bg-yellow-600/90 border-yellow-500 text-yellow-100';
      case 'success':
        return 'bg-green-600/90 border-green-500 text-green-100';
      case 'warning':
        return 'bg-orange-600/90 border-orange-500 text-orange-100';
      default:
        return 'bg-gray-600/90 border-gray-500 text-gray-100';
    }
  };

  if (!show) return null;

  const Icon = getIcon();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${getColors()} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-medium mb-1 truncate">{title}</h4>
            )}
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingNotification;