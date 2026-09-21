/**
 * Domain Models and Types for GitHub Pulse (JavaScript JSDoc)
 *
 * @typedef {'home' | 'profile' | 'favorites' | 'recent' | 'loading' | 'not-found'} ViewTab
 *
 * @typedef {Object} Repository
 * @property {number} id
 * @property {string} name
 * @property {string} fullName
 * @property {string|null} description
 * @property {string} html_url
 * @property {string|null} language
 * @property {string} [languageColor]
 * @property {number} stargazers_count
 * @property {number} forks_count
 * @property {string} updated_at
 * @property {string|null} [homepage]
 * @property {string[]} topics
 * @property {string|null} [licenseName]
 * @property {boolean} isFork
 *
 * @typedef {Object} LanguageShare
 * @property {string} name
 * @property {number} count
 * @property {number} percentage
 * @property {string} color
 *
 * @typedef {Object} ProcessedGitHubUser
 * @property {string} login
 * @property {number} id
 * @property {string|null} name
 * @property {string} avatar_url
 * @property {string} html_url
 * @property {string|null} bio
 * @property {string|null} company
 * @property {string|null} blog
 * @property {string|null} location
 * @property {number} public_repos
 * @property {number} public_gists
 * @property {number} followers
 * @property {number} following
 * @property {string} created_at
 * @property {string|null} twitter_username
 * @property {'User' | 'Organization'} type
 * @property {Repository[]} repos
 * @property {Object[]} organizations
 * @property {LanguageShare[]} topLanguages
 * @property {number} totalStars
 * @property {number} totalForks
 *
 * @typedef {Object} RecentSearchItem
 * @property {string} username
 * @property {string} [name]
 * @property {string} locationTag
 * @property {string} timeAgo
 * @property {number} timestamp
 * @property {string} avatar
 * @property {boolean} starred
 */

export const VIEW_TABS = ['home', 'profile', 'favorites', 'recent', 'loading', 'not-found'];
