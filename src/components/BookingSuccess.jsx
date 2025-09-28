import { CircleCheck as CheckCircle, Calendar, MapPin, Users, Clock, Car, ArrowRight, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const BookingSuccess = ({ bookingResult, onNewBooking }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  // Get booking data from the result or use stored form data
  const bookingData = bookingResult?.booking || bookingResult || {};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      case 'completed':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon and Header */}
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-400" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-light mb-4 md:text-4xl">
          Booking Submitted!
        </h1>
        <p className="text-xl text-light/80 mb-2">
          Your luxury SUV booking has been received and payment method validated
        </p>
        <p className="text-yellow font-semibold text-lg">
          Booking ID: #{bookingResult?.id || 'Pending'}
        </p>
      </div>

      {/* Status Notice */}
      <div className="bg-green-900/20 rounded-lg p-4 mb-6 border border-green-400/30">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-semibold">Payment Method Validated</span>
        </div>
        <p className="text-light/80 text-sm mb-2">
          Your payment method has been successfully validated and secured.
        </p>
        <div className="flex items-center justify-center space-x-2">
          {bookingData.status && (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingData.status)}`}>
              {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1)}
            </span>
          )}
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-blue-400 bg-blue-400/20">
            Payment: Validated
          </span>
        </div>
      </div>

      {/* Payment Notice */}
      <div className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-400/30">
        <p className="text-light/80 text-sm">
          Your booking is confirmed and payment method is secured. You will only be charged after your ride is completed.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left border border-yellow/30">
        <h3 className="text-xl font-semibold text-yellow mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Booking Details
        </h3>
        
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-light font-medium">
                {bookingData.your_name || bookingData.name || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-light font-medium">
                {bookingData.email || 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <p className="text-light font-medium">
              {bookingData.phone_number || bookingData.phone || 'Not specified'}
            </p>
          </div>

          {/* Date and Time */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-yellow flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Scheduled Date & Time</p>
              <p className="text-light font-medium">
                {bookingData.scheduled_at 
                  ? new Date(bookingData.scheduled_at).toLocaleString()
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Pickup Location</p>
                <p className="text-light">{bookingData.pickup || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Drop-off Location</p>
                <p className="text-light">{bookingData.dropoff || 'Not specified'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-yellow/10 rounded-lg p-6 mb-8 border border-yellow/30">
        <h3 className="text-lg font-semibold text-yellow mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-light/90">
              Your payment method has been validated and secured for post-ride payment.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-light/90">
              Check your email for a 6-digit access code and magic link to manage your booking.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-light/90">
              Our team will review and confirm your reservation within 24 hours.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow text-dark rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-light/90">
              Payment will be automatically processed after your ride is completed.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/manage-bookings"
          className="inline-flex items-center justify-center bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Access My Booking
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
        <button
          onClick={onNewBooking}
          className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Book Another Ride
        </button>
      </div>

      {/* Contact Information */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <p className="text-light/60 text-sm mb-2">
          Need to make changes or have questions?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <a 
            href="mailto:support@luxsuv.com" 
            className="text-yellow hover:text-yellow/80 transition-colors"
          >
            support@luxsuv.com
          </a>
          <a 
            href="tel:+1234567890" 
            className="text-yellow hover:text-yellow/80 transition-colors"
          >
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;