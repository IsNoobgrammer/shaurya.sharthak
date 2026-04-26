import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, ArrowLeft, X, BookOpen } from 'lucide-react';
import { BLOG_REPO_URL, BLOG_CACHE_KEY, BLOG_CACHE_TTL } from '../data/blog';

// ── Types ────────────────────────────────────────────────────────────────────
interface BlogPost {
  slug: string;       // folder name
  title: string;      // prettified from folder name
  date: string;
  excerpt: string;
  rawContent: string; // full markdown for inline reader
  url: string;        // github link (fallback)
}

// ── GitHub API ────────────────────────────────────────────────────────────────
const BLOG_API   = 'https://api.github.com/repos/IsNoobgrammer/Vlogs-In-Portfolio/contents/';
const RAW_BASE   = 'https://raw.githubusercontent.com/IsNoobgrammer/Vlogs-In-Portfolio/main/';

function prettifySlug(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function fetchPosts(): Promise<BlogPost[]> {
  // Cache
  try {
    const cached = localStorage.getItem(BLOG_CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < BLOG_CACHE_TTL) return data;
    }
  } catch (_) { /* ignore */ }

  const res = await fetch(BLOG_API);
  if (!res.ok) throw new Error('GitHub API error');
  const items: Array<{ name: string; type: string }> = await res.json();

  // ONLY folders (not flat .md files, not README, not images)
  const dirs = items.filter((i) => i.type === 'dir');

  const posts = await Promise.all(
    dirs.map(async (dir): Promise<BlogPost> => {
      const slug  = dir.name;
      const title = prettifySlug(dir.name);
      const url   = `${BLOG_REPO_URL}/tree/main/${dir.name}`;
      try {
        const rawRes = await fetch(`${RAW_BASE}${dir.name}/README.md`);
        if (!rawRes.ok) throw new Error('no readme');
        const raw = await rawRes.text();
        // Excerpt: first real paragraph
        const lines   = raw.split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
        const excerpt = lines[0]?.slice(0, 220) ?? '';
        // Date from YYYY-MM-DD pattern inside content
        const dateMatch = raw.match(/\b(\d{4}-\d{2}-\d{2})\b/);
        const date = dateMatch ? dateMatch[1] : '';
        return { slug, title, date, excerpt, rawContent: raw, url };
      } catch {
        return { slug, title, date: '', excerpt: '(No README found in this folder.)', rawContent: '', url };
      }
    })
  );

  const sorted = posts.sort((a, b) => {
    if (!a.date && !b.date) return a.title.localeCompare(b.title);
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date > a.date ? 1 : -1;
  });

  try {
    localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: sorted }));
  } catch (_) { /* ignore */ }

  return sorted;
}

// ── Simple Markdown → HTML renderer (no deps) ────────────────────────────────
function renderMarkdown(md: string): string {
  const codeBlocks: string[] = [];
  
  // 1. Extract code blocks so they aren't messed up by other replacements
  let parsed = md.replace(/```(\w*)\r?\n([\s\S]+?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  parsed = parsed
    // headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // unordered list items
    .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // horizontal rule
    .replace(/^---$/gm, '<hr />')
    // paragraphs (double newline)
    .replace(/\r?\n\r?\n+/g, '</p><p>')
    // wrap loose li in ul
    .replace(/(<li>.*<\/li>)+/g, (m) => `<ul>${m}</ul>`);

  // 2. Restore code blocks
  parsed = parsed.replace(/___CODE_BLOCK_(\d+)___/g, (_, i) => codeBlocks[parseInt(i, 10)]);

  return parsed;
}

// ── Inline Blog Reader Panel ─────────────────────────────────────────────────
function BlogReader({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when reader open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const html = post.rawContent ? renderMarkdown(post.rawContent) : '<p>No content available.</p>';

  return (
    <motion.div
      className="blog-reader-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="blog-reader-panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* Header */}
        <div className="blog-reader-header">
          <button className="blog-reader-back" onClick={onClose} aria-label="Close reader">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-reader-github"
            aria-label="View on GitHub"
          >
            <ExternalLink size={15} />
            GitHub
          </a>
          <button className="blog-reader-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="blog-reader-content">
          <h1 className="blog-reader-title">{post.title}</h1>
          {post.date && (
            <div className="blog-reader-meta">
              <Calendar size={13} />
              {post.date}
            </div>
          )}
          <hr className="blog-reader-divider" />
          <div
            className="blog-reader-body"
            dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────
function BlogSkeleton() {
  return (
    <div className="blog-skeleton-list">
      {[1, 2, 3].map((n) => (
        <div key={n} className="blog-skeleton glass-card" />
      ))}
    </div>
  );
}

// ── Main Blog Component ──────────────────────────────────────────────────────
export default function Blog() {
  const [posts, setPosts]       = useState<BlogPost[] | null>(null);
  const [error, setError]       = useState(false);
  const [active, setActive]     = useState<BlogPost | null>(null);
  const ref                     = useRef(null);
  const inView                  = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setError(true));
  }, []);

  const closeReader = useCallback(() => setActive(null), []);

  return (
    <>
      <section id="blog" className="section" ref={ref}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Blog / Writing</h2>
            <p className="section-subtitle">
              Uncensored thoughts, research notes, and experiments.
            </p>
          </motion.div>

          {/* Loading */}
          {!posts && !error && <BlogSkeleton />}

          {/* Error */}
          {error && (
            <div className="blog-error glass-card">
              <p>Couldn't load posts right now.</p>
              <a href={BLOG_REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                View on GitHub <ExternalLink size={13} />
              </a>
            </div>
          )}

          {/* Empty */}
          {posts && posts.length === 0 && (
            <p className="blog-empty">No posts found. Folders with README.md will appear here.</p>
          )}

          {/* Post list */}
          {posts && posts.length > 0 && (
            <div className="blog-list">
              {posts.map((post, i) => {
                const wordCount = post.rawContent?.split(/\s+/).length ?? 0;
                const readMins = wordCount > 0 ? Math.max(1, Math.round(wordCount / 200)) : null;
                return (
                  <motion.button
                    key={post.slug}
                    className="glass-card blog-card"
                    onClick={() => setActive(post)}
                    id={`blog-card-${post.slug}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
                  >
                    {/* Faded index number */}
                    <span className="blog-card-index">{String(i + 1).padStart(2, '0')}</span>
                    <div className="blog-card-inner">
                      <div className="blog-card-header">
                        <h3 className="blog-card-title">{post.title}</h3>
                        <div className="blog-meta-row">
                          {post.date && (
                            <span className="blog-date">
                              <Calendar size={12} />
                              {post.date}
                            </span>
                          )}
                          {readMins && (
                            <span className="blog-reading-time">⏱ {readMins} min read</span>
                          )}
                        </div>
                      </div>
                      {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
                      <span className="blog-read-more">
                        <BookOpen size={13} />
                        Read here
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          <motion.div
            className="blog-footer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <a
              href={BLOG_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              id="blog-view-all"
            >
              All posts on GitHub <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Inline reader — portalled via AnimatePresence */}
      <AnimatePresence>
        {active && <BlogReader post={active} onClose={closeReader} />}
      </AnimatePresence>
    </>
  );
}
