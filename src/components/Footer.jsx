import { Link } from '@tanstack/react-router';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-dark to-gray-dark text-light w-full">
            <div className="max-w-screen-xl mx-auto p-8 md:p-12">
                {/* Top Section: Branding and Main Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Branding Column */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-yellow">LUX SUV</h2>
                        <p className="text-sm text-light/80">
                            Premium SUV transportation for business, leisure, and special occasions.
                        </p>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 text-yellow">Our Services</h3>
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
                    </div>

                    {/* About Column */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 text-yellow">About Us</h3>
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
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 text-yellow">Contact</h3>
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
                    </div>
                </div>

                {/* Bottom Section: Social Media and Legal */}
                <div className="mt-12 pt-8 border-t border-yellow/30 flex flex-col md:flex-row justify-between items-center">
                    {/* Social Media Links */}
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <a href="https://twitter.com" className="text-light hover:text-yellow transition-colors">
                            Twitter
                        </a>
                        <a href="https://instagram.com" className="text-light hover:text-yellow transition-colors">
                            Instagram
                        </a>
                        <a href="https://linkedin.com" className="text-light hover:text-yellow transition-colors">
                            LinkedIn
                        </a>
                    </div>

                    {/* Legal and Copyright */}
                    <div className="text-sm text-light/80">
                        <span>&copy; {new Date().getFullYear()} LUX SUV. All rights reserved.</span>
                        <span className="mx-2">|</span>
                        <Link to="/privacy" className="hover:text-yellow transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="mx-2">|</span>
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