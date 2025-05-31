const Header = () => {
    return (
        <nav className="bg-gradient-to-r from-yellow-500 to-black fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            LUX SUV
          </span>
                </a>
                <div className="flex md:order-2 space-x-3">
                    <button
                        type="button"
                        className="text-black bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
                    >
                        Get started
                    </button>
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
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
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-transparent md:space-x-8 md:flex-row md:mt-0 md:border-0">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white bg-yellow-500 rounded-sm md:bg-transparent md:text-yellow-300 md:hover:text-white md:p-0"
                                aria-current="page"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0"
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