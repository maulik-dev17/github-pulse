import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { History, Trash2, ArrowRight, Star, Sparkles } from 'lucide-react';
import { MetadataChip } from '../components/ui/MetadataChip';

export const RecentSearchesView = ({
  recentList,
  onClearRecent,
  onSelectUser,
  onToggleFavorite,
  favorites,
}) => {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [recentList.length]);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-24 relative z-10">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-on-surface font-headline">
              Recent Searches
            </h1>
          </div>
          <p className="font-label text-[11px] sm:text-xs uppercase tracking-widest text-secondary font-medium">
            Terminal Audit Trail & History Log
          </p>
        </div>

        {recentList.length > 0 && (
          <button
            onClick={onClearRecent}
            className="flex items-center gap-1.5 font-label text-xs font-bold text-primary uppercase tracking-widest hover:opacity-75 transition-opacity pb-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List with Staggered Slide In */}
      <div ref={listRef} className="space-y-3">
        {recentList.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-lowest rounded-md ghost-shadow">
            <History className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
            <p className="text-on-surface font-label font-bold text-sm mb-1">
              No recent searches yet
            </p>
            <p className="text-secondary font-label text-xs">
              Queries executed via the terminal search bar will be logged here.
            </p>
          </div>
        ) : (
          recentList.map((item, idx) => {
            const isFav = favorites.includes(item.username);
            return (
              <div
                key={idx}
                className="group bg-surface-container-lowest p-4 sm:p-5 rounded-md flex items-center justify-between ghost-shadow hover:bg-surface-container-low transition-colors duration-200"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => onSelectUser(item.username)}
                >
                  <div className="relative shrink-0">
                    <img
                      className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-surface-container-high"
                      alt={item.username}
                      src={item.avatar}
                    />
                    {isFav && (
                      <div className="absolute -bottom-1 -right-1 bg-primary w-4 h-4 rounded-full border-2 border-surface-container-lowest flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-on-primary fill-on-primary" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-on-surface hover:text-primary transition-colors font-headline">
                        {item.name || item.username}
                      </h2>
                      <span className="font-label text-xs text-primary font-medium">
                        @{item.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <MetadataChip label={item.locationTag || 'Developer'} />
                      <span className="font-label text-[11px] text-secondary font-medium tracking-wide">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => onToggleFavorite(item.username)}
                    className="p-2 text-secondary hover:text-primary transition-colors cursor-pointer"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-4 h-4 ${isFav ? 'fill-primary text-primary' : 'text-secondary/50 hover:text-primary'}`}
                    />
                  </button>

                  <button
                    onClick={() => onSelectUser(item.username)}
                    className="p-2 text-secondary group-hover:text-primary transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Monolith Footer Annotation */}
        <div className="py-10 flex flex-col items-center opacity-40 select-none">
          <Sparkles className="w-5 h-5 mb-2 text-primary" />
          <p className="font-label text-[10px] uppercase tracking-[0.25em] font-bold text-secondary">
            End of History Buffer
          </p>
        </div>
      </div>
    </div>
  );
};
