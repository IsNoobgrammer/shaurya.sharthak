export type ThemeId = 'velvet-purple' | 'moonwhite' | 'midnight-teal' | 'crimson-noir' | 'obsidian' | 'mocha-mint' | 'solar-amber';
export const THEME_KEY = 'portfolio-theme';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  previewBg: string;
  previewCardBg: string;
  previewAccent: string;
  previewText: string;
  previewMuted: string;
  swatches: [string, string, string];
}

export const themes: Theme[] = [
  {
    id: 'velvet-purple',
    name: 'Velvet Purple',
    description: 'Dark cosmic. The default.',
    previewBg: '#07070C',
    previewCardBg: 'rgba(14,14,22,0.85)',
    previewAccent: '#8B5CF6',
    previewText: '#E2E8F0',
    previewMuted: '#64748B',
    swatches: ['#07070C', '#8B5CF6', '#A78BFA'],
  },
  {
    id: 'moonwhite',
    name: 'Brutalist Moonwhite',
    description: 'Off-white matte. Raw, textured, brutalist.',
    previewBg: '#F0EBE0',
    previewCardBg: 'rgba(220,213,200,0.9)',
    previewAccent: '#1C1C1C',
    previewText: '#0A0A0A',
    previewMuted: '#7A7A7A',
    swatches: ['#F0EBE0', '#1C1C1C', '#8A8A8A'],
  },
  {
    id: 'obsidian',
    name: 'Obsidian Matte',
    description: 'Pure black. White chalk front. Inverse brutalist.',
    previewBg: '#0C0C0C',
    previewCardBg: 'rgba(20,20,20,0.9)',
    previewAccent: '#C8C4BF',
    previewText: '#D8D4CF',
    previewMuted: '#605850',
    swatches: ['#0C0C0C', '#C8C4BF', '#787470'],
  },
  {
    id: 'midnight-teal',
    name: 'Midnight Teal',
    description: 'Deep ocean dark. Teal luminescence.',
    previewBg: '#060E0D',
    previewCardBg: 'rgba(11,26,24,0.85)',
    previewAccent: '#14B8A6',
    previewText: '#E0F2EF',
    previewMuted: '#4A8A84',
    swatches: ['#060E0D', '#14B8A6', '#2DD4BF'],
  },
  {
    id: 'crimson-noir',
    name: 'Crimson Noir',
    description: 'Black as night. Red as intent.',
    previewBg: '#0A0608',
    previewCardBg: 'rgba(18,10,14,0.85)',
    previewAccent: '#E11D48',
    previewText: '#F0E8EB',
    previewMuted: '#6A4555',
    swatches: ['#0A0608', '#E11D48', '#FB7185'],
  },
  {
    id: 'mocha-mint',
    name: 'Mocha Mint',
    description: 'Deep navy. Matcha-green funk.',
    previewBg: '#0A0E1A',
    previewCardBg: 'rgba(14,20,38,0.85)',
    previewAccent: '#86EFAC',
    previewText: '#E2E8F0',
    previewMuted: '#4A6670',
    swatches: ['#0A0E1A', '#86EFAC', '#4ADE80'],
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    description: 'Charcoal warmth. Golden hour glow.',
    previewBg: '#110F0A',
    previewCardBg: 'rgba(22,20,16,0.85)',
    previewAccent: '#F59E0B',
    previewText: '#F5F0E8',
    previewMuted: '#8A7A5A',
    swatches: ['#110F0A', '#F59E0B', '#FBBF24'],
  },
];

export function getInitialTheme(): ThemeId {
  try {
    const s = localStorage.getItem(THEME_KEY) as ThemeId | null;
    if (s && themes.find(t => t.id === s)) return s;
  } catch (_) { /* ignore */ }
  return 'obsidian';
}

export function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
  try { localStorage.setItem(THEME_KEY, id); } catch (_) { /* ignore */ }
}
