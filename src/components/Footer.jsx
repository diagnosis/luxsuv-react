const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>LuxSuv</h3>
                    <p>Luxury transportation for discerning clients.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>Book a Ride</li>
                        <li>Our Services</li>
                        <li>Our Fleet</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@luxsuv.com</p>
                    <p>Phone: (555) 123-4567</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 LuxSuv. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;