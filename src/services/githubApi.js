// Standard GitHub language hex colors mapping
export const LANGUAGE_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Scala: '#c22d40',
  Lua: '#000080',
  R: '#198CE7',
  Markdown: '#083fa1',
};

const GITHUB_TOKEN_STORAGE_KEY = 'github_pulse_pat_v1';
const CACHE_PREFIX = 'github_pulse_cache_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache to protect live rate limits

/**
 * Retrieves the optional custom GitHub token from localStorage
 */
export function getStoredToken() {
  try {
    return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Saves or clears the optional custom GitHub token
 */
export function saveStoredToken(token) {
  try {
    if (!token.trim()) {
      localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
    } else {
      localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token.trim());
    }
  } catch (e) {
    console.error('Failed to save GitHub token', e);
  }
}

/**
 * Builds HTTP headers with Bearer token if provided by the user
 */
function getHeaders() {
  const token = getStoredToken();
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetches current rate limit status from the live GitHub REST API
 */
export async function fetchRateLimit() {
  const token = getStoredToken();
  try {
    const res = await fetch('https://api.github.com/rate_limit', {
      headers: getHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000),
        isCustomToken: Boolean(token),
      };
    }
  } catch (err) {
    console.warn('Could not fetch rate limit status from GitHub API', err);
  }

  // Fallback estimation
  return {
    limit: token ? 5000 : 60,
    remaining: token ? 5000 : 60,
    reset: new Date(Date.now() + 3600000),
    isCustomToken: Boolean(token),
  };
}

/**
 * Fetches real, live GitHub user data, repositories, and organizations.
 * Processes language shares and stars into production-ready models.
 */
export async function fetchGitHubProfile(
  username,
  sortBy = 'updated',
  forceRefresh = false,
  signal
) {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) {
    throw new Error('USERNAME_REQUIRED');
  }

  const cacheKey = `${CACHE_PREFIX}${cleanUsername}_${sortBy}`;

  // Check client-side cache unless forced refresh
  if (!forceRefresh) {
    try {
      const cachedRaw = sessionStorage.getItem(cacheKey);
      if (cachedRaw) {
        const { timestamp, data } = JSON.parse(cachedRaw);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          return data;
        }
      }
    } catch {
      // Ignore cache parse failure
    }
  }

  // 1. Fetch live user profile
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
    headers: getHeaders(),
    signal,
  });

  if (userRes.status === 404) {
    throw new Error('USER_NOT_FOUND');
  }

  if (userRes.status === 403) {
    const resetEpoch = userRes.headers.get('x-ratelimit-reset');
    const resetDate = resetEpoch ? new Date(parseInt(resetEpoch, 10) * 1000) : new Date(Date.now() + 3600000);
    const err = new Error('RATE_LIMITED');
    err.resetDate = resetDate;
    throw err;
  }

  if (!userRes.ok) {
    throw new Error(`GITHUB_API_ERROR_${userRes.status}`);
  }

  const rawUser = await userRes.json();

  // 2. Fetch live public repositories (up to 30)
  let rawRepos = [];
  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=${sortBy}&per_page=30`,
      { headers: getHeaders(), signal }
    );
    if (reposRes.ok) {
      rawRepos = await reposRes.json();
    }
  } catch (repoErr) {
    if (repoErr.name === 'AbortError') throw repoErr;
    console.warn('Could not fetch repos for user', repoErr);
  }

  // 3. Fetch live user organizations
  let rawOrgs = [];
  try {
    const orgsRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/orgs`,
      { headers: getHeaders(), signal }
    );
    if (orgsRes.ok) {
      rawOrgs = await orgsRes.json();
    }
  } catch (orgsErr) {
    console.warn('Could not fetch orgs for user', orgsErr);
  }

  // 4. Calculate real metrics across fetched repositories
  let totalStars = 0;
  let totalForks = 0;
  const languageCounts = {};

  const processedRepos = rawRepos.map((r) => {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;

    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }

    return {
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      languageColor: r.language ? (LANGUAGE_COLORS[r.language] || '#64748b') : undefined,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      updated_at: r.updated_at,
      homepage: r.homepage,
      topics: r.topics || [],
      licenseName: r.license?.name || null,
      isFork: r.fork,
    };
  });

  // Calculate language distribution percentage
  const totalLanguageCount = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalLanguageCount > 0 ? Math.round((count / totalLanguageCount) * 100) : 0,
      color: LANGUAGE_COLORS[name] || '#64748b',
    }));

  const processedUser = {
    login: rawUser.login,
    id: rawUser.id,
    name: rawUser.name,
    avatar_url: rawUser.avatar_url,
    html_url: rawUser.html_url,
    bio: rawUser.bio,
    company: rawUser.company,
    blog: rawUser.blog,
    location: rawUser.location,
    public_repos: rawUser.public_repos,
    public_gists: rawUser.public_gists,
    followers: rawUser.followers,
    following: rawUser.following,
    created_at: rawUser.created_at,
    twitter_username: rawUser.twitter_username,
    type: rawUser.type,
    repos: processedRepos,
    organizations: rawOrgs,
    topLanguages,
    totalStars,
    totalForks,
  };

  // Cache in session storage
  try {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: processedUser,
      })
    );
  } catch {
    // Ignore storage quota errors
  }

  return processedUser;
}
