import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Enter GitHub username (e.g. torvalds, octocat)...',
  className = '',
  isLoading = false,
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center p-1.5 sm:p-2 bg-surface-container-lowest rounded-xl ghost-shadow focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 ${className}`}
    >
      <div className="absolute left-3.5 sm:left-6 text-secondary flex items-center pointer-events-none">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-14 pr-24 sm:pr-32 py-2.5 sm:py-3.5 bg-transparent border-none outline-none font-label text-xs sm:text-base text-on-surface placeholder:text-secondary/50 placeholder:truncate focus:ring-0"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="absolute right-1.5 sm:right-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="kinetic-gradient text-on-primary px-4 sm:px-7 py-2 sm:py-3 rounded-md font-label font-bold text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase transition-all hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-pulse cursor-pointer"
        >
          {isLoading ? 'Fetching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};
