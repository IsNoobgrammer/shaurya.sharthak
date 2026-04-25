// Type-only file. Actual blog data fetched live from GitHub Contents API.
// Repo: https://github.com/IsNoobgrammer/Vlogs-In-Portfolio
// Each top-level folder in that repo = one blog post.
// Folder needs a README.md with YAML frontmatter.

export interface BlogPost {
  slug: string;         // folder name in the repo
  title: string;        // from frontmatter
  date: string;         // from frontmatter (YYYY-MM-DD)
  tags: string[];       // from frontmatter
  excerpt: string;      // from frontmatter or first 150 chars
  url: string;          // link to GitHub folder
}

export const BLOG_REPO = 'IsNoobgrammer/Vlogs-In-Portfolio';
export const BLOG_REPO_URL = `https://github.com/${BLOG_REPO}`;
export const BLOG_API_URL = `https://api.github.com/repos/${BLOG_REPO}/contents/`;
export const BLOG_CACHE_KEY = 'ss_blog_cache_v4';

export const BLOG_CACHE_TTL = 60 * 60 * 1000; // 1 hour
