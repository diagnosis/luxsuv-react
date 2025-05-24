import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <nav className="nav-container">
                <Link to="/" className="logo">LuxSuv</Link>
                
                <button className="hamburger" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <ul className={`nav-items ${isMenuOpen ? 'show' : ''}`}>
                    <li><Link to="/book">Book a Ride</Link></li>
                    <li><Link to="/services">Our Services</Link></li>
                    <li><Link to="/fleet">Our Fleet</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;