import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const StatCounter = ({
  value,
  formatK = true,
  className = '',
  duration = 1.2,
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const countObj = useRef({ current: 0 });

  const formatNumber = (num) => {
    if (!formatK) return Math.round(num).toLocaleString();
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return Math.round(num).toLocaleString();
  };

  useEffect(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(formatNumber(value));
      return;
    }

    const obj = countObj.current;
    gsap.killTweensOf(obj);

    gsap.to(obj, {
      current: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(formatNumber(obj.current));
      },
    });

    return () => {
      gsap.killTweensOf(obj);
    };
  }, [value, formatK, duration]);

  return <span className={`font-label ${className}`}>{displayValue}</span>;
};
