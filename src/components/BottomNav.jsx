import { Link } from '@tanstack/react-router';
import { Home, Info, CalendarCheck, Car } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="w-full bg-gradient-to-r from-dark to-gray-dark border-t border-yellow/30 md:hidden h-full flex items-center">
            <div className="flex justify-around items-center w-full px-4">
                <Link
                    to="/"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link
                    to="/services"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Car className="w-5 h-5" />
                    <span className="text-xs mt-1">Services</span>
                </Link>
                <Link
                    to="/about"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Info className="w-5 h-5" />
                    <span className="text-xs mt-1">About</span>
                </Link>
                <Link
                    to="/book"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <CalendarCheck className="w-5 h-5" />
                    <span className="text-xs mt-1">Book Now</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;