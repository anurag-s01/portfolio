"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './ScrollIndicator.module.scss';

export function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkScrollability = () => {
            // Check if page is actually scrollable (content is taller than viewport + some tolerance)
            const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 50;
            
            if (!isScrollable) {
                setIsVisible(false);
                return;
            }

            // Hide the indicator if the user scrolls down
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        // Initial check
        checkScrollability();
        
        // React/Next.js might take a few ms to finish rendering dynamic content or images
        const timeoutId = setTimeout(checkScrollability, 500);

        window.addEventListener('scroll', checkScrollability, { passive: true });
        window.addEventListener('resize', checkScrollability, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
            clearTimeout(timeoutId);
        };
    }, [pathname]);

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}>
            <div className={styles.mouse}>
                <div className={styles.wheel}></div>
            </div>
            <span className={styles.text}>Scroll</span>
        </div>
    );
}
