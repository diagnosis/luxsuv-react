import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 w-full bg-custom-black z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-chartreuse text-2xl font-bold">LuxSuv</Link>
                    
                    <button className="md:hidden text-white text-2xl" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <ul className={`md:flex md:space-x-8 ${isMenuOpen ? 'absolute left-0 right-0 top-full bg-custom-black p-4 space-y-4 md:space-y-0' : 'hidden md:static'}`}>
                        <li><Link to="/book" className="text-white hover:text-chartreuse transition-colors">Book a Ride</Link></li>
                        <li><Link to="/services" className="text-white hover:text-chartreuse transition-colors">Our Services</Link></li>
                        <li><Link to="/fleet" className="text-white hover:text-chartreuse transition-colors">Our Fleet</Link></li>
                        <li><Link to="/contact" className="text-white hover:text-chartreuse transition-colors">Contact</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;