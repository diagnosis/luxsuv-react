import { useEffect, useState } from 'react';

const Hero = () => {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.querySelector('nav');
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
        // Update height on window resize
        const handleResize = () => {
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className="w-full min-h-[calc(100vh-80px)] bg-amber-100"
            style={{ marginTop: `${headerHeight}px` }}
        >
            <h1>Hero Section</h1>
        </div>
    );
};

export default Hero;