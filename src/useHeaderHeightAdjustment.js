import {useEffect, useState} from "react";

export const useHeaderHeightAdjustment = () =>{

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

    return headerHeight

}