import { Link } from '@tanstack/react-router';

const Hero = () => {
    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
            style={{
                backgroundImage: 'url("https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg")'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-dark/60"></div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-12 md:py-24">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-light mb-4">
                        Luxury SUV Transportation
                    </h1>
                    <p className="text-xl md:text-2xl text-light/90 mb-8">
                        Experience premium comfort and style with our executive SUV service.
                        Perfect for business travel, special occasions, or luxury airport transfers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/book"
                            className="inline-block bg-yellow hover:bg-yellow/90 text-dark font-semibold px-8 py-4 rounded-lg text-center transition-colors"
                        >
                            Book Now
                        </Link>
                        <Link
                            to="/services"
                            className="inline-block bg-light/10 hover:bg-light/20 text-light font-semibold px-8 py-4 rounded-lg text-center transition-colors"
                        >
                            Our Services
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};