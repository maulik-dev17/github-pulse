import React from 'react';

export const LanguageBadge = ({
  language,
  dotColor,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-primary-fixed-dim text-on-primary-fixed-variant text-[11px] font-label font-bold tracking-wide rounded-full ${className}`}
    >
      {dotColor && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      <span>{language}</span>
    </span>
  );
};
