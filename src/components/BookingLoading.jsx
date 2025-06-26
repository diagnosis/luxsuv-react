import { Loader2, Car } from 'lucide-react';

const BookingLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <div className="relative">
          {/* Animated car icon */}
          <div className="mb-6">
            <Car className="w-16 h-16 text-yellow mx-auto animate-bounce" />
          </div>
          
          {/* Spinning loader */}
          <div className="flex justify-center mb-6">
            <Loader2 className="w-12 h-12 text-yellow animate-spin" />
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-light mb-4 md:text-3xl">
          Processing Your Booking
        </h2>
        <p className="text-light/80 text-lg mb-6">
          Please wait while we confirm your luxury SUV reservation...
        </p>
        
        {/* Progress indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-light/60">
            <div className="w-2 h-2 bg-yellow rounded-full animate-pulse"></div>
            <span>Validating booking details</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-light/60">
            <div className="w-2 h-2 bg-yellow rounded-full animate-pulse delay-300"></div>
            <span>Checking vehicle availability</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-light/60">
            <div className="w-2 h-2 bg-yellow rounded-full animate-pulse delay-500"></div>
            <span>Confirming your reservation</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-yellow/5 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default BookingLoading;