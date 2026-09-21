import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  MapPin,
  Link as LinkIcon,
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  Building2,
  Flame,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { LanguageBadge } from '../components/ui/LanguageBadge';
import { MetadataChip } from '../components/ui/MetadataChip';
import { StatCounter } from '../components/ui/StatCounter';
import { Button } from '../components/ui/Button';

export const ProfileView = ({
  user,
  onSearch,
  isFavorite,
  onToggleFavorite,
  isLoading,
  sortBy,
  onSortChange,
}) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const reposGridRef = useRef(null);
  const langBarRef = useRef(null);

  // Format joined date nicely
  const formattedDate = React.useMemo(() => {
    if (!user.created_at) return 'Joined GitHub';
    try {
      const d = new Date(user.created_at);
      return `Joined ${d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    } catch {
      return 'Joined GitHub';
    }
  }, [user.created_at]);

  // Format large numbers (for tooltip/static references)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  // GSAP Cinematic Entrance & Cascade Choreography
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance timeline for profile card elements
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      // 2. Cascade reveal of repository cards with 3D perspective
      if (reposGridRef.current) {
        const repoCards = reposGridRef.current.children;
        gsap.fromTo(
          repoCards,
          { opacity: 0, y: 35, rotateX: -6, transformPerspective: 800 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transformPerspective',
          }
        );
      }

      // 3. Language distribution bar smooth expand
      if (langBarRef.current) {
        const segments = langBarRef.current.children;
        gsap.fromTo(
          segments,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [user.login, sortBy]);

  // 3D Mouse Parallax Tilt for the Profile Cardstock (Only for desktop pointer devices)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Disable on touch-only devices or reduced motion
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchOnly || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
      const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle organic tilt range (max 5.5 degrees)
      xTo(xRatio * 7);
      yTo(-yRatio * 7);
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
    };
  }, [user.login]);

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-24 relative z-10">
      {/* Search Input Section - Kinetic Monolith Style */}
      <div className="mb-6 sm:mb-8">
        <SearchBar onSearch={(q) => onSearch(q, sortBy)} isLoading={isLoading} />
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 px-1 overflow-x-auto pb-1 text-xs">
          <span className="font-label text-[10px] sm:text-[11px] text-secondary font-medium uppercase tracking-wider shrink-0">
            Live Search:
          </span>
          {['torvalds', 'shadcn', 'octocat', 'gaearon', 'sindresorhus', 'kentcdodds', 'addyosmani'].map(
            (u) => (
              <button
                key={u}
                onClick={() => onSearch(u, sortBy)}
                className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-label text-[11px] sm:text-xs transition-colors cursor-pointer shrink-0 ${
                  user.login.toLowerCase() === u
                    ? 'bg-primary text-on-primary font-bold shadow-pulse'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-secondary hover:text-on-surface'
                }`}
              >
                @{u}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3D Perspective Container for Profile Card */}
      <div className="perspective-1000 mb-6 sm:mb-8">
        <section
          ref={cardRef}
          className="bg-surface-container-lowest rounded-md p-5 sm:p-8 ghost-shadow relative overflow-hidden preserve-3d will-change-transform"
        >
          {/* Subtle architectural radial ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            {/* Avatar with Intentional Asymmetry & Floating Tilt */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-md overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Interactive Bookmark / Favorite Star */}
              <button
                onClick={() => onToggleFavorite(user.login)}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-surface-container-lowest rounded-full flex items-center justify-center ghost-shadow hover:scale-110 active:scale-95 transition-all text-primary cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-primary text-primary' : 'text-secondary/50 hover:text-primary'
                  }`}
                />
              </button>
            </div>

            {/* User Editorial Typography & Bio */}
            <div className="flex-1 text-center sm:text-left w-full space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tighter font-headline">
                    {user.name || user.login}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                    <p className="font-label text-primary font-bold text-sm tracking-tight">
                      @{user.login}
                    </p>
                    <span className="px-2 py-0.2 bg-secondary-container text-on-secondary-container text-[10px] font-label font-bold rounded-sm uppercase">
                      {user.type}
                    </span>
                  </div>
                </div>

                {/* High Contrast Editorial Placement of Joined Date */}
                <div className="flex items-center justify-center sm:justify-end gap-1 text-secondary">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-label text-xs uppercase tracking-widest">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Bio Narrative */}
              {user.bio ? (
                <p className="text-on-surface leading-relaxed text-sm sm:text-base font-normal max-w-xl">
                  {user.bio}
                </p>
              ) : (
                <p className="text-secondary italic text-sm">
                  No bio provided by this developer.
                </p>
              )}

              {/* Metadata Links, Location & Socials */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1">
                {user.location && (
                  <div className="flex items-center gap-1.5 text-secondary text-xs font-label">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.company && (
                  <div className="flex items-center gap-1.5 text-secondary text-xs font-label">
                    <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{user.company}</span>
                  </div>
                )}

                {user.blog && (
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-secondary hover:text-primary text-xs font-label transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[180px]">
                      {user.blog.replace(/^https?:\/\//, '')}
                    </span>
                  </a>
                )}

                {user.twitter_username && (
                  <a
                    href={`https://x.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-secondary hover:text-primary text-xs font-label transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current text-secondary hover:text-primary shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>@{user.twitter_username}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Rolling GSAP Metric Counters in Tonal Container */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 p-5 bg-surface-container-low rounded-md">
            <div className="text-center">
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-0.5">
                Public Repos
              </p>
              <StatCounter
                value={user.public_repos}
                className="text-2xl font-black text-on-surface"
              />
            </div>

            <div className="text-center">
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-0.5">
                Followers
              </p>
              <StatCounter
                value={user.followers}
                className="text-2xl font-black text-on-surface"
              />
            </div>

            <div className="text-center">
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-0.5">
                Total Stars
              </p>
              <div className="flex items-center justify-center gap-1 text-primary">
                <Flame className="w-4 h-4 fill-primary" />
                <StatCounter
                  value={user.totalStars}
                  className="text-2xl font-black text-primary"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-0.5">
                Total Forks
              </p>
              <StatCounter
                value={user.totalForks}
                className="text-2xl font-black text-on-surface"
              />
            </div>
          </div>

          {/* External GitHub Profile CTA with Magnetic Attraction */}
          <div className="mt-6 flex justify-center">
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button
                variant="primary"
                size="md"
                magnetic={true}
                className="w-full"
                icon={<ExternalLink className="w-4 h-4" />}
              >
                Explore Live GitHub Profile
              </Button>
            </a>
          </div>
        </section>
      </div>

      {/* Real Top Language Distribution Bar with GSAP Expand */}
      {user.topLanguages.length > 0 && (
        <section className="mb-8 p-5 bg-surface-container-lowest rounded-md ghost-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Live Language Distribution
            </h3>
            <span className="font-label text-[11px] text-secondary">
              Analyzed from {user.repos.length} public repos
            </span>
          </div>

          {/* Multi-segment distribution track */}
          <div
            ref={langBarRef}
            className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-container-low mb-3"
          >
            {user.topLanguages.map((lang, idx) => (
              <div
                key={idx}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
              />
            ))}
          </div>

          {/* Language Legend Tags */}
          <div className="flex flex-wrap gap-2">
            {user.topLanguages.map((lang, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-sm font-label text-xs font-bold text-on-surface"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span>{lang.name}</span>
                <span className="text-secondary text-[10px] font-normal">
                  {lang.percentage}%
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Real Organizations Section (if available) */}
      {user.organizations.length > 0 && (
        <section className="mb-8 p-5 bg-surface-container-lowest rounded-md ghost-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-3">
            Affiliated Organizations ({user.organizations.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {user.organizations.map((org) => (
              <a
                key={org.id}
                href={`https://github.com/${org.login}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high rounded-md transition-colors"
              >
                <img
                  src={org.avatar_url}
                  alt={org.login}
                  className="w-6 h-6 rounded-sm object-cover"
                />
                <span className="font-label text-xs font-bold text-on-surface">
                  @{org.login}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Live Public Repositories Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-headline text-xl font-black text-on-surface tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Public Repositories ({user.repos.length})</span>
              </h3>
              <p className="font-label text-xs text-secondary">
                Real-time repositories from GitHub REST API
              </p>
            </div>
            <MetadataChip label="Live Data" className="hidden sm:inline-flex" />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-md self-start sm:self-auto max-w-full overflow-x-auto">
            <span className="font-label text-[10px] text-secondary uppercase font-bold px-1.5 sm:px-2 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3 h-3" />
              Sort:
            </span>
            {['updated', 'stars', 'forks'].map((s) => (
              <button
                key={s}
                onClick={() => onSortChange(s)}
                className={`px-2 sm:px-2.5 py-1 rounded-sm font-label text-[11px] sm:text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  sortBy === s
                    ? 'bg-surface-container-lowest text-primary ghost-shadow'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Staggered Perspective Cascade Grid */}
        <div ref={reposGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {user.repos && user.repos.length > 0 ? (
            user.repos.map((repo) => (
              <div
                key={repo.id}
                className="group p-4 sm:p-5 bg-surface-container-lowest rounded-md ghost-shadow hover:ghost-shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between will-change-transform"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-headline font-bold text-sm sm:text-base text-primary hover:text-primary-container tracking-tight transition-colors line-clamp-1 flex items-center gap-1 min-w-0 flex-1"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                    <div className="flex items-center gap-1 shrink-0">
                      {repo.isFork && (
                        <span className="text-[10px] font-label px-1.5 py-0.2 bg-surface-container-low text-secondary rounded-sm">
                          Fork
                        </span>
                      )}
                      <span className="text-[9px] sm:text-[10px] font-label px-2 py-0.5 bg-surface-container-low text-secondary rounded-sm uppercase font-semibold">
                        Public
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed mb-4 line-clamp-2">
                    {repo.description || 'No description provided for this repository.'}
                  </p>

                  {/* Real Topics Tags */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {repo.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-surface-container-low text-secondary text-[10px] font-label rounded-sm"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {repo.language ? (
                      <LanguageBadge
                        language={repo.language}
                        dotColor={repo.languageColor}
                      />
                    ) : (
                      <span className="text-[11px] font-label text-secondary">
                        Documentation
                      </span>
                    )}

                    {repo.licenseName && (
                      <span className="text-[10px] font-label text-secondary truncate max-w-[80px]">
                        {repo.licenseName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-secondary">
                    <div className="flex items-center gap-1 font-label text-xs">
                      <Star className="w-3.5 h-3.5 text-secondary" />
                      <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>
                    <div className="flex items-center gap-1 font-label text-xs">
                      <GitFork className="w-3.5 h-3.5 text-secondary" />
                      <span>{formatNumber(repo.forks_count)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 bg-surface-container-lowest rounded-md text-center text-secondary font-label text-xs">
              No public repositories found for this account.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
