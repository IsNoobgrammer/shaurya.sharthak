import { useState, useEffect, useRef } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeRoles } from '../data/socials';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close resume dropdown on outside click
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
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#hero" className="navbar-logo" onClick={() => handleNavClick('#hero')}>
          <span>S</span>.S
        </a>

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
            onClick={() => setResumeOpen((p) => !p)}
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
                {resumeRoles.map((role) => (
                  <a
                    key={role.label}
                    href={role.file}
                    download
                    className="resume-dropdown-item"
                    onClick={() => setResumeOpen(false)}
                  >
                    {role.label}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-toggle"
          id="mobile-menu-btn"
          onClick={() => setMobileOpen((p) => !p)}
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
            <li>
              <a href="/resumes/resume_ai_ml_engineer.pdf" download>
                <FileText size={14} style={{ marginRight: 6 }} />
                Download Resume
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
