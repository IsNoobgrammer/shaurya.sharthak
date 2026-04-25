# 1. Stack Plan — Portfolio Website

## Current State
Vite + React 19 + TypeScript boilerplate already exists in `Portfolio/`. Tailwind v4 was installed (now removed during accidental coding — will reinstall or go vanilla CSS, your call).

---

## Recommended Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Bundler** | Vite 8 | Already configured, fastest bundler, HMR |
| **Framework** | React 19 + TypeScript | Component-based, type-safe, industry standard |
| **Styling** | Vanilla CSS (CSS Custom Properties) | Glassmorphism needs fine `backdrop-filter` control, custom gradients, matt finishes. Tailwind adds overhead for <10 components. CSS variables = full design token system |
| **Animations** | Framer Motion | Scroll reveals, page transitions, hover micro-animations. ~30KB gzipped. React-native integration |
| **3D / Visual** | Three.js + React Three Fiber (`@react-three/fiber` + `@react-three/drei`) | Hero section particle mesh / floating geometry. Pure client-side — bundles into static JS. **100% free-deploy compatible** (Vercel/Netlify/GH Pages all serve static files) |
| **Icons** | Lucide React | Clean, minimal SVG icon set. Tree-shakeable — only imports what you use |
| **Fonts** | Google Fonts: **Inter** (body) + **JetBrains Mono** (code/stats) | Inter = clean minimalist. JetBrains = technical feel. Both free, widely cached |

### NPM Dependencies (Final)

```
# Production
react, react-dom
framer-motion
@react-three/fiber
@react-three/drei
three
lucide-react
gray-matter          ← frontmatter parser for blog README.md files

# Dev
vite
@vitejs/plugin-react
typescript
eslint + plugins
@types/three
```

> [!NOTE]
> **Blog data is NOT hardcoded.** `Blog.tsx` calls the **GitHub Contents API** at runtime to fetch folders from `IsNoobgrammer/UncensoredAI-Blogs`. Each folder = one blog post. `gray-matter` parses the YAML frontmatter in each folder's `README.md`. `blog.ts` in `src/data/` defines the TypeScript type only — no static post list.

> [!NOTE]
> No react-router needed — single scrollable page, not multi-route SPA. Smooth scroll via CSS `scroll-behavior: smooth` + anchor links.

---

## Why NOT These Alternatives

| Rejected | Why |
|----------|-----|
| **Tailwind CSS** | Your aesthetic (glassmorphism, velvet purple gradients, matt black) needs pixel-level CSS control. Tailwind utility classes fight this. Vanilla CSS with custom properties = cleaner for <10 components |
| **Next.js** | SSR/SSG overkill for a static portfolio. Vite builds faster, simpler deployment, no server needed |
| **GSAP** | Great but Framer Motion integrates natively with React. GSAP needs manual React lifecycle management |
| **Astro** | Good for content sites but you're already set up with React + Vite. Migration cost > benefit |
| **Vue/Svelte** | No reason to switch — React ecosystem already configured |

---

## Three.js Scope (Keep It Light)

| What | Details |
|------|---------|
| **Hero background** | Subtle floating particle mesh or low-poly geometry — velvet purple tones, slowly rotating |
| **Performance** | Use `drei` helpers (`Float`, `Stars`, `MeshDistortMaterial`). Keep geometry count low (<1000 vertices) |
| **Fallback** | CSS gradient fallback for low-end devices. Use `Suspense` + lazy loading |
| **Bundle impact** | Three.js core ~150KB gzipped. R3F + Drei add ~50KB. Total: ~200KB — acceptable for portfolio |
| **Mobile** | Reduce particle count on mobile via `window.innerWidth` check. Or disable 3D entirely below 768px |

---

## Color Palette

```css
/* Backgrounds */
--bg-primary: #07070C;        /* Deep space black */
--bg-secondary: #0E0E16;      /* Card backgrounds */
--bg-card: rgba(14, 14, 22, 0.65); /* Glass surface */

/* Velvet Purple */
--purple-400: #A78BFA;        /* Highlights, links */
--purple-500: #8B5CF6;        /* Accent */
--purple-600: #7C3AED;        /* Primary buttons, gradients */
--purple-900: #4C1D95;        /* Deep accent */

/* Text */
--text-primary: #E2E8F0;      /* Main text (frosted white) */
--text-secondary: #94A3B8;    /* Body text (muted slate) */
--text-accent: #A78BFA;       /* Purple highlights */

/* Glass */
--glass-border: rgba(167, 139, 250, 0.12);
--glass-blur: 20px;
```

---

## File Structure (Planned)

```
Portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx          ← Three.js canvas here
│   │   ├── About.tsx
│   │   ├── Publication.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── three/
│   │       └── HeroScene.tsx ← R3F scene component
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── blog.ts          ← BlogPost type definition only (data fetched live)
│   │   └── socials.ts
│   ├── styles/
│   │   └── globals.css       ← Full design system
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
└── vite.config.ts
```

> [!IMPORTANT]
> **Decision needed:** Tailwind vs Vanilla CSS? I recommend vanilla for your aesthetic. But if you prefer Tailwind (already familiar), I can make it work with custom plugins. Your call.
