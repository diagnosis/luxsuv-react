import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-dark to-gray-dark text-light w-full h-full hidden md:flex md:items-center">
            <div className="mx-auto p-4 max-w-screen-xl w-full">
                {/* Top Section: Branding and Main Links */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8 mb-4">
                    {/* Branding Column */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-yellow md:text-xl">LUX SUV</h2>
                        <p className="text-xs text-light/80 md:text-sm">
                            Premium SUV transportation for business, leisure, and special occasions.
                        </p>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-sm font-medium text-yellow mb-2 md:text-base">Our Services</h3>
                        <ul className="space-y-1 text-xs md:text-sm">
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
                    </div>

                    {/* About Column */}
                    <div>
                        <h3 className="text-sm font-medium text-yellow mb-2 md:text-base">About Us</h3>
                        <ul className="space-y-1 text-xs md:text-sm">
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
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-sm font-medium text-yellow mb-2 md:text-base">Contact</h3>
                        <ul className="space-y-1 text-xs md:text-sm">
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
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Social Media and Legal */}
                <div className="pt-3 border-t border-yellow/30 flex flex-col items-center md:flex-row md:justify-between">
                    {/* Social Media Links */}
                    <div className="flex space-x-4 mb-2 md:mb-0">
                        <a
                            href="https://x.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on X"
                        >
                            <FontAwesomeIcon icon={faXTwitter} size="sm" />
                        </a>
                        <a
                            href="https://instagram.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on Instagram"
                        >
                            <FontAwesomeIcon icon={faInstagram} size="sm" />
                        </a>
                        <a
                            href="https://tiktok.com"
                            className="text-light hover:text-yellow transition-colors"
                            aria-label="Follow us on TikTok"
                        >
                            <FontAwesomeIcon icon={faTiktok} size="sm" />
                        </a>
                    </div>

                    {/* Legal and Copyright */}
                    <div className="text-xs text-light/80 flex flex-col items-center md:flex-row">
                        <span>© {new Date().getFullYear()} LUX SUV. All rights reserved.</span>
                        <span className="mx-0 my-1 md:mx-2 md:my-0">|</span>
                        <Link to="/privacy" className="hover:text-yellow transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="mx-0 my-1 md:mx-2 md:my-0">|</span>
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