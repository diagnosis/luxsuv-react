import { useState } from 'react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-medium-red to-primary-black fixed w-full z-20 top-0 start-0 border-b border-dark-red">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        LUX SUV
                    </span>
                </a>
                <div className="flex md:order-2 space-x-3">
                    <button
                        type="button"
                        className="text-white bg-bright-red hover:bg-medium-red focus:ring-4 focus:outline-none focus:ring-dark-red font-medium rounded-lg text-sm px-4 py-2 text-center"
                    >
                        Get started
                    </button>
                    <button
                        onClick={toggleMobileMenu}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-dark-red focus:outline-none focus:ring-2 focus:ring-dark-red"
                        aria-controls="navbar-sticky"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    }`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-dark-red rounded-lg bg-gradient-to-r from-medium-red to-primary-black md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white bg-bright-red rounded-sm md:bg-transparent md:text-bright-red md:hover:text-white md:p-0"
                                aria-current="page"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-dark-red md:hover:bg-transparent md:hover:text-bright-red md:p-0"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-dark-red md:hover:bg-transparent md:hover:text-bright-red md:p-0"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-dark-red md:hover:bg-transparent md:hover:text-bright-red md:p-0"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;