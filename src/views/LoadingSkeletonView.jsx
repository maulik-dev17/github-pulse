import React from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

export const LoadingSkeletonView = ({
  onCancel,
  targetUsername,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-24 relative z-10">
      {/* High-Velocity Editorial Radar Header */}
      <div className="mb-8 p-4 sm:p-5 bg-surface-container-lowest rounded-md ghost-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary-fixed-dim text-on-primary-fixed-variant flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-sm text-on-surface">
                Streaming Real-Time GitHub Telemetry
              </span>
              {targetUsername && (
                <span className="font-label text-xs text-primary font-bold">
                  @{targetUsername}
                </span>
              )}
            </div>
            <p className="font-label text-xs text-secondary">
              Querying GitHub REST API v3 • Decomposing repositories & language vectors
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high rounded-md font-label text-xs font-bold text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Kinetic Pulse Skeleton Card */}
      <div className="animate-kinetic-pulse space-y-8">
        <div className="bg-surface-container-lowest rounded-md p-6 sm:p-8 ghost-shadow relative overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-md bg-surface-container-highest shrink-0" />
            <div className="flex-grow space-y-4 w-full">
              <div className="h-8 bg-surface-container-highest rounded-md w-2/3" />
              <div className="h-4 bg-surface-container-high rounded-sm w-1/3" />
              <div className="pt-3 space-y-2">
                <div className="h-3.5 bg-surface-container-high rounded-sm w-full" />
                <div className="h-3.5 bg-surface-container-high rounded-sm w-4/5" />
              </div>
            </div>
          </div>

          {/* Stats Bar Skeleton */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-surface-container-low rounded-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
                <div className="h-6 bg-surface-container-highest rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Repositories Skeleton Cascade */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="h-5 bg-surface-container-high rounded w-48" />
            <div className="h-4 bg-surface-container-high rounded w-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-5 rounded-md ghost-shadow space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="h-5 bg-surface-container-highest rounded w-1/2" />
                  <div className="h-4 bg-surface-container-high rounded-full w-14" />
                </div>
                <div className="h-3 bg-surface-container-high rounded w-full" />
                <div className="h-3 bg-surface-container-high rounded w-3/4" />
                <div className="flex justify-between pt-2">
                  <div className="h-4 bg-surface-container-highest rounded w-20" />
                  <div className="h-4 bg-surface-container-high rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
