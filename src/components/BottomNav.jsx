import React from 'react';
import { Home, Search, Star, History } from 'lucide-react';

export const BottomNav = ({
  currentTab,
  onSelectTab,
  favoritesCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container-lowest/95 backdrop-blur-xl ghost-shadow z-50">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-md transition-all active:scale-90 ${
          currentTab === 'home'
            ? 'bg-surface-container-low text-primary font-bold'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">
          Home
        </span>
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-md transition-all active:scale-90 ${
          currentTab === 'profile' || currentTab === 'loading' || currentTab === 'not-found'
            ? 'bg-surface-container-low text-primary font-bold'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">
          Explore
        </span>
      </button>

      <button
        onClick={() => onSelectTab('favorites')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-md transition-all active:scale-90 relative ${
          currentTab === 'favorites'
            ? 'bg-surface-container-low text-primary font-bold'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <Star className={`w-5 h-5 ${currentTab === 'favorites' ? 'fill-primary' : ''}`} />
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">
          Favorites
        </span>
        {favoritesCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-primary text-on-primary text-[9px] font-label font-bold rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('recent')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-md transition-all active:scale-90 ${
          currentTab === 'recent'
            ? 'bg-surface-container-low text-primary font-bold'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <History className="w-5 h-5" />
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">
          Recent
        </span>
      </button>
    </nav>
  );
};
