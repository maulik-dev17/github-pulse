import React from 'react';
import { Star, History, Search, Home, KeyRound, Sparkles } from 'lucide-react';

export const Header = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  onOpenTokenManager,
  onOpenDesignInspector,
  rateLimit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-surface ghost-shadow transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Brand & Editorial Title (Navigates to Home) */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-primary text-on-primary flex items-center justify-center font-black text-xs sm:text-sm tracking-tighter shadow-pulse group-hover:scale-105 transition-transform shrink-0">
            KM
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-headline tracking-tighter font-black text-on-surface text-lg sm:text-xl leading-none">
                GitHub Pulse
              </h1>
              <span className="px-1.5 sm:px-2 py-0.5 bg-primary-fixed-dim text-on-primary-fixed-variant text-[8px] sm:text-[9px] font-label font-bold uppercase tracking-widest rounded-full">
                Editorial
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-label text-secondary font-medium tracking-tight mt-0.5 hidden sm:block">
              The Kinetic Monolith — Developer Showcase
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Token Manager & API Quota Indicator */}
          <button
            onClick={onOpenTokenManager}
            className="px-2.5 py-1.5 rounded-md bg-surface-container-low hover:bg-surface-container-high text-secondary hover:text-on-surface flex items-center gap-1.5 text-xs font-label font-bold cursor-pointer transition-colors active:scale-95"
            title="GitHub API Rate Limit & Personal Access Token"
            aria-label="Manage GitHub API Token"
          >
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">
              {rateLimit ? `${rateLimit.remaining}/${rateLimit.limit}` : 'API Quota'}
            </span>
          </button>

          {/* Design System Token Inspector Button */}
          <button
            onClick={onOpenDesignInspector}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-surface-container-low hover:bg-surface-container-high text-secondary hover:text-on-surface flex items-center gap-1.5 text-xs font-label font-bold cursor-pointer transition-colors active:scale-95"
            title="Inspect Design System & Tokens"
            aria-label="Design System Tokens"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="hidden lg:inline">Design System</span>
          </button>

          {/* Mobile Quick Action */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('favorites')}
              className="p-2 rounded-md bg-surface-container-low text-primary flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              title="View Favorites"
              aria-label="View Favorites"
            >
              <Star className="w-4 h-4 fill-primary" />
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 bg-primary text-on-primary text-[10px] font-label font-bold rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Tab Switchers (Desktop & Tablet md+) */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low p-1 rounded-md">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-sm font-label text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-surface-container-lowest text-primary ghost-shadow'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </span>
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`px-3 py-1.5 rounded-sm font-label text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-surface-container-lowest text-primary ghost-shadow'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Explorer</span>
              </span>
            </button>
            <button
              onClick={() => onSelectTab('favorites')}
              className={`px-3 py-1.5 rounded-sm font-label text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'favorites'
                  ? 'bg-surface-container-lowest text-primary ghost-shadow'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-secondary-container text-on-secondary-container text-[10px] rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => onSelectTab('recent')}
              className={`px-3 py-1.5 rounded-sm font-label text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'recent'
                  ? 'bg-surface-container-lowest text-primary ghost-shadow'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
