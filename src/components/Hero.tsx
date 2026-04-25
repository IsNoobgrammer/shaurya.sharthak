import { Suspense, lazy, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const HeroScene = lazy(() => import('./three/HeroScene'));

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

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

  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact  = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const toggleGita = useCallback(() => setGitaMode((v) => !v), []);

  return (
    <section id="hero" className="hero">
      {!isMobile() && (
        <Suspense fallback={null}>
          <HeroScene gitaForeground={gitaMode} theme={theme} />
        </Suspense>
      )}

      <EggButton active={gitaMode} onToggle={toggleGita} />

      <motion.div
        className="hero-content"
        animate={{ opacity: gitaMode ? 0.12 : 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        initial={{ opacity: 0, y: 30 }}
      >
        <motion.p className="hero-greeting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Veni, Vidi, Vici — I came, I saw, I conquered.
        </motion.p>

        <motion.h1 className="hero-name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          Shaurya Sharthak
        </motion.h1>

        <motion.p className="hero-tagline" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}>
          <strong>AI/ML Researcher</strong> · <strong>Data Nerd</strong> ·{' '}
          <strong>Model Whisperer</strong>
        </motion.p>

        <motion.div className="hero-buttons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <button id="hero-view-projects" className="btn btn-primary" onClick={scrollToProjects}>View Projects</button>
          <button id="hero-get-in-touch" className="btn btn-secondary" onClick={scrollToContact}>Get in Touch</button>
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

      <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: gitaMode ? 0 : 1 }} transition={{ delay: 1.4, duration: 0.6 }}>
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}
