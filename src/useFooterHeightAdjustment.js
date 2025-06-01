import { useState, useEffect } from 'react';

export const useFooterHeightAdjustment = () => {
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            const footer = document.querySelector('footer');
            const bottomNav = document.querySelector('nav[aria-label="bottom navigation"]'); // Adjust selector if needed
            const footerH = footer ? footer.offsetHeight : 0;
            const bottomNavH = bottomNav ? bottomNav.offsetHeight : 0;
            setFooterHeight(footerH + bottomNavH);
        };

        updateHeight(); // Initial calculation
        window.addEventListener('resize', updateHeight);
        window.addEventListener('load', updateHeight); // Ensure calculation on load
        return () => {
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('load', updateHeight);
        };
    }, []);

    return footerHeight;
};