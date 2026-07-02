import { Suspense, lazy, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';

const HeroScene = lazy(() => import('./three/HeroScene'));

// Egg button — uses CSS custom properties so it adapts to all themes
function EggButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      id="easter-egg-btn"
      className={`egg-btn${active ? ' active' : ''}`}
      onClick={onToggle}
      aria-label="Toggle Gita mode"
      title={active ? 'Back to normal' : 'Reveal the Gita'}
    >
      <svg viewBox="0 0 32 40" width="22" height="28" fill="none" aria-hidden="true">
        <ellipse
          cx="16" cy="20" rx="13" ry="17"
          fill={active ? 'url(#eggGlow)' : 'var(--glass-bg)'}
          stroke={active ? 'var(--purple-400)' : 'var(--glass-border-hover)'}
          strokeWidth="1.5"
        />
        {active && (
          <ellipse cx="16" cy="20" rx="13" ry="17" fill="url(#eggGlow)" opacity="0.6" />
        )}
        <defs>
          <radialGradient id="eggGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--purple-300)" />
            <stop offset="100%" stopColor="var(--purple-700)" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </svg>
    </button>
  );
}

export default function Hero({ theme = 'velvet-purple' }: { theme?: string }) {
  const [gitaMode, setGitaMode] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Pause the particle simulation once the hero is scrolled well out of view.
  const heroActive = useInView(sectionRef, { margin: '0px 0px -40% 0px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const scrollStyle = reduce ? undefined : { y: parallaxY, opacity: parallaxOpacity, scale: parallaxScale };

  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const toggleGita = useCallback(() => setGitaMode((v) => !v), []);

  // The particle "lines & dots" scene is kept only for light themes; dark themes
  // use the WebGL space scene (rendered as the page background in App).
  const lightTheme = theme === 'moonwhite';

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {lightTheme && (
        <Suspense fallback={null}>
          <HeroScene gitaForeground={gitaMode} theme={theme} active={heroActive} />
        </Suspense>
      )}

      {!lightTheme && <div className="hero-scrim" aria-hidden="true" />}

      <EggButton active={gitaMode} onToggle={toggleGita} />

      <motion.div className="hero-content" style={scrollStyle}>
      <motion.div
        animate={{ opacity: gitaMode ? 0.12 : 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        initial={{ opacity: 0, y: 30 }}
      >
        <motion.p className="hero-greeting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          Veni, Vidi, Vici — I came, I saw, I conquered.
        </motion.p>

        <motion.h1 className="hero-name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}>
          Shaurya Sharthak
        </motion.h1>

        <motion.p className="hero-tagline" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}>
          <strong>AI/ML Researcher</strong> · <strong>Data Nerd</strong> ·{' '}
          <strong>Model Whisperer</strong>
        </motion.p>

        <motion.div className="hero-buttons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <Magnetic>
            <button id="hero-view-projects" className="btn btn-primary" onClick={scrollToProjects}>View Projects</button>
          </Magnetic>
          <Magnetic>
            <button id="hero-get-in-touch" className="btn btn-secondary" onClick={scrollToContact}>Get in Touch</button>
          </Magnetic>
        </motion.div>
      </motion.div>
      </motion.div>

      <AnimatePresence>
        {gitaMode && (
          <motion.div className="gita-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
            <p className="gita-verse-line">Yadā yadā hi dharmasya glānir bhavati bhārata,</p>
            <p className="gita-verse-line">Abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham.</p>
            <p className="gita-verse-line">Paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām,</p>
            <p className="gita-verse-line">Dharma-saṁsthāpanārthāya sambhavāmi yuge yuge.</p>
            <p className="gita-translation">
              "Whenever righteousness declines and unrighteousness rises,<br />
              I manifest Myself — for the protection of the good,<br />
              the destruction of the wicked, and the restoration of dharma,<br />
              I am born from age to age."
            </p>
            <p className="gita-source">— Bhagavad Gita, Chapter 4, Verses 7–8</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: gitaMode ? 0 : 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}
