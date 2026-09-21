import React from 'react';
import { UserX, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';

export const NotFoundView = ({
  searchedTerm,
  errorType = 'not-found',
  rateLimitResetDate,
  onSearch,
  isLoading,
}) => {
  const isRateLimited = errorType === 'rate-limit';

  const resetTimeString = React.useMemo(() => {
    if (!rateLimitResetDate) return 'soon';
    return rateLimitResetDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [rateLimitResetDate]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-28 md:pb-24 flex flex-col items-center">
      {/* Search Bar */}
      <div className="w-full mb-8 sm:mb-12">
        <SearchBar
          initialValue={searchedTerm}
          onSearch={onSearch}
          placeholder="Try searching another GitHub username..."
          isLoading={isLoading}
        />
      </div>

      {/* Asymmetric Error Card */}
      <div className="relative mb-6 sm:mb-8 w-full max-w-md">
        <div className="absolute -top-4 -right-8 w-36 h-36 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-6 -left-10 w-28 h-28 bg-secondary-container rounded-full mix-blend-multiply filter blur-2xl opacity-40" />

        <div className="relative bg-surface-container-lowest p-6 sm:p-8 rounded-md ghost-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4 text-primary">
            {isRateLimited ? (
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            ) : (
              <UserX className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            )}
          </div>

          <div className="inline-block bg-error-container text-on-error-container px-3 py-1 rounded-sm font-label text-[10px] font-bold uppercase tracking-widest mb-2">
            {isRateLimited ? 'Status: 403 Rate Limit Exceeded' : 'Status: 404 User Not Found'}
          </div>

          {isRateLimited ? (
            <p className="font-label text-xs text-secondary font-medium">
              Anonymous GitHub API limit of 60 req/hr reached. Resets at {resetTimeString}.
            </p>
          ) : (
            <p className="font-label text-xs text-secondary font-medium">
              "{searchedTerm}" did not return any GitHub records.
            </p>
          )}
        </div>
      </div>

      {/* Typography Message */}
      <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight mb-3 font-headline text-center">
        {isRateLimited ? 'GitHub Rate Limit Reached' : 'User Profile Not Found'}
      </h2>

      <p className="text-secondary leading-relaxed font-label text-sm font-medium text-center max-w-md mb-8">
        {isRateLimited ? (
          <>
            GitHub's anonymous REST API request limit has been reached for this hour. The rate limit resets at {resetTimeString}. Please try again shortly or search a cached developer.
          </>
        ) : (
          <>
            We could not locate any public account matching <span className="text-primary font-bold">@{searchedTerm}</span> on GitHub. Please check the spelling or explore verified developers below.
          </>
        )}
      </p>

      {/* Action Button */}
      <div className="flex items-center gap-3 mb-10">
        <Button
          variant="primary"
          size="md"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={() => onSearch(searchedTerm || 'octocat')}
        >
          {isRateLimited ? 'Retry Request' : 'Try Again'}
        </Button>
      </div>

      {/* Recommended Verified Profiles */}
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <p className="font-label text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">
            Explore Verified Active Developers
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {['torvalds', 'shadcn', 'octocat', 'gaearon', 'sindresorhus', 'kentcdodds', 'addyosmani'].map(
            (u) => (
              <button
                key={u}
                onClick={() => onSearch(u)}
                className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-full text-xs font-bold text-on-surface font-label cursor-pointer"
              >
                @{u}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
