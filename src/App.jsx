import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { fetchGitHubProfile } from './services/githubApi';
import {
  getStoredFavorites,
  saveStoredFavorites,
  getStoredRecent,
  saveStoredRecent,
} from './services/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AmbientCanvas } from './components/AmbientCanvas';
import { KineticTicker } from './components/KineticTicker';
import { CinematicPreloader } from './components/CinematicPreloader';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { FavoritesView } from './views/FavoritesView';
import { RecentSearchesView } from './views/RecentSearchesView';
import { LoadingSkeletonView } from './views/LoadingSkeletonView';
import { NotFoundView } from './views/NotFoundView';

export function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [searchedTerm, setSearchedTerm] = useState('octocat');
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState('not-found');
  const [rateLimitResetDate, setRateLimitResetDate] = useState(null);

  const [favorites, setFavorites] = useState(getStoredFavorites);
  const [recentList, setRecentList] = useState(getStoredRecent);
  const [sortBy, setSortBy] = useState('updated');

  // Preloader session flag: runs on initial visit
  const [isPreloading, setIsPreloading] = useState(() => {
    try {
      return !sessionStorage.getItem('github_pulse_preloaded');
    } catch {
      return false;
    }
  });

  const abortControllerRef = useRef(null);
  const mainContentRef = useRef(null);

  // Synchronize favorites with localStorage
  useEffect(() => {
    saveStoredFavorites(favorites);
  }, [favorites]);

  // Synchronize recent searches with localStorage
  useEffect(() => {
    saveStoredRecent(recentList);
  }, [recentList]);

  // Smooth view transition on tab switch
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [currentTab]);

  // Live search handler with AbortController protection
  const handleSearch = useCallback(
    async (username, chosenSort = sortBy) => {
      const cleanUsername = username.trim().toLowerCase();
      if (!cleanUsername) return;

      // Cancel ongoing in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSearchedTerm(cleanUsername);
      setIsLoading(true);
      setCurrentTab('loading');

      try {
        const userProfile = await fetchGitHubProfile(cleanUsername, chosenSort, false, controller.signal);
        setActiveUser(userProfile);
        setCurrentTab('profile');

        // Update Recent Searches
        setRecentList((prev) => {
          const filtered = prev.filter(
            (item) => item.username.toLowerCase() !== cleanUsername
          );
          const newItem = {
            username: userProfile.login,
            name: userProfile.name || userProfile.login,
            locationTag: userProfile.location || 'Developer',
            timeAgo: 'Just now',
            timestamp: Date.now(),
            avatar: userProfile.avatar_url,
            starred: favorites.includes(userProfile.login),
          };
          return [newItem, ...filtered].slice(0, 25);
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        if (err?.message === 'RATE_LIMITED') {
          setErrorType('rate-limit');
          setRateLimitResetDate(err.resetDate || null);
          setCurrentTab('not-found');
        } else if (err?.message === 'USER_NOT_FOUND') {
          setErrorType('not-found');
          setCurrentTab('not-found');
        } else {
          setErrorType('network');
          setCurrentTab('not-found');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [favorites, sortBy]
  );

  // Handle repository sort changes
  const handleSortChange = useCallback(
    (newSort) => {
      setSortBy(newSort);
      if (activeUser) {
        handleSearch(activeUser.login, newSort);
      }
    },
    [activeUser, handleSearch]
  );

  // Toggle favorite status
  const handleToggleFavorite = useCallback((username) => {
    const clean = username.toLowerCase();
    setFavorites((prev) => {
      const exists = prev.includes(clean);
      return exists ? prev.filter((u) => u !== clean) : [...prev, clean];
    });
  }, []);

  // Clear search history
  const handleClearRecent = useCallback(() => {
    setRecentList([]);
  }, []);

  const handleSelectTab = useCallback((tab) => {
    if (tab === 'profile' && !activeUser) {
      handleSearch('torvalds');
      return;
    }
    setCurrentTab(tab);
  }, [activeUser, handleSearch]);

  const handlePreloadComplete = () => {
    try {
      sessionStorage.setItem('github_pulse_preloaded', 'true');
    } catch {
      // Ignore storage errors
    }
    setIsPreloading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-white relative">
      {/* Cinematic Entry Preloader (Plays once on initial visit) */}
      {isPreloading && <CinematicPreloader onComplete={handlePreloadComplete} />}

      {/* Atmospheric Ambient Canvas (Paper Grain + Interactive Glow) */}
      <AmbientCanvas />

      {/* Clean Editorial Sticky Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main ref={mainContentRef} className="flex-1 flex flex-col relative z-10">
        {currentTab === 'home' && (
          <HomeView onSearch={handleSearch} isLoading={isLoading} />
        )}

        {currentTab === 'profile' && (
          activeUser ? (
            <ProfileView
              user={activeUser}
              onSearch={handleSearch}
              isFavorite={favorites.includes(activeUser.login.toLowerCase())}
              onToggleFavorite={handleToggleFavorite}
              isLoading={isLoading}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          ) : (
            <HomeView onSearch={handleSearch} isLoading={isLoading} />
          )
        )}

        {currentTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onSelectUser={handleSearch}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'recent' && (
          <RecentSearchesView
            recentList={recentList}
            onClearRecent={handleClearRecent}
            onSelectUser={handleSearch}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {currentTab === 'loading' && (
          <LoadingSkeletonView
            targetUsername={searchedTerm}
            onCancel={() => {
              if (activeUser) setCurrentTab('profile');
              else setCurrentTab('home');
            }}
          />
        )}

        {currentTab === 'not-found' && (
          <NotFoundView
            searchedTerm={searchedTerm}
            errorType={errorType}
            rateLimitResetDate={rateLimitResetDate}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Live Terminal Velocity Marquee */}
      <KineticTicker />

      {/* Clean Minimal Editorial Footer */}
      <footer className="py-6 sm:py-8 px-4 w-full flex flex-col items-center gap-2 bg-surface-container-low text-secondary font-label text-xs relative z-10 mb-20 md:mb-0 text-center">
        <p className="font-medium text-on-surface">
          GitHub Pulse — The Kinetic Monolith Editorial Architecture
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-secondary/80">
          <span>Live GitHub REST Telemetry</span>
          <span>•</span>
          <span>No-Line Stacking System</span>
          <span>•</span>
          <span>Inter & Space Grotesk</span>
        </div>
      </footer>

      {/* Responsive Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        favoritesCount={favorites.length}
      />
    </div>
  );
}

export default App;
