import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const shimmerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = '/logo.jpg';
        img.onload = () => setImagesLoaded(true);
        img.onerror = () => setImagesLoaded(true); // proceed even on error
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;
        if (!containerRef.current || !logoRef.current || !titleRef.current || !subtitleRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                // Fade out entire splash
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.1,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onComplete,
                });
            },
        });

        // Set initial states
        gsap.set(logoRef.current, { opacity: 0, scale: 0.3, rotation: -180 });
        gsap.set(titleRef.current, { opacity: 0, y: 40, clipPath: 'inset(0 100% 0 0)' });
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
        if (shimmerRef.current) gsap.set(shimmerRef.current, { opacity: 0 });

        // Create floating particles
        if (particlesRef.current) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'splash-particle';
                const size = Math.random() * 8 + 3;
                particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#86efac' : '#4ade80'};
          opacity: 0;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
                particlesRef.current.appendChild(particle);
            }
        }

        // 1. Logo entrance — spin in + scale up with elastic bounce
        tl.to(logoRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
        });

        // 2. Logo pulse glow
        tl.to(logoRef.current, {
            filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.3))',
            duration: 0.5,
            ease: 'power2.out',
        }, '-=0.3');

        // 3. Shimmer sweep across logo
        if (shimmerRef.current) {
            tl.to(shimmerRef.current, {
                opacity: 1,
                duration: 0.1,
            }, '-=0.2');
            tl.fromTo(shimmerRef.current,
                { x: '-100%' },
                { x: '200%', duration: 0.8, ease: 'power2.inOut' },
                '-=0.2'
            );
            tl.to(shimmerRef.current, { opacity: 0, duration: 0.1 });
        }

        // 4. Title reveal with clip path
        tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            ease: 'power3.out',
        }, '-=0.4');

        // 5. Subtitle fade in
        tl.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
        }, '-=0.3');

        // 6. Floating particles animation
        if (particlesRef.current) {
            const particles = particlesRef.current.querySelectorAll('.splash-particle');
            tl.to(particles, {
                opacity: (i) => 0.3 + Math.random() * 0.5,
                y: () => -50 - Math.random() * 100,
                x: () => (Math.random() - 0.5) * 80,
                duration: 1.5,
                stagger: 0.05,
                ease: 'power1.out',
            }, '-=1');
        }

        // 7. Hold for a beat
        tl.to({}, { duration: 0.5 });

        return () => {
            tl.kill();
        };
    }, [imagesLoaded, onComplete]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at center, #0a1f0d 0%, #050d07 50%, #020504 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Ambient background glow */}
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Floating particles container */}
            <div
                ref={particlesRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                }}
            />

            {/* Logo container with shimmer */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <img
                    ref={logoRef}
                    src="/logo.jpg"
                    alt="EcoBazaarX Logo"
                    style={{
                        width: '180px',
                        height: '180px',
                        objectFit: 'contain',
                        borderRadius: '50%',
                        border: '3px solid rgba(34, 197, 94, 0.3)',
                    }}
                />
                {/* Shimmer overlay */}
                <div
                    ref={shimmerRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Title */}
            <h1
                ref={titleRef}
                style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #4ade80, #22c55e, #16a34a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                }}
            >
                EcoBazaarX
            </h1>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                style={{
                    fontSize: '1rem',
                    color: 'rgba(134, 239, 172, 0.7)',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                }}
            >
                Eco-Friendly Shopping
            </p>
        </div>
    );
};

export default SplashScreen;
