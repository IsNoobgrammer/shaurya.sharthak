import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, FileText, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeRoles } from '../data/socials';
import ResumePreviewModal from './ResumePreviewModal';
import ScrollProgress from './ScrollProgress';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [preview, setPreview] = useState<{ file: string; label: string; downloadName?: string } | null>(null);
  const [cachedResumes, setCachedResumes] = useState<Record<string, string>>({});
  const resumeRef = useRef<HTMLDivElement>(null);

  // Cache resumes on first dropdown/menu open — not on page load for every visitor
  const preloadStarted = useRef(false);
  const preloadResumes = useCallback(async () => {
    if (preloadStarted.current || !('caches' in window)) return;
    preloadStarted.current = true;
    try {
      const cache = await caches.open('resume-cache-v1');
      const newCached: Record<string, string> = {};

      await Promise.all(resumeRoles.map(async (role) => {
        try {
          let response = await cache.match(role.file);
          if (!response) {
            await cache.add(role.file);
            response = await cache.match(role.file);
          }
          if (response) {
            const blob = await response.blob();
            newCached[role.file] = URL.createObjectURL(blob);
          }
        } catch (e) {
          console.warn(`Failed to cache ${role.file}`, e);
        }
      }));

      setCachedResumes(newCached);
    } catch (e) {
      console.warn('Cache API failed', e);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={onLogoClick}
            title="Settings"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
          >
            <span className="navbar-logo-text"><span>Shaurya</span>.Sharthak</span>
            <span className="navbar-logo-gear">⚙</span>
          </button>

          {/* Desktop links */}
          <ul className="navbar-links" id="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Resume dropdown */}
          <div ref={resumeRef} className="resume-dropdown-wrapper" style={{ position: 'relative' }}>
            <button
              id="resume-btn"
              className="btn btn-secondary resume-btn"
              onClick={() => { preloadResumes(); setResumeOpen((p) => !p); }}
              onMouseEnter={preloadResumes}
              aria-haspopup="true"
              aria-expanded={resumeOpen}
            >
              <FileText size={14} />
              Resume
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▾</span>
            </button>

            <AnimatePresence>
              {resumeOpen && (
                <motion.div
                  className="resume-dropdown glass-card"
                  initial={{ opacity: 0, scaleY: 0.8, y: -8 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  exit={{ opacity: 0, scaleY: 0.8, y: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ transformOrigin: 'top center' }}
                >
                  {resumeRoles.map((role) => {
                    const activeFile = cachedResumes[role.file] || role.file;
                    return (
                    <div key={role.label} className="resume-dropdown-item">
                      <span className="resume-dropdown-label">
                        <FileText size={12} style={{ opacity: 0.5 }} />
                        {role.label}
                      </span>
                      <div className="resume-dropdown-actions">
                        <button
                          className="resume-dropdown-action"
                          title="Preview"
                          onClick={() => { setPreview({ file: activeFile, label: role.label, downloadName: role.file.split('/').pop() }); setResumeOpen(false); }}
                        >
                          <Eye size={13} />
                          Preview
                        </button>
                        <a
                          href={activeFile}
                          download={role.file.split('/').pop()}
                          className="resume-dropdown-action resume-dropdown-action--download"
                          title="Download"
                          onClick={() => setResumeOpen(false)}
                        >
                          <Download size={13} />
                        </a>
                      </div>
                    </div>
                  )})}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            id="mobile-menu-btn"
            onClick={() => { preloadResumes(); setMobileOpen((p) => !p); }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.ul
              className="navbar-links open mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
                    {link.label}
                  </a>
                </li>
              ))}
              {resumeRoles.map((role) => {
                const activeFile = cachedResumes[role.file] || role.file;
                return (
                <li key={role.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0', fontSize: '0.9rem' }}
                    onClick={() => { setMobileOpen(false); setPreview({ file: activeFile, label: role.label, downloadName: role.file.split('/').pop() }); }}
                  >
                    <Eye size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {role.label}
                  </button>
                  <a href={activeFile} download={role.file.split('/').pop()} onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)' }}>
                    <Download size={14} />
                  </a>
                </li>
              )})}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Scroll progress — pinned to the header's bottom edge */}
        <ScrollProgress />
      </nav>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        open={!!preview}
        file={preview?.file ?? ''}
        label={preview?.label ?? ''}
        downloadName={preview?.downloadName}
        onClose={() => setPreview(null)}
      />
    </>
  );
}
