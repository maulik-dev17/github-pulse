import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star, ArrowRight, UserCheck, Loader2 } from 'lucide-react';
import { fetchGitHubProfile } from '../services/githubApi';
import { MetadataChip } from '../components/ui/MetadataChip';
import { Button } from '../components/ui/Button';

export const FavoritesView = ({
  favorites,
  onSelectUser,
  onToggleFavorite,
}) => {
  const [loadedProfiles, setLoadedProfiles] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch live profiles for favorited users
  useEffect(() => {
    favorites.forEach(async (username) => {
      if (loadedProfiles[username] || loadingUsers[username]) return;

      setLoadingUsers((prev) => ({ ...prev, [username]: true }));
      try {
        const liveProfile = await fetchGitHubProfile(username);
        setLoadedProfiles((prev) => ({ ...prev, [username]: liveProfile }));
      } catch (err) {
        console.warn(`Could not load favorite profile for @${username}`, err);
      } finally {
        setLoadingUsers((prev) => ({ ...prev, [username]: false }));
      }
    });
  }, [favorites]);

  // Staggered reveal of bento cards
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [favorites.length]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-24 relative z-10">
      {/* Editorial Page Header */}
      <section className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-on-surface font-headline">
            Favorite Profiles
          </h1>
        </div>
        <p className="font-label text-[11px] sm:text-xs uppercase tracking-widest text-secondary font-medium">
          Your Curated Live Developer Network ({favorites.length} Saved)
        </p>
      </section>

      {/* Kinetic Monolith Bento Grid Layout */}
      {favorites.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-surface-container-lowest rounded-md ghost-shadow">
          <Star className="w-10 h-10 sm:w-12 sm:h-12 text-secondary/40 mx-auto mb-3" />
          <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface mb-1">
            No favorites saved yet
          </h3>
          <p className="font-label text-xs text-secondary mb-6 max-w-sm mx-auto">
            Search for developers and tap the star icon to curate your live developer network.
          </p>
          <Button variant="primary" size="md" magnetic={true} onClick={() => onSelectUser('octocat')}>
            Explore Octocat
          </Button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {favorites.map((username, index) => {
            const profile = loadedProfiles[username];
            const isUserLoading = loadingUsers[username];
            const isLargeSpan = index === 0;

            return (
              <div
                key={username}
                className={`${
                  isLargeSpan ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-6'
                } bg-surface-container-lowest rounded-md p-5 sm:p-8 ghost-shadow hover:ghost-shadow-hover hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group`}
              >
                <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
                  <button
                    onClick={() => onToggleFavorite(username)}
                    className="text-primary hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Toggle Favorite"
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-primary" />
                  </button>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start mb-4">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-md overflow-hidden shadow-md transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 shrink-0 bg-surface-container-low">
                      {profile ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.name || username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-on-surface font-headline tracking-tight">
                        {profile?.name || username}
                      </h3>
                      <p className="font-label text-primary font-bold text-xs">
                        @{username}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <MetadataChip label={profile?.type || 'User'} />
                        {profile?.company && (
                          <span className="px-2.5 py-0.5 bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-label font-bold rounded-sm uppercase">
                            {profile.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {profile?.bio && (
                    <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {profile && (
                    <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low rounded-md mb-6 text-center">
                      <div>
                        <span className="block font-label font-black text-base text-on-surface">
                          {formatNumber(profile.followers)}
                        </span>
                        <span className="text-secondary text-[9px] font-label uppercase tracking-widest">
                          Followers
                        </span>
                      </div>
                      <div>
                        <span className="block font-label font-black text-base text-on-surface">
                          {profile.public_repos}
                        </span>
                        <span className="text-secondary text-[9px] font-label uppercase tracking-widest">
                          Repos
                        </span>
                      </div>
                      <div>
                        <span className="block font-label font-black text-base text-primary">
                          {formatNumber(profile.totalStars)}
                        </span>
                        <span className="text-secondary text-[9px] font-label uppercase tracking-widest">
                          Stars
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    variant="primary"
                    size="sm"
                    magnetic={true}
                    onClick={() => onSelectUser(username)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    disabled={isUserLoading}
                  >
                    Open Profile
                  </Button>

                  <span className="text-[11px] font-label text-secondary flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Live REST</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
