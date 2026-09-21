import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AmbientCanvas = () => {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    if (!orb1 || !orb2) return;

    // Use gsap.quickTo for high-performance 60-120fps mouse tracking
    const xToOrb1 = gsap.quickTo(orb1, 'x', { duration: 0.8, ease: 'power3.out' });
    const yToOrb1 = gsap.quickTo(orb1, 'y', { duration: 0.8, ease: 'power3.out' });

    const xToOrb2 = gsap.quickTo(orb2, 'x', { duration: 1.4, ease: 'power2.out' });
    const yToOrb2 = gsap.quickTo(orb2, 'y', { duration: 1.4, ease: 'power2.out' });

    const handlePointerMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xOffset = clientX - innerWidth / 2;
      const yOffset = clientY - innerHeight / 2;

      xToOrb1(xOffset * 0.35);
      yToOrb1(yOffset * 0.35);

      xToOrb2(-xOffset * 0.25);
      yToOrb2(-yOffset * 0.25);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Editorial paper micro-grain tactile texture */}
      <div className="absolute inset-0 paper-grain opacity-60" />

      {/* Primary Pulse Red Ambient Luminescence Orb */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-primary-container/10 filter blur-[120px] opacity-70 will-change-transform"
      />

      {/* Secondary Cool Slate Architectural Glow Orb */}
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-secondary-container/30 to-surface-container-highest/20 filter blur-[140px] opacity-60 will-change-transform"
      />
    </div>
  );
};
