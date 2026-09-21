import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  magnetic = false,
  ...props
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn || !magnetic) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Magnetic pull range (max 6px offset)
      xTo(distanceX * 0.2);
      yTo(distanceY * 0.2);
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.2, 0.4)',
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(btn);
    };
  }, [magnetic]);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md font-label',
    md: 'px-6 py-2.5 text-sm rounded-md font-label font-bold tracking-wider uppercase',
    lg: 'px-8 py-3.5 text-base rounded-md font-label font-bold tracking-widest uppercase',
  }[size];

  const variantStyles = {
    // Primary: Solid #b80035 with on_primary #ffffff. Corner radius md (0.75rem).
    // On hover, transitions to primary_container gradient (135deg).
    primary:
      'bg-primary text-on-primary hover:bg-gradient-to-br hover:from-primary hover:to-primary-container shadow-pulse active:scale-95 transition-all duration-200 select-none cursor-pointer',
    // Tertiary (Ghost): No background. Text uses primary. On hover, subtle surface-container-high appears.
    ghost:
      'bg-transparent text-primary hover:bg-surface-container-high active:scale-95 transition-colors duration-150 select-none cursor-pointer',
    // Surface: Subtle elevated button
    surface:
      'bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-95 transition-colors duration-150 select-none cursor-pointer',
  }[variant];

  return (
    <button
      ref={buttonRef}
      className={`inline-flex items-center justify-center gap-2 outline-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
