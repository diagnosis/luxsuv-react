import { AlertCircle, RefreshCw, ArrowLeft, Phone, Mail } from 'lucide-react';

const BookingError = ({ error, onRetry, onNewBooking }) => {
  const getErrorType = (errorMessage) => {
    if (errorMessage?.toLowerCase().includes('network') || errorMessage?.toLowerCase().includes('fetch')) {
      return 'network';
    }
    if (errorMessage?.toLowerCase().includes('validation') || errorMessage?.toLowerCase().includes('required')) {
      return 'validation';
    }
    if (errorMessage?.toLowerCase().includes('server') || errorMessage?.toLowerCase().includes('500')) {
      return 'server';
    }
    return 'general';
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Connection Problem';
      case 'validation':
        return 'Booking Information Issue';
      case 'server':
        return 'Server Error';
      default:
        return 'Booking Failed';
    }
  };

  const getErrorDescription = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'We couldn\'t connect to our servers. Please check your internet connection and try again.';
      case 'validation':
        return 'There was an issue with the information provided. Please review your booking details and try again.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again in a few moments.';
      default:
        return 'Something went wrong while processing your booking. Please try again or contact our support team.';
    }
  };

  const errorType = getErrorType(error);

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Error Icon and Header */}
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AlertCircle className="w-20 h-20 text-red-400" />
            <div className="absolute inset-0 bg-red-400/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-light mb-4 md:text-4xl">
          {getErrorTitle(errorType)}
        </h1>
        <p className="text-xl text-light/80 mb-6">
          {getErrorDescription(errorType)}
        </p>
      </div>

      {/* Error Details Card */}
      <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Error Details
        </h3>
        <div className="bg-red-900/30 rounded-lg p-4">
          <p className="text-red-200 font-mono text-sm break-words">
            {error || 'An unexpected error occurred'}
          </p>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left border border-gray-600">
        <h3 className="text-lg font-semibold text-yellow mb-4">Troubleshooting Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-light/90">
              Ensure all required fields are filled out correctly
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-light/90">
              Check that your booking date is at least 1 hour in the future
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-light/90">
              Verify your internet connection and try again
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-light/90">
              If the problem persists, contact our support team
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
        <button
          onClick={onNewBooking}
          className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </button>
      </div>

      {/* Contact Support */}
      <div className="bg-yellow/10 rounded-lg p-6 border border-yellow/30">
        <h3 className="text-lg font-semibold text-yellow mb-4">Need Help?</h3>
        <p className="text-light/80 mb-4">
          Our support team is here to help you complete your booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:support@luxsuv.com"
            className="inline-flex items-center justify-center bg-yellow hover:bg-yellow/90 text-dark font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Support
          </a>
          <a 
            href="tel:+1234567890"
            className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingError;