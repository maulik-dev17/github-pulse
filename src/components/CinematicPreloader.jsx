import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CinematicPreloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const counterRef = useRef(null);
  const statusRef = useRef(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // If user prefers reduced motion, finish immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const statuses = [
      'INITIALIZING MONOLITH SURFACES',
      'STACKING CARDSTOCK LAYERS',
      'CALIBRATING INTER & SPACE GROTESK',
      'CONNECTING LIVE GITHUB REST TELEMETRY',
      'THE KINETIC MONOLITH — READY',
    ];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide curtain upward smoothly
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power4.inOut',
            onComplete,
          });
        },
      });

      // Animate progress line width
      tl.to(
        lineRef.current,
        {
          width: '100%',
          duration: 1.6,
          ease: 'power2.inOut',
        },
        0
      );

      // Animate percentage count from 0 to 100
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            const current = Math.round(counterObj.val);
            setPercent(current);
            const statusIndex = Math.min(
              Math.floor((current / 100) * statuses.length),
              statuses.length - 1
            );
            if (statusRef.current) {
              statusRef.current.innerText = statuses[statusIndex];
            }
          },
        },
        0
      );

      // Slight hold at 100% for impact
      tl.to({}, { duration: 0.25 });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col justify-between p-5 sm:p-14 bg-surface text-on-surface select-none will-change-transform"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary text-on-primary font-black text-xs flex items-center justify-center shadow-pulse">
            KM
          </div>
          <div>
            <span className="font-headline font-black text-xs sm:text-sm tracking-tight block text-on-surface">
              GitHub Pulse
            </span>
            <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest text-secondary block">
              The Kinetic Monolith
            </span>
          </div>
        </div>

        {/* Skip button for user convenience */}
        <button
          onClick={onComplete}
          className="text-[11px] sm:text-xs font-label text-secondary hover:text-primary transition-colors cursor-pointer uppercase tracking-widest px-2 py-1"
        >
          [ Skip ]
        </button>
      </div>

      {/* Center Cinematic Display Counter */}
      <div className="max-w-xl mx-auto w-full text-center space-y-3 sm:space-y-4 px-2">
        <div className="overflow-hidden">
          <span
            ref={counterRef}
            className="font-headline font-black text-6xl sm:text-8xl md:text-9xl text-on-surface tracking-tighter inline-block tabular-nums"
          >
            {percent.toString().padStart(2, '0')}%
          </span>
        </div>

        {/* Progress Scoring Line */}
        <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
          <div
            ref={lineRef}
            className="h-full kinetic-gradient w-0 rounded-full will-change-transform"
          />
        </div>

        {/* Dynamic Status Log */}
        <p
          ref={statusRef}
          className="font-label text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold h-5 truncate"
        >
          INITIALIZING MONOLITH SURFACES
        </p>
      </div>

      {/* Bottom Editorial Caption */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-secondary font-label text-[10px] uppercase tracking-widest gap-2">
        <span>Editorial Showcase & High-Velocity Telemetry</span>
        <span>Awwwards Cinematic Standard</span>
      </div>
    </div>
  );
};
