import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { MetadataChip } from '../components/ui/MetadataChip';

export const HomeView = ({ onSearch, isLoading }) => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const spotlightsRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Hero elements entrance
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }

      // Spotlights stagger
      if (spotlightsRef.current) {
        gsap.fromTo(
          spotlightsRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const spotlights = [
    {
      username: 'torvalds',
      name: 'Linus Torvalds',
      tag: 'Kernel & Git',
      followers: '235k',
      repos: '7',
      bio: 'Creator of Linux and Git. Linux Foundation Fellow shaping the backbone of global operating systems.',
      avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    },
    {
      username: 'shadcn',
      name: 'shadcn',
      tag: 'UI & Components',
      followers: '112k',
      repos: '42',
      bio: 'Creator of shadcn/ui. Transforming modern React component distribution and developer ergonomics.',
      avatar: 'https://avatars.githubusercontent.com/u/124599?v=4',
    },
    {
      username: 'sindresorhus',
      name: 'Sindre Sorhus',
      tag: 'Open Sourcerer',
      followers: '59.2k',
      repos: '1.1k',
      bio: 'Full-time open-source engineer. Maintenance of 1,100+ npm packages downloaded billions of times.',
      avatar: 'https://avatars.githubusercontent.com/u/170270?v=4',
    },
    {
      username: 'gaearon',
      name: 'Dan Abramov',
      tag: 'React & Redux',
      followers: '88.4k',
      repos: '265',
      bio: 'Co-author of Redux and Create React App. Exploring new frontiers in reactive programming.',
      avatar: 'https://avatars.githubusercontent.com/u/810438?v=4',
    },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-28 md:pb-24 relative z-10">
      {/* Editorial Hero Section */}
      <section ref={heroRef} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="font-label text-[11px] sm:text-xs uppercase tracking-widest text-secondary font-bold">
            The Kinetic Monolith Showcase
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-on-surface font-headline tracking-tighter leading-tight sm:leading-none">
          Explore the Minds <br className="hidden sm:block" />
          <span className="text-primary">Shaping Software.</span>
        </h1>

        <p className="font-label text-secondary text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto px-2">
          High-velocity GitHub telemetry stripped of cluttered dashboard borders. Data floating on logic-driven surfaces with editorial whitespace.
        </p>

        {/* Central Floating Search Bar */}
        <div className="pt-2 max-w-2xl mx-auto w-full">
          <SearchBar onSearch={onSearch} isLoading={isLoading} />
        </div>

        {/* Suggested Quick Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 sm:pt-2 text-xs">
          <span className="font-label text-[10px] sm:text-[11px] text-secondary font-medium uppercase tracking-wider">
            Popular Creators:
          </span>
          {['torvalds', 'shadcn', 'octocat', 'gaearon', 'sindresorhus', 'addyosmani', 'tj'].map(
            (u) => (
              <button
                key={u}
                onClick={() => onSearch(u)}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-surface-container-low hover:bg-surface-container-high rounded-full font-label text-[11px] sm:text-xs text-secondary hover:text-on-surface transition-colors cursor-pointer"
              >
                @{u}
              </button>
            )
          )}
        </div>
      </section>

      {/* Spotlight Creators Bento Grid */}
      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-on-surface font-headline tracking-tight">
              Spotlight Architects
            </h2>
            <p className="font-label text-xs text-secondary">
              Direct telemetry from verified creators
            </p>
          </div>
          <MetadataChip label="Live GitHub Profiles" className="self-start sm:self-auto" />
        </div>

        <div ref={spotlightsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {spotlights.map((dev) => (
            <div
              key={dev.username}
              className="bg-surface-container-lowest rounded-md p-5 sm:p-6 ghost-shadow hover:ghost-shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shadow-sm shrink-0 bg-surface-container-low transform group-hover:scale-105 transition-transform">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="px-2 py-0.5 bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-label font-bold rounded-sm uppercase">
                    {dev.tag}
                  </span>
                </div>

                <h3 className="font-headline font-black text-base sm:text-lg text-on-surface tracking-tight">
                  {dev.name}
                </h3>
                <p className="font-label text-xs text-primary font-bold mb-2 sm:mb-3">
                  @{dev.username}
                </p>

                <p className="text-secondary text-xs leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                  {dev.bio}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 p-2 sm:p-2.5 bg-surface-container-low rounded-md mb-4 text-center">
                  <div>
                    <span className="block font-label font-black text-xs sm:text-sm text-on-surface">
                      {dev.followers}
                    </span>
                    <span className="text-secondary text-[8px] sm:text-[9px] font-label uppercase tracking-widest">
                      Followers
                    </span>
                  </div>
                  <div>
                    <span className="block font-label font-black text-xs sm:text-sm text-on-surface">
                      {dev.repos}
                    </span>
                    <span className="text-secondary text-[8px] sm:text-[9px] font-label uppercase tracking-widest">
                      Repos
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  magnetic={true}
                  onClick={() => onSearch(dev.username)}
                  className="w-full"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Inspect Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
