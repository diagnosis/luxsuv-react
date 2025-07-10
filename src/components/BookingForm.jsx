import AddressAutocomplete from './AddressAutocomplete';

const BookingForm = ({ 
  onSubmit, 
  initialData = {},
  isGuestMode = false,
  pickupLocation, 
  setPickupLocation, 
  dropoffLocation, 
  setDropoffLocation,
  isSubmitting 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      rideType: formData.get('rideType'),
      date: formData.get('date'),
      time: formData.get('time'),
      passengers: formData.get('passengers'),
      luggage: formData.get('luggage'),
      notes: formData.get('notes'),
    };

    // Merge with any initial data
    const finalData = { ...initialData, ...data };

    onSubmit(finalData);
  };

  return (
    <>
      {isGuestMode && (
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
        Book Your Luxury SUV
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
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
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

        {/* Ride Type */}
        <div>
          <label
            htmlFor="rideType"
            className="block text-sm font-medium mb-1 md:text-base"
          >
            Ride Type *
          </label>
          <select
            id="rideType"
            name="rideType"
            className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
            required
            defaultValue="hourly"
            disabled={isSubmitting}
          >
            <option value="hourly">Hourly Service</option>
            <option value="per_ride">Per Ride</option>
          </select>
          <p className="text-xs text-gray-400 mt-1 md:text-sm">
            Choose "Hourly Service" for extended trips or "Per Ride" for point-to-point transportation
          </p>
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
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Passengers and Luggage */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div>
            <label
              htmlFor="passengers"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Number of Passengers *
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              min="1"
              max="8"
              defaultValue="1"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="luggage"
              className="block text-sm font-medium mb-1 md:text-base"
            >
              Number of Luggage
            </label>
            <input
              type="number"
              id="luggage"
              name="luggage"
              className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
              min="0"
              max="10"
              defaultValue="0"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium mb-1 md:text-base"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4 resize-none"
            placeholder="Any special requests or additional information..."
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-2 rounded-lg transition-colors text-sm md:px-10 md:py-4 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>
    </>
  );
};

export default BookingForm;