import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useBookRide } from '../hooks/useBooking';

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
});

function RouteComponent() {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const bookRideMutation = useBookRide();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData(e.target);
      const bookingData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        rideType: 'hourly', // Default ride type
        pickupLocation: formData.get('pickupLocation'),
        dropoffLocation: formData.get('dropoffLocation'),
        date: formData.get('date'),
        time: formData.get('time'),
        passengers: parseInt(formData.get('passengers')),
        luggage: parseInt(formData.get('luggage')) || 0,
        notes: formData.get('notes') || '',
      };

      // Basic validation
      if (bookingData.passengers < 1 || bookingData.passengers > 8) {
        throw new Error('Number of passengers must be between 1 and 8.');
      }

      const result = await bookRideMutation.mutateAsync(bookingData);
      setSuccessMessage(`Booking successful! Your booking ID is: ${result.id}`);
      
      // Reset form
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <h1 className="text-2xl font-bold mb-4 md:text-4xl md:mb-6">
            Book Your Luxury SUV
          </h1>
          
          {/* Success Message */}
          {successMessage && (
              <div className="mb-3 p-3 bg-green-600/20 text-green-400 rounded-lg text-sm md:text-base md:mb-4 md:p-4">
                {successMessage}
              </div>
          )}
          
          {/* Error Message */}
          {error && (
              <div className="mb-3 p-3 bg-red-600/20 text-red-400 rounded-lg text-sm md:text-base md:mb-4 md:p-4">
                {error}
              </div>
          )}
          
          <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
          >
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
                  Email Address *
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
                  Phone Number *
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

            {/* Pickup and Drop-off Locations */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label
                    htmlFor="pickupLocation"
                    className="block text-sm font-medium mb-1 md:text-base"
                >
                  Pickup Location *
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
                  Drop-off Location *
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
                  Date *
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors text-sm md:text-base md:px-4"
                    min="2025-05-31"
                    required
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
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              <button
                  type="submit"
                  className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-2 rounded-lg transition-colors text-sm md:px-10 md:py-4 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={bookRideMutation.isPending}
              >
                {bookRideMutation.isPending ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}