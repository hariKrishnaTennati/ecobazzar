import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedPageProps {
    children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Staggered entry for children
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );

        // Find all sections/cards to stagger
        const staggerItems = containerRef.current.querySelectorAll('.animate-stagger');
        if (staggerItems.length > 0) {
            tl.from(staggerItems, {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'back.out(1.7)',
            }, '-=0.4');
        }
    }, []);

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
};

export default AnimatedPage;
