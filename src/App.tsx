import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Publication from './components/Publication';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SettingsPanel from './components/SettingsPanel';
import CustomCursor from './components/CustomCursor';
import InteractiveFX from './components/InteractiveFX';
import { getInitialTheme, applyTheme, type ThemeId } from './data/themes';
import './styles/globals.css';

const ShaderBackground = lazy(() => import('./components/three/ShaderBackground'));
const SpaceScene = lazy(() => import('./components/three/SpaceScene'));

// Light themes get the adaptive wash; dark themes get the full space scene.
const LIGHT_THEMES: ThemeId[] = ['moonwhite'];

// Run the GPU background everywhere (mobile included) — the scene is already
// budgeted for it: 30fps cap, dpr 1, demand frameloop, paused off-screen.
// Only reduced-motion opts out.
function shouldRenderShader() {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// If the WebGL scene throws at runtime, fall back to the lightweight shader wash.
class BgErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(() => getInitialTheme());
  const [shader] = useState(shouldRenderShader);

  // Apply theme on mount
  useEffect(() => { applyTheme(theme); }, []);

  const handleThemeChange = (id: ThemeId) => {
    setTheme(id);
    applyTheme(id);
  };

  return (
    <>
      {shader && (
        <Suspense fallback={null}>
          {LIGHT_THEMES.includes(theme) ? (
            <ShaderBackground />
          ) : (
            <BgErrorBoundary fallback={<ShaderBackground />}>
              <SpaceScene />
            </BgErrorBoundary>
          )}
        </Suspense>
      )}
      <CustomCursor />
      <InteractiveFX />
      <Navbar onLogoClick={() => setSettingsOpen(true)} />
      <main>
        <Hero theme={theme} />
        <About />
        <Publication />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
    </>
  );
}
