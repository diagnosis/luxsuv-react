import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXTwitter, faInstagram, faTiktok} from '@fortawesome/free-brands-svg-icons';
import {ChevronUp, Menu} from 'lucide-react'

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-dark to-gray-dark fixed w-full z-20 top-0 start-0 border-b border-yellow">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4 max-w-screen-xl">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-light md:text-2xl">
                        LUX SUV
                    </span>
                </Link>

                {/* Buttons and Mobile Toggle */}
                <div className="flex space-x-3 md:order-2">
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
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-light rounded-lg hover:bg-gray-dark focus:outline-none focus:ring-2 focus:ring-yellow md:hidden"
                        aria-controls="navbar-sticky"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <span className="sr-only">Toggle navigation menu</span>
                        {isMobileMenuOpen ? (
                            <ChevronUp 
                                className="text-light w-8 h-8" 
                                strokeWidth={2.5}
                            />
                        ) : (
                            <Menu 
                                className="text-light w-8 h-8" 
                                strokeWidth={2.5}
                            />
                        )}
                    </button>
                </div>

                {/* Top Menu (Mobile) and Desktop Navigation */}
                <div
                    className={`fixed top-0 left-0 w-full bg-gradient-to-r from-dark to-gray-dark z-30 transform transition-all duration-400 ease-in-out ${
                        isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    } md:static md:w-auto md:order-1 md:flex md:transform-none md:transition-none md:bg-transparent md:h-auto md:overflow-visible md:opacity-100`}
                    id="navbar-sticky"
                >
                    <div className="flex flex-col p-6 md:p-0 md:flex-row md:space-x-8 md:mt-0">
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center mb-8 md:hidden">
                            <span className="text-2xl font-bold text-yellow">LUX SUV</span>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2"
                                aria-label="Close menu"
                            >
                                <ChevronUp className="text-light w-8 h-8" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="mb-8 md:mb-0">
                            <h3 className="text-xl font-semibold text-yellow mb-4 md:hidden">Navigation</h3>
                            <ul className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                                <li>
                                    <Link
                                        to="/"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services"
                                        className="block py-2 px-3 text-light hover:text-yellow rounded-sm md:text-yellow md:hover:text-light md:p-0 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Services
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social Links */}
                        <div className="mt-auto md:hidden">
                            <div className="flex space-x-4 mb-6">
                                <a
                                    href="https://x.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on X"
                                >
                                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    className="text-light hover:text-yellow transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Follow us on TikTok"
                                >
                                    <FontAwesomeIcon icon={faTiktok} size="lg" />
                                </a>
                            </div>

                            {/* Copyright Section */}
                            <div className="text-sm text-light/80 flex flex-col items-center space-y-2">
                                <span>© {new Date().getFullYear()} LUX SUV. All rights reserved.</span>
                                <div className="flex space-x-2">
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

                {/* Overlay for Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-400"
                        onClick={closeMobileMenu}
                        aria-hidden="true"
                    ></div>
                )}
            </div>
        </nav>
    );
};

export default Header;