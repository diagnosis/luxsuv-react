import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="mb-4">
            <button
                className="text-base font-medium text-yellow w-full text-left flex justify-between items-center md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={`Toggle ${title} section`}
            >
                {title}
                <span className="text-yellow">{isOpen ? '−' : '+'}</span>
            </button>
            <div className={isOpen ? 'block' : 'hidden md:block'}>
                {children}
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-dark to-gray-dark text-light w-full">
            <div className="mx-auto p-6 max-w-screen-xl md:p-12">
                {/* Top Section: Branding and Main Links */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-12">
                    {/* Branding Column (No Accordion) */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-yellow md:text-2xl md:mb-4">LUX SUV</h2>
                        <p className="text-sm text-light/80">
                            Premium SUV transportation for business, leisure, and special occasions.
                        </p>
                    </div>

                    {/* Services Column */}
                    <Accordion title="Our Services">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/services/airport" className="hover:text-yellow transition-colors">
                                    Airport Transfers
                                </Link>
                            </li>
                            <li>
                                <Link to="/services/city" className="hover:text-yellow transition-colors">
                                    City Rides
                                </Link>
                            </li>
                            <li>
                                <Link to="/services/events" className="hover:text-yellow transition-colors">
                                    Event Transportation
                                </Link>
                            </li>
                        </ul>
                    </Accordion>

                    {/* About Column */}
                    <Accordion title="About Us">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-yellow transition-colors">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link to="/team" className="hover:text-yellow transition-colors">
                                    Our Team
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="hover:text-yellow transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </Accordion>

                    {/* Contact Column */}
                    <Accordion title="Contact">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="mailto:support@luxsuv.com" className="hover:text-yellow transition-colors">
                                    support@luxsuv.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+1234567890" className="hover:text-yellow transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-yellow transition-colors">
                                    Contact Form
                                </Link>
                            </li>
                        </ul>
                    </Accordion>
                </div>

                {/* Bottom Section: Social Media and Legal */}
                <div className="mt-8 pt-6 border-t border-yellow/30 flex flex-col items-center md:mt-12 md:pt-8 md:flex-row md:justify-between">
                    {/* Social Media Links */}
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <a
                            href="https://x.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on X"
                        >
                            <FontAwesomeIcon icon={faXTwitter} size="lg" />
                        </a>
                        <a
                            href="https://instagram.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on Instagram"
                        >
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a
                            href="https://tiktok.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on TikTok"
                        >
                            <FontAwesomeIcon icon={faTiktok} size="lg" />
                        </a>
                    </div>

                    {/* Legal and Copyright */}
                    <div className="text-sm text-light/80 flex flex-col items-center md:flex-row">
                        <span>© {new Date().getFullYear()} LUX SUV. All rights reserved.</span>
                        <span className="mx-0 my-2 md:mx-2 md:my-0">|</span>
                        <Link to="/privacy" className="hover:text-yellow transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="mx-0 my-2 md:mx-2 md:my-0">|</span>
                        <Link to="/terms" className="hover:text-yellow transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;