import { Link } from '@tanstack/react-router';

const Hero = () => {
    return (
        <div
            className="relative w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
                backgroundImage: 'url("../public/images/hero.jpg")',
                minHeight: '100%',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-dark/60"></div>

            {/* Content */}
            <div className="relative w-full max-w-screen-xl mx-auto px-4 py-6 md:py-8 h-full flex items-center">
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-light mb-3 md:text-6xl md:mb-4">
                        Luxury SUV Transportation
                    </h1>
                    <p className="text-base text-light/90 mb-4 md:text-2xl md:mb-8">
                        Experience premium comfort and style with our executive SUV service.
                        Perfect for business travel, special occasions, or luxury airport transfers.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Link
                            to="/book"
                            className="inline-block bg-yellow hover:bg-yellow/90 text-dark font-semibold px-5 py-2 rounded-lg text-center transition-colors text-sm md:px-8 md:py-4 md:text-base"
                        >
                            Book Now
                        </Link>
                        <Link
                            to="/services"
                            className="inline-block bg-light/10 hover:bg-light/20 text-light font-semibold px-5 py-2 rounded-lg text-center transition-colors text-sm md:px-8 md:py-4 md:text-base"
                        >
                            Our Services
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;