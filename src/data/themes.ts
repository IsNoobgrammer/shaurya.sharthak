export type ThemeId = 'velvet-purple' | 'moonwhite' | 'midnight-teal' | 'crimson-noir' | 'obsidian' | 'mocha-mint' | 'solar-amber' | 'autumn-rust' | 'terracotta-parchment' | 'antique-marble' | 'slate-matte' | 'silicon-copper';
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
  {
    id: 'autumn-rust',
    name: 'Autumn Rust',
    description: 'Deep earthy reds and matte browns.',
    previewBg: '#1A110D',
    previewCardBg: 'rgba(30, 20, 15, 0.85)',
    previewAccent: '#D95C3C',
    previewText: '#E6D3C5',
    previewMuted: '#8C6C5A',
    swatches: ['#1A110D', '#D95C3C', '#F27D59'],
  },
  {
    id: 'terracotta-parchment',
    name: 'Terracotta Parchment',
    description: 'Matte terracotta on rough off-white paper.',
    previewBg: '#F5EFE6',
    previewCardBg: 'rgba(235, 226, 212, 0.9)',
    previewAccent: '#C05640',
    previewText: '#2D2422',
    previewMuted: '#8A7B76',
    swatches: ['#F5EFE6', '#C05640', '#D97757'],
  },
  {
    id: 'antique-marble',
    name: 'Antique Marble',
    description: 'Cold marble and antique brass. Classical brutalism.',
    previewBg: '#E8E9EB',
    previewCardBg: 'rgba(220, 222, 225, 0.85)',
    previewAccent: '#9E8050',
    previewText: '#1A1C20',
    previewMuted: '#7A7E85',
    swatches: ['#E8E9EB', '#9E8050', '#BFA67A'],
  },
  {
    id: 'slate-matte',
    name: 'Slate Matte',
    description: 'Understated matte slate gray.',
    previewBg: '#1C1D21',
    previewCardBg: 'rgba(35, 37, 43, 0.85)',
    previewAccent: '#6C7A89',
    previewText: '#D1D5DB',
    previewMuted: '#4B5563',
    swatches: ['#1C1D21', '#6C7A89', '#9CA3AF'],
  },
  {
    id: 'silicon-copper',
    name: 'Silicon Copper',
    description: 'PCB green and copper traces. Scrappy hardware feel.',
    previewBg: '#09100D',
    previewCardBg: 'rgba(15, 28, 23, 0.85)',
    previewAccent: '#B87333',
    previewText: '#CFD9D5',
    previewMuted: '#47665B',
    swatches: ['#09100D', '#B87333', '#CD853F'],
  }
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
