import { Link } from '@tanstack/react-router';
import { useHeaderHeightAdjustment } from "../useHeaderHeightAdjustment.js";
import { useFooterHeightAdjustment } from "../useFooterHeightAdjustment.js";

const Hero = () => {
    const headerHeight = useHeaderHeightAdjustment();
    const footerHeight = useFooterHeightAdjustment();

    return (
        <div
            className="relative w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
                backgroundImage: 'url("../public/images/hero.jpg")',
                minHeight: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`, // Dynamically set height
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-dark/60"></div>

            {/* Content */}
            <div className="relative w-full max-w-screen-xl mx-auto px-4 py-6 md:py-8">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-light mb-4 md:text-6xl">
                        Luxury SUV Transportation
                    </h1>
                    <p className="text-lg text-light/90 mb-6 md:text-2xl md:mb-8">
                        Experience premium comfort and style with our executive SUV service.
                        Perfect for business travel, special occasions, or luxury airport transfers.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            to="/book"
                            className="inline-block bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-3 rounded-lg text-center transition-colors md:px-8 md:py-4"
                        >
                            Book Now
                        </Link>
                        <Link
                            to="/services"
                            className="inline-block bg-light/10 hover:bg-light/20 text-light font-semibold px-6 py-3 rounded-lg text-center transition-colors md:px-8 md:py-4"
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