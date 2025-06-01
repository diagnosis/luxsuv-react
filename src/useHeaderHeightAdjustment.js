import { useState, useEffect } from 'react';

export const useHeaderHeightAdjustment = () => {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            const header = document.querySelector('nav');
            if (header) {
                setHeaderHeight(header.offsetHeight || 0);
            }
        };

        updateHeight(); // Initial calculation
        window.addEventListener('resize', updateHeight);
        window.addEventListener('load', updateHeight); // Ensure calculation on load
        return () => {
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('load', updateHeight);
        };
    }, []);

    return headerHeight;
};