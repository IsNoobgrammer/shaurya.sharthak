import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Palette, Clock3 } from 'lucide-react';
import { themes, type ThemeId, applyTheme } from '../data/themes';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLocalOffset(): string {
  const m = -new Date().getTimezoneOffset();
  const sign = m >= 0 ? '+' : '-';
  const h = String(Math.floor(Math.abs(m) / 60)).padStart(2, '0');
  const min = String(Math.abs(m) % 60).padStart(2, '0');
  return `${sign}${h}:${min}`;
}

function getLocalTZName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ') ?? 'Local';
  } catch { return 'Local'; }
}

function fmtTime(d: Date, tz?: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d);
}

function fmtDate(d: Date, tz?: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

function buildISO(d: Date, tz?: string, offset = '') {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  return `${date}T${fmtTime(d, tz)}${offset}`;
}

// ── Clock Widget ──────────────────────────────────────────────────────────────
function ClockWidget({ label, tz, offset }: { label: string; tz?: string; offset: string }) {
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(buildISO(now, tz, offset)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [now, tz, offset]);

  return (
    <button className="settings-clock" onClick={handleCopy} title="Click to copy datetime">
      <div className="settings-clock-label">
        <Clock3 size={12} />
        {label}
        <span className="settings-clock-offset">{offset}</span>
      </div>
      <div className="settings-clock-time">{fmtTime(now, tz)}</div>
      <div className="settings-clock-date">{fmtDate(now, tz)}</div>
      <div className={`settings-clock-copy${copied ? ' copied' : ''}`}>
        {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy datetime</>}
      </div>
    </button>
  );
}

// ── Palette Preview Card ──────────────────────────────────────────────────────
function ThemeCard({ theme, active, onSelect }: { theme: typeof themes[0]; active: boolean; onSelect: () => void }) {
  return (
    <button
      className={`settings-theme-card${active ? ' active' : ''}`}
      onClick={onSelect}
      style={{ '--preview-bg': theme.previewBg, '--preview-card': theme.previewCardBg, '--preview-accent': theme.previewAccent, '--preview-text': theme.previewText, '--preview-muted': theme.previewMuted } as React.CSSProperties}
    >
      {/* Mini preview */}
      <div className="settings-theme-preview" style={{ background: theme.previewBg }}>
        {/* Fake navbar */}
        <div style={{ height: 8, borderBottom: `1px solid ${theme.previewAccent}22`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 3 }}>
          <span style={{ width: 20, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${theme.previewAccent}, ${theme.swatches[2]})` }} />
          {[1,2,3].map(i => <span key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: theme.previewMuted + '55' }} />)}
        </div>
        {/* Fake glass cards */}
        <div style={{ padding: '4px 6px', display: 'flex', gap: 4 }}>
          {[1,2].map(i => (
            <div key={i} style={{ flex: 1, background: theme.previewCardBg, border: `1px solid ${theme.previewAccent}22`, borderRadius: 4, padding: '4px 5px' }}>
              <div style={{ height: 3, width: '60%', background: theme.previewText, borderRadius: 2, marginBottom: 3 }} />
              <div style={{ height: 2, width: '85%', background: theme.previewMuted + '88', borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 2, width: '70%', background: theme.previewMuted + '55', borderRadius: 1 }} />
            </div>
          ))}
        </div>
        {/* Fake accent button */}
        <div style={{ padding: '0 6px' }}>
          <div style={{ height: 7, width: 40, borderRadius: 4, background: `linear-gradient(135deg, ${theme.previewAccent}, ${theme.swatches[2]})` }} />
        </div>
        {/* Swatches */}
        <div style={{ padding: '4px 6px', display: 'flex', gap: 3, marginTop: 2 }}>
          {theme.swatches.map(s => <span key={s} style={{ width: 10, height: 10, borderRadius: '50%', background: s, border: `1px solid ${theme.previewText}22` }} />)}
        </div>
      </div>

      {/* Name + description */}
      <div className="settings-theme-info">
        <span className="settings-theme-name">{theme.name}</span>
        <span className="settings-theme-desc">{theme.description}</span>
      </div>

      {active && <div className="settings-theme-active-dot"><Check size={11} /></div>}
    </button>
  );
}

// ── Main Settings Panel ───────────────────────────────────────────────────────
interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  theme: ThemeId;
  onThemeChange: (id: ThemeId) => void;
}

export default function SettingsPanel({ open, onClose, theme, onThemeChange }: SettingsPanelProps) {
  const localOffset = getLocalOffset();
  const localTZ = getLocalTZName();
  const isLocalIST = localOffset === '+05:30';

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="settings-panel glass-card"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Header */}
            <div className="settings-header">
              <div className="settings-header-left">
                <Palette size={15} style={{ color: 'var(--text-accent)' }} />
                <span className="settings-title">Settings</span>
                <span className="settings-subtitle">hidden, but not really</span>
              </div>
              <button className="blog-reader-close" onClick={onClose}><X size={17} /></button>
            </div>

            {/* Clocks */}
            <div className="settings-section">
              <div className="settings-section-label">Time</div>
              <div className="settings-clocks-row">
                <ClockWidget label="IST" tz="Asia/Kolkata" offset="+05:30" />
                {isLocalIST
                  ? <ClockWidget label={localTZ} offset={localOffset} />
                  : <ClockWidget label={localTZ} offset={localOffset} />
                }
              </div>
            </div>

            {/* Palettes */}
            <div className="settings-section">
              <div className="settings-section-label">Color Palette</div>
              <div className="settings-themes-grid">
                {themes.map(t => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    active={theme === t.id}
                    onSelect={() => { onThemeChange(t.id); applyTheme(t.id); }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
