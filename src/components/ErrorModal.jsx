import { X, AlertTriangle, AlertCircle, XCircle, Mail } from 'lucide-react';

const ErrorModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'error', // 'error', 'warning', 'info'
  details = null,
  onRetry = null,
  retryButtonText = 'Try Again'
}) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconColor: 'text-orange-400',
          bgColor: 'bg-orange-900/20',
          borderColor: 'border-orange-400/30',
          icon: AlertTriangle
        };
      case 'info':
        return {
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-400/30',
          icon: AlertCircle
        };
      case 'email':
        return {
          iconColor: 'text-yellow-400',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-400/30',
          icon: Mail
        };
      default:
        return {
          iconColor: 'text-red-400',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-400/30',
          icon: XCircle
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

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
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
              <h4 className="text-sm font-medium text-gray-300 mb-2">Possible reasons:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light font-medium rounded-lg transition-colors"
            >
              Close
            </button>
            {onRetry && (
              <button
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="px-4 py-2 bg-yellow hover:bg-yellow/90 text-dark font-medium rounded-lg transition-colors"
              >
                {retryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;