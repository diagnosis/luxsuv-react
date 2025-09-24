import { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import AlertModal from './AlertModal';

const formatDateTimeForAPI = (date, time) => {
  // Convert form date/time to ISO 8601 format for API
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toISOString();
};

const BookingForm = ({ 
  onSubmit, 
  initialData = {},
  isUpdate = false,
  pickupLocation, 
  setPickupLocation, 
  dropoffLocation, 
  setDropoffLocation,
  isSubmitting 
}) => {
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    details: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      luggage_count: parseInt(formData.get('luggage_count')) || 0,
      passenger_count: parseInt(formData.get('passenger_count')) || 1,
      trip_type: formData.get('trip_type') || 'per_ride',
      scheduled_at: formatDateTimeForAPI(formData.get('date'), formData.get('time')),
    };

    // Validate required fields
    if (!data.name?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter your full name to continue with your booking.'
      });
      return;
    }
    
    // Only validate email for new bookings, not updates
    if (!isUpdate && (!data.email?.trim() || !data.email.includes('@'))) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email address to receive booking confirmations and updates.'
      });
      return;
    }
    
    if (!data.phone?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter your phone number so we can contact you about your booking.'
      });
      return;
    }
    
    if (!pickupLocation?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a pickup location for your ride.'
      });
      return;
    }
    
    if (!dropoffLocation?.trim()) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a drop-off location for your ride.'
      });
      return;
    }
    
    if (!data.date) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select a date for your ride.'
      });
      return;
    }
    
    if (!data.time) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select a time for your ride.'
      });
      return;
    }
    
    if (data.passenger_count < 1 || data.passenger_count > 8) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Passenger Count',
        message: 'Passenger count must be between 1 and 8 passengers.',
        details: ['Our luxury SUVs accommodate up to 8 passengers comfortably']
      });
      return;
    }
    
    if (data.luggage_count < 0 || data.luggage_count > 20) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Luggage Count',
        message: 'Luggage count must be between 0 and 20 bags.',
        details: ['Please contact us for special luggage requirements']
      });
      return;
    }

    console.log('📋 Submitting guest booking:', data);
    onSubmit(data);
  };

  return (
    <>
      {!isUpdate && (
        <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow font-semibold">Guest Booking</span>
          </div>
          <p className="text-light/80 text-sm">
            You're booking as a guest. To manage this booking later, you'll need to use the email address you provide below.
          </p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
        {isUpdate ? 'Update Your Booking' : 'Book Your Luxury SUV'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Contact Information */}
        <div className="space-y-3 md:space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData.name || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={initialData.email || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4 disabled:opacity-50"
              placeholder="Enter your email"
              required
              disabled={isUpdate || isSubmitting} // Disable email editing for updates
            />
            {isUpdate && (
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed for security reasons
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={initialData.phone || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your phone number"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <div>
            <label
              htmlFor="passenger_count"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Passengers *
            </label>
            <select
              id="passenger_count"
              name="passenger_count"
              defaultValue={initialData.passenger_count || 1}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            >
              {[1,2,3,4,5,6,7,8].map(count => (
                <option key={count} value={count}>{count} passenger{count > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="luggage_count"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Luggage Count
            </label>
            <select
              id="luggage_count"
              name="luggage_count"
              defaultValue={initialData.luggage_count || 0}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            >
              {Array.from({length: 21}, (_, i) => i).map(count => (
                <option key={count} value={count}>{count} bag{count !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="trip_type"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Trip Type *
            </label>
            <select
              id="trip_type"
              name="trip_type"
              defaultValue={initialData.trip_type || 'per_ride'}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            >
              <option value="per_ride">Per Ride</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>

        {/* Pickup and Drop-off Locations */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div>
            <label
              htmlFor="pickupLocation"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Pickup Location *
            </label>
            <AddressAutocomplete
              id="pickupLocation"
              name="pickupLocation"
              value={pickupLocation}
              onChange={setPickupLocation}
              placeholder="Enter pickup location"
              required
              className="text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="dropoffLocation"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Drop-off Location *
            </label>
            <AddressAutocomplete
              id="dropoffLocation"
              name="dropoffLocation"
              value={dropoffLocation}
              onChange={setDropoffLocation}
              placeholder="Enter drop-off location"
              required
              className="text-sm md:text-base md:px-4"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={initialData.date || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              min="2025-05-31"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              defaultValue={initialData.time || ''}
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-2 rounded-lg transition-colors text-sm md:px-10 md:py-4 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (isUpdate ? 'Updating...' : 'Submitting...') : (isUpdate ? 'Update Booking' : 'Submit Booking')}
          </button>
        </div>
      </form>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        details={alertModal.details}
      />
    </>
  );
};

export default BookingForm;