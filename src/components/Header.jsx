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
                <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr] items-center gap-4">
                    <Link to="/" className="text-chartreuse text-2xl font-bold">LuxSuv</Link>
                    
                    <button className="md:hidden justify-self-end text-white text-2xl" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <ul className={`col-span-3 md:col-span-1 md:justify-self-end ${isMenuOpen ? 'grid gap-4' : 'hidden'} md:grid md:grid-flow-col md:gap-8`}>
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