import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const bookingData = {
        pickupLocation: formData.get('pickupLocation'),
        dropoffLocation: formData.get('dropoffLocation'),
        date: formData.get('date'),
        time: formData.get('time'),
        passengers: parseInt(formData.get('passengers')),
        vehicleType: formData.get('vehicleType'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
      };

      // Basic validation
      if (bookingData.passengers < 1 || bookingData.passengers > 8) {
        throw new Error('Number of passengers must be between 1 and 8.');
      }

      console.log('Booking Data:', bookingData);
      // Future: Submit to backend API
      // Simulate API call delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
            Book Your Luxury SUV
          </h1>
          {error && (
              <div className="mb-3 p-3 bg-red-600/20 text-red-400 rounded-lg text-sm md:text-base md:mb-4 md:p-4">
                {error}
              </div>
          )}
          <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
          >
            {/* Pickup and Drop-off Locations */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label
                    htmlFor="pickupLocation"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Pickup Location
                </label>
                <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    placeholder="Enter pickup location"
                    required
                />
              </div>
              <div>
                <label
                    htmlFor="dropoffLocation"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Drop-off Location
                </label>
                <input
                    type="text"
                    id="dropoffLocation"
                    name="dropoffLocation"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    placeholder="Enter drop-off location"
                    required
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
                  Date
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    min="2025-05-31" // Today's date (May 31, 2025)
                    required
                />
              </div>
              <div>
                <label
                    htmlFor="time"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Time
                </label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    required
                />
              </div>
            </div>

            {/* Passengers and Vehicle Type */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label
                    htmlFor="passengers"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Number of Passengers
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
                />
              </div>
              <div>
                <label
                    htmlFor="vehicleType"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Vehicle Type
                </label>
                <select
                    id="vehicleType"
                    name="vehicleType"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    required
                >
                  <option value="luxury-suv">Luxury SUV</option>
                  <option value="executive-sedan">Executive Sedan</option>
                  <option value="premium-van">Premium Van</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 md:space-y-4">
              <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    placeholder="Enter your full name"
                    required
                />
              </div>
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    placeholder="Enter your email"
                    required
                />
              </div>
              <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    placeholder="Enter your phone number"
                    required
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
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}