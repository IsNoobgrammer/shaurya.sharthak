import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Code2, ExternalLink, Star, GitFork, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, type ProjectCategory } from '../data/projects';

type Filter = 'All' | ProjectCategory;
const filters: Filter[] = ['All', 'Research', 'Infrastructure', 'Tokenizers', 'Datasets', 'Tools', 'Security'];


const CARDS_PER_VIEW = 3;
const AUTO_SLIDE_MS = 3200;

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered =
    activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter);

  const maxIndex = Math.max(0, filtered.length - CARDS_PER_VIEW);

  // Reset index when filter changes
  useEffect(() => { setIndex(0); }, [activeFilter]);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // Auto-slide
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTO_SLIDE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, maxIndex, activeFilter]);

  const visibleCards = filtered.slice(index, index + CARDS_PER_VIEW);
  // Pad to CARDS_PER_VIEW to prevent layout shift
  const padded = [...visibleCards, ...Array(Math.max(0, CARDS_PER_VIEW - visibleCards.length)).fill(null)];

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Projects & Datasets</h2>
          <p className="section-subtitle">What I've built — {filtered.length} items.</p>
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

        {/* Carousel wrapper */}
        <div
          className="carousel-wrapper"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev arrow */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous projects"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards */}
          <div className="carousel-track">
            <AnimatePresence mode="popLayout">
              {padded.map((project, i) =>
                project ? (
                  <motion.div
                    key={`${project.id}-${index}`}
                    className="glass-card project-card"
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="project-header">
                      <span className="project-title">{project.title}</span>
                      <span className="project-icon">
                        {project.platform === 'github' ? (
                          <Code2 size={18} />
                        ) : (
                          <span style={{ fontSize: '1.1rem' }}>🤗</span>
                        )}
                      </span>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="project-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="project-footer">
                      {project.stars !== undefined && (
                        <span className="project-stat">
                          <Star size={12} style={{ color: '#F59E0B' }} />
                          {project.stars}
                        </span>
                      )}
                      {project.forks !== undefined && (
                        <span className="project-stat">
                          <GitFork size={12} />
                          {project.forks}
                        </span>
                      )}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        id={`project-link-${project.id}`}
                      >
                        View <ExternalLink size={12} />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <div key={`pad-${i}`} className="project-card-placeholder" />
                )
              )}
            </AnimatePresence>
          </div>

          {/* Next arrow */}
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={next}
            disabled={index >= maxIndex}
            aria-label="Next projects"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <p className="carousel-hint">Hover to pause · Click arrows to navigate</p>
      </div>
    </section>
  );
}
