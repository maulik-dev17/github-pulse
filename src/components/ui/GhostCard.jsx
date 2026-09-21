import React from 'react';

export const GhostCard = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  withFallbackBorder = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest rounded-md p-6 ghost-shadow transition-all duration-300 ${
        hoverable ? 'hover:ghost-shadow-hover hover:-translate-y-0.5 cursor-pointer' : ''
      } ${withFallbackBorder ? 'ghost-border-fallback' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
