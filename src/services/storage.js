const FAVORITES_KEY = 'github_pulse_favorites_v1';
const RECENT_KEY = 'github_pulse_recent_v1';

export const DEFAULT_FAVORITES = ['addyosmani', 'sindresorhus', 'gaearon', 'tj', 'octocat'];

export const DEFAULT_RECENT = [
  {
    username: 'octocat',
    name: 'The Octocat',
    locationTag: 'San Francisco, CA',
    timeAgo: '2 hours ago',
    timestamp: Date.now() - 7200000,
    avatar: 'https://avatars.githubusercontent.com/u/583231?v=4',
    starred: true,
  },
  {
    username: 'torvalds',
    name: 'Linus Torvalds',
    locationTag: 'Linux Foundation',
    timeAgo: '5 hours ago',
    timestamp: Date.now() - 18000000,
    avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    starred: false,
  },
  {
    username: 'gaearon',
    name: 'Dan Abramov',
    locationTag: 'London, UK',
    timeAgo: 'Yesterday',
    timestamp: Date.now() - 86400000,
    avatar: 'https://avatars.githubusercontent.com/u/810438?v=4',
    starred: true,
  },
  {
    username: 'sindresorhus',
    name: 'Sindre Sorhus',
    locationTag: 'Everywhere',
    timeAgo: '2 days ago',
    timestamp: Date.now() - 172800000,
    avatar: 'https://avatars.githubusercontent.com/u/170270?v=4',
    starred: true,
  },
];

export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return DEFAULT_FAVORITES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FAVORITES;
  }
}

export function saveStoredFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

export function getStoredRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return DEFAULT_RECENT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_RECENT;
  }
}

export function saveStoredRecent(items) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save recent searches to localStorage', e);
  }
}
