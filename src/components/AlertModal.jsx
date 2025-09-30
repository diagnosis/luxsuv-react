import { useEffect } from 'react';
import { X, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Circle as XCircle, Info } from 'lucide-react';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  details = null,
  confirmText = 'OK',
  showCancel = false,
  cancelText = 'Cancel',
  onConfirm = null,
  onCancel = null
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-400',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-400/30',
          icon: CheckCircle
        };
      case 'warning':
        return {
          iconColor: 'text-orange-400',
          bgColor: 'bg-orange-900/20',
          borderColor: 'border-orange-400/30',
          icon: AlertTriangle
        };
      case 'error':
        return {
          iconColor: 'text-red-400',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-400/30',
          icon: XCircle
        };
      default:
        return {
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-400/30',
          icon: Info
        };
    }
  };

  const styles = getModalStyles();
  const IconComponent = styles.icon;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-600 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
            <h2 className="text-xl font-semibold text-light">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-light transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className={`rounded-lg p-4 mb-4 border ${styles.bgColor} ${styles.borderColor}`}>
            <p className="text-light leading-relaxed">{message}</p>
          </div>

          {/* Details Section */}
          {details && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Details:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                {Array.isArray(details) ? details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                )) : (
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{details}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {showCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-medium rounded-lg transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                type === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : type === 'error'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : type === 'warning'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-yellow hover:bg-yellow/90 text-dark'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;