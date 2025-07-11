import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXTwitter, faInstagram, faTiktok} from '@fortawesome/free-brands-svg-icons';
import {ChevronUp, Menu, LogIn} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-dark to-gray-dark w-full h-full flex items-center border-b border-yellow relative">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4 max-w-screen-xl w-full">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-light md:text-2xl">
                        LUX SUV
                    </span>
                </Link>

                {/* Buttons and Mobile Toggle */}
                <div className="flex space-x-3 md:order-2 relative z-50">
                    {/* Authentication Buttons */}
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/signin"
                                className="hidden md:flex items-center space-x-2 text-light hover:text-yellow transition-colors px-3 py-2 rounded-lg"
                                onClick={closeMobileMenu}
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </Link>
                        </>
                    ) : (
                        <UserMenu />
                    )}

                    <Link
                        to="/book"
                        className="text-dark bg-yellow hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow/50 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors"
                        aria-label="Book a ride now"
                        onClick={closeMobileMenu}
                    >
                        Book Now
                    </Link>
                    <button
                        onClick={toggleMobileMenu}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-light rounded-lg border border-yellow hover:bg-gray-dark focus:outline-none focus:ring-2 focus:ring-yellow md:hidden"
                        aria-controls="navbar-sticky"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <span className="sr-only">Toggle navigation menu</span>
                        {isMobileMenuOpen ? (
                            <ChevronUp className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`absolute top-full left-0 w-full bg-gradient-to-r from-dark to-gray-dark transform transition-all duration-500 ease-in-out z-40 ${
                        isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
                    } md:static md:w-auto md:order-1 md:flex md:transform-none md:transition-none md:bg-transparent md:opacity-100 md:visible md:translate-y-0`}
                    id="navbar-sticky"
                    style={{ maxHeight: isMobileMenuOpen ? '80vh' : '0' }}
                >
                    <div className="max-h-full overflow-y-auto p-6 md:p-0 md:flex md:space-x-8 md:overflow-visible">

                        {/* Navigation Links */}
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-xl font-semibold text-yellow mb-4 text-center md:hidden">Navigation</h3>
                            <ul className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                                <li>
                                    <Link
                                        to="/"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors text-center"
                                        onClick={closeMobileMenu}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors text-center"
                                        onClick={closeMobileMenu}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors text-center"
                                        onClick={closeMobileMenu}
                                    >
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/manage-bookings"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors text-center"
                                        onClick={closeMobileMenu}
                                    >
                                        Manage Bookings
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Mobile Authentication */}
                        {!isAuthenticated && (
                            <div className="mb-6 md:hidden">
                                <h3 className="text-xl font-semibold text-yellow mb-4 text-center">Account</h3>
                                <div className="flex flex-col space-y-3">
                                    <Link to="/signin" onClick={closeMobileMenu} className="bg-yellow hover:bg-yellow/90 text-dark font-semibold py-2 px-4 rounded-lg transition-colors text-center">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" onClick={closeMobileMenu} className="bg-gray-700 hover:bg-gray-600 text-light font-semibold py-2 px-4 rounded-lg transition-colors text-center">
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="mb-6 md:hidden">
                            <h3 className="text-xl font-semibold text-yellow mb-4 text-center">Follow Us</h3>
                            <div className="flex justify-center space-x-6">
                                <a
                                    href="https://x.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on X"
                                >
                                    <FontAwesomeIcon icon={faXTwitter} size="2x" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on TikTok"
                                >
                                    <FontAwesomeIcon icon={faTiktok} size="2x" />
                                </a>
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <div className="text-center md:hidden">
                            <div className="text-sm text-light/80">
                                <p className="mb-2">© {new Date().getFullYear()} LUX SUV. All rights reserved.</p>
                                <div className="flex justify-center space-x-2">
                                    <Link to="/privacy" className="hover:text-yellow transition-colors" onClick={closeMobileMenu}>
                                        Privacy Policy
                                    </Link>
                                    <span>|</span>
                                    <Link to="/terms" className="hover:text-yellow transition-colors" onClick={closeMobileMenu}>
                                        Terms of Service
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default Header;