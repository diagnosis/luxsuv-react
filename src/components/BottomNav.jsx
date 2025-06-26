import { Link } from '@tanstack/react-router';
import { Home, Info, CalendarCheck, Car } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="w-full bg-gradient-to-r from-dark to-gray-dark border-t border-yellow/30 md:hidden h-16 flex items-center">
            <div className="flex justify-around items-center w-full">
                <Link
                    to="/"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-2"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link
                    to="/services"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-2"
                >
                    <Car className="w-5 h-5" />
                    <span className="text-xs mt-1">Services</span>
                </Link>
                <Link
                    to="/about"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-2"
                >
                    <Info className="w-5 h-5" />
                    <span className="text-xs mt-1">About</span>
                </Link>
                <Link
                    to="/book"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-2"
                >
                    <CalendarCheck className="w-5 h-5" />
                    <span className="text-xs mt-1">Book Now</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;