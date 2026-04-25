import { useState, useEffect } from 'react';
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
import { getInitialTheme, applyTheme, type ThemeId } from './data/themes';
import './styles/globals.css';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(() => getInitialTheme());

  // Apply theme on mount
  useEffect(() => { applyTheme(theme); }, []);

  const handleThemeChange = (id: ThemeId) => {
    setTheme(id);
    applyTheme(id);
  };

  return (
    <>
      <Navbar onLogoClick={() => setSettingsOpen(true)} />
      <main>
        <Hero />
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
