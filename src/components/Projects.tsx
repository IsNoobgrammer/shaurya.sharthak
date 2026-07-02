import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Code2, ExternalLink, Star, GitFork,
  ChevronLeft, ChevronRight, ArrowLeft, X, Tag, Info, Layers
} from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '../data/projects';

type Filter = 'All' | ProjectCategory;
const filters: Filter[] = ['All', 'Research', 'Infrastructure', 'Tokenizers', 'Datasets', 'Tools', 'Security'];

// 4×2 grid per slide — fixed vertical footprint, page horizontally for the rest.
const PAGE_SIZE = 8;

// ── Project Reader Panel ──────────────────────────────────────────────────────
function ProjectReader({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isGitHub = project.platform === 'github';
  const platformLabel = isGitHub ? 'GitHub' : 'HuggingFace';
  const PlatformIcon = () => isGitHub
    ? <Code2 size={14} />
    : <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>🤗</span>;

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
        {/* ── Top bar ── */}
        <div className="blog-reader-header">
          <button className="blog-reader-back" onClick={onClose} aria-label="Close">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-reader-github"
          >
            <PlatformIcon />
            {platformLabel}
            <ExternalLink size={12} style={{ marginLeft: 2 }} />
          </a>
          <button className="blog-reader-close" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>

        {/* ── Hero zone ── */}
        <div className="project-reader-hero">
          {/* Badges row */}
          <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="project-category-badge">{project.category}</span>
            {project.featured && (
              <span className="project-category-badge" style={{
                color: '#F59E0B',
                borderColor: 'rgba(245,158,11,0.2)',
                background: 'rgba(245,158,11,0.07)'
              }}>
                ⭐ Featured
              </span>
            )}
            <span className="project-category-badge" style={{ marginLeft: 'auto', opacity: 0.65 }}>
              <PlatformIcon /> {platformLabel}
            </span>
          </div>

          <h1 className="blog-reader-title" style={{ marginBottom: '0.5rem' }}>{project.title}</h1>

          {/* Stats chips */}
          {(project.stars !== undefined || project.forks !== undefined) && (
            <div className="project-reader-stats">
              {project.stars !== undefined && (
                <span className="project-reader-stat-chip">
                  <Star size={11} style={{ color: '#F59E0B' }} /> {project.stars} stars
                </span>
              )}
              {project.forks !== undefined && (
                <span className="project-reader-stat-chip">
                  <GitFork size={11} /> {project.forks} forks
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Scrollable content ── */}
        <div className="blog-reader-content">

          {/* About */}
          <div className="project-reader-section">
            <div className="project-reader-section-label">
              <Info size={11} /> About
            </div>
            <p className="project-reader-description">{project.description}</p>
          </div>

          {/* Deep dive (details) */}
          {project.details && (
            <div className="project-reader-section">
              <div className="project-reader-section-label">
                <Layers size={11} /> Deep Dive
              </div>
              <p className="project-reader-description">{project.details}</p>
            </div>
          )}

          {/* Tech stack */}
          <div className="project-reader-section">
            <div className="project-reader-section-label">
              <Tag size={11} /> Tech Stack
            </div>
            <div className="project-reader-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-reader-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="project-reader-cta">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <PlatformIcon />
              View on {platformLabel}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Projects Component ───────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [page, setPage] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const filtered = (activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter))
    // featured work first, then keep data order
    .slice()
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => { setPage(0); }, [activeFilter]);

  const closeReader = useCallback(() => setActiveProject(null), []);

  return (
    <>
      <section id="projects" className="section" ref={ref}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="section-title">Projects & Datasets</h2>
            <p className="section-subtitle">
              What I've built — {filtered.length}+ items. Click any card to explore.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="project-filters"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                className={`filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* Paged grid carousel */}
          <div className="projects-carousel">
            <button
              className="carousel-arrow"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous projects"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="projects-viewport">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeFilter}-${page}`}
                  className="projects-grid"
                  initial={{ opacity: 0, x: 60 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
              {visible.map((project) => (
                <div
                  key={project.id}
                  className="glass-card project-card"
                  data-spotlight
                  onClick={() => setActiveProject(project)}
                  id={`project-card-${project.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(project); } }}
                >
                  <span className="project-category-badge">{project.category}</span>

                  <div className="project-header">
                    <span className="project-title">{project.title}</span>
                    <span className="project-icon">
                      {project.platform === 'github'
                        ? <Code2 size={17} />
                        : <span style={{ fontSize: '1.05rem' }}>🤗</span>}
                    </span>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-tags">
                    {project.tags.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="project-tag">+{project.tags.length - 4}</span>
                    )}
                  </div>

                  <div className="project-footer">
                    {project.stars !== undefined && (
                      <span className="project-stat">
                        <Star size={11} style={{ color: '#F59E0B' }} />
                        {project.stars}
                      </span>
                    )}
                    {project.forks !== undefined && (
                      <span className="project-stat">
                        <GitFork size={11} />
                        {project.forks}
                      </span>
                    )}
                    <span className="project-link">
                      Expand <ExternalLink size={11} />
                    </span>
                  </div>
                </div>
              ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="carousel-arrow"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              aria-label="Next projects"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Page dots */}
          {pageCount > 1 && (
            <div className="carousel-dots">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot${i === page ? ' active' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeProject && <ProjectReader project={activeProject} onClose={closeReader} />}
      </AnimatePresence>
    </>
  );
}
