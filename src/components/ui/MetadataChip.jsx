import React from 'react';

export const MetadataChip = ({
  label,
  className = '',
  icon,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-label font-bold uppercase tracking-wider rounded-sm shadow-[inset_0_-1px_1px_rgba(0,0,0,0.08)] ${className}`}
    >
      {icon && <span className="text-[12px] shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
