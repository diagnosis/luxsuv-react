import { Link } from '@tanstack/react-router';
import { Home, Info, Phone, Car } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-dark to-gray-dark border-t border-yellow/30 md:hidden">
            <div className="flex justify-around items-center h-16">
                <Link
                    to="/"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Home className="w-6 h-6" />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link
                    to="/services"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Car className="w-6 h-6" />
                    <span className="text-xs mt-1">Services</span>
                </Link>
                <Link
                    to="/about"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Info className="w-6 h-6" />
                    <span className="text-xs mt-1">About</span>
                </Link>
                <Link
                    to="/contact"
                    className="flex flex-col items-center text-light hover:text-yellow transition-colors"
                >
                    <Phone className="w-6 h-6" />
                    <span className="text-xs mt-1">Contact</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;