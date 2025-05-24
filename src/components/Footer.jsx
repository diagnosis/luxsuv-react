const Footer = () => {
    return (
        <footer className="bg-custom-black text-white pt-12 pb-4">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-chartreuse text-xl font-bold mb-4">LuxSuv</h3>
                        <p className="text-gray-300">Luxury transportation for discerning clients.</p>
                    </div>
                    <div>
                        <h3 className="text-chartreuse text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-chartreuse cursor-pointer transition-colors">Book a Ride</li>
                            <li className="hover:text-chartreuse cursor-pointer transition-colors">Our Services</li>
                            <li className="hover:text-chartreuse cursor-pointer transition-colors">Our Fleet</li>
                            <li className="hover:text-chartreuse cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-chartreuse text-xl font-bold mb-4">Contact Us</h3>
                        <p className="text-gray-300">Email: info@luxsuv.com</p>
                        <p className="text-gray-300">Phone: (555) 123-4567</p>
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-blue-iris text-center">
                    <p className="text-gray-300">&copy; 2024 LuxSuv. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;