import { Link } from '@tanstack/react-router';
import { Home, Info, CalendarCheck, Car } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="w-full bg-gradient-to-r from-dark to-gray-dark border-t border-yellow/30 md:hidden h-12 flex items-center">
            <div className="flex justify-around items-center w-full">
                <Link
                    to="/"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-1"
                >
                    <Home className="w-3 h-3" />
                    <span className="text-[8px] mt-0.5">Home</span>
                </Link>
                <Link
                    to="/services"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-1"
                >
                    <Car className="w-3 h-3" />
                    <span className="text-[8px] mt-0.5">Services</span>
                </Link>
                <Link
                    to="/about"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-1"
                >
                    <Info className="w-3 h-3" />
                    <span className="text-[8px] mt-0.5">About</span>
                </Link>
                <Link
                    to="/book"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors py-1"
                >
                    <CalendarCheck className="w-3 h-3" />
                    <span className="text-[8px] mt-0.5">Book Now</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;