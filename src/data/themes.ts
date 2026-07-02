export type ThemeId = 'obsidian' | 'velvet-purple' | 'midnight-teal' | 'moonwhite';
export const THEME_KEY = 'portfolio-theme';
export const LUCKY_THEME_KEY = 'portfolio-lucky-theme';

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
    id: 'obsidian',
    name: 'Obsidian Matte',
    description: 'Pure black. White chalk front. The default.',
    previewBg: '#0C0C0C',
    previewCardBg: 'rgba(20,20,20,0.9)',
    previewAccent: '#C8C4BF',
    previewText: '#D8D4CF',
    previewMuted: '#605850',
    swatches: ['#0C0C0C', '#C8C4BF', '#787470'],
  },
  {
    id: 'velvet-purple',
    name: 'Velvet Purple',
    description: 'Dark cosmic.',
    previewBg: '#07070C',
    previewCardBg: 'rgba(14,14,22,0.85)',
    previewAccent: '#8B5CF6',
    previewText: '#E2E8F0',
    previewMuted: '#64748B',
    swatches: ['#07070C', '#8B5CF6', '#A78BFA'],
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
];

export function getInitialTheme(): ThemeId {
  try {
    const isLucky = localStorage.getItem(LUCKY_THEME_KEY) === 'true';
    if (isLucky) {
      const randomIndex = Math.floor(Math.random() * themes.length);
      return themes[randomIndex].id;
    }
    const s = localStorage.getItem(THEME_KEY) as ThemeId | null;
    if (s && themes.find(t => t.id === s)) return s;
  } catch (_) { /* ignore */ }
  return 'obsidian';
}

export function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
  try { localStorage.setItem(THEME_KEY, id); } catch (_) { /* ignore */ }
}
