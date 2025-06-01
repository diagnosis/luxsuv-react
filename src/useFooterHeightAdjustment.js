import { useEffect, useState } from "react";

export const useFooterHeightAdjustment = () => {
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        const footer = document.querySelector('footer');
        const bottomNav = document.querySelector('nav.fixed.bottom-0');
        
        const updateHeight = () => {
            if (footer) {
                const bottomNavHeight = bottomNav ? bottomNav.offsetHeight : 0;
                setFooterHeight(footer.offsetHeight + bottomNavHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return footerHeight;
}