# 5. UI/UX Design Plan — Portfolio Website

## Design Philosophy

**"Quiet confidence."** — The site should feel like a dark, polished lab where serious work happens. Not loud. Not flashy. Calm, premium, and technical. Like opening a well-crafted IDE at midnight — dark surfaces, precise typography, purple accents that glow softly.

Inspired by:
- [Brittany Chiang's v4](https://brittanychiang.com/) — Minimal dev portfolio, clean sections, subtle accents
- [Figma Community: Dark Portfolio Templates](https://www.figma.com/community/search?resource_type=mixed&sort_by=relevancy&query=dark+portfolio+developer&editor_type=figma) — Glass cards, dark bg, neon accents
- [Dribbble: Glassmorphism Portfolio](https://dribbble.com/search/glassmorphism-portfolio) — Frosted glass cards on dark backgrounds
- [Linear.app](https://linear.app/) — The gold standard of dark, minimal, professional UI. Purple accents, clean spacing, premium feel

---

## Extended Color System

### Primary Palette — Velvet Purple + Glassy Black

```
BACKGROUNDS (matt black → space black → card surfaces)
┌─────────────────────────────────────────────────────────────┐
│  #050508   Ultra deep — page bg base                        │
│  #07070C   Deep space — primary bg                          │
│  #0E0E16   Elevated surface — section alt bg                │
│  #14141E   Card base (before glass blur)                    │
│  #1A1A2E   Hover state bg                                   │
└─────────────────────────────────────────────────────────────┘

PURPLE VELVET (primary accent — buttons, links, glows)
┌─────────────────────────────────────────────────────────────┐
│  #4C1D95   Purple-900 — deepest, shadow tones               │
│  #5B21B6   Purple-800 — scrollbar, subtle elements          │
│  #6D28D9   Purple-700 — gradient dark end                   │
│  #7C3AED   Purple-600 — PRIMARY ACCENT (buttons, CTA)       │
│  #8B5CF6   Purple-500 — gradient mid                        │
│  #A78BFA   Purple-400 — text links, highlights, badges      │
│  #C4B5FD   Purple-300 — hover text color                    │
│  #DDD6FE   Purple-200 — rare, very light accent             │
└─────────────────────────────────────────────────────────────┘
```

### Secondary Accent — Autumn Amber (Subtle Warmth)

Based on your 🍁 motif across Instagram and Pinterest. Used sparingly as a warm contrast to cold purple.

```
AMBER (secondary accent — stats, special highlights)
┌─────────────────────────────────────────────────────────────┐
│  #F59E0B   Amber-500 — stat numbers, warm highlight         │
│  #D97706   Amber-600 — hover state                          │
│  #FBBF24   Amber-400 — glow on special elements             │
└─────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> Amber used **very sparingly** — maybe only for GitHub star counts, citation numbers, or one "featured" badge. Purple stays dominant. Think 90% purple, 10% amber warmth.

### Text Hierarchy

```
TEXT SCALE
┌─────────────────────────────────────────────────────────────┐
│  #F1F5F9   Slate-100 — Hero name (brightest)                │
│  #E2E8F0   Slate-200 — Primary body text                    │
│  #94A3B8   Slate-400 — Secondary / description text         │
│  #64748B   Slate-500 — Muted / timestamps / labels          │
│  #475569   Slate-600 — Ultra-muted / disabled               │
└─────────────────────────────────────────────────────────────┘
```

### Glass Tokens

```
GLASSMORPHISM RECIPE
┌─────────────────────────────────────────────────────────────┐
│  Background:    rgba(14, 14, 22, 0.55)                      │
│  Blur:          backdrop-filter: blur(20px)                  │
│  Border:        1px solid rgba(167, 139, 250, 0.10)         │
│  Border hover:  1px solid rgba(167, 139, 250, 0.25)         │
│  Shadow:        0 8px 32px rgba(0, 0, 0, 0.4)              │
│  Shadow hover:  + 0 0 40px rgba(124, 58, 237, 0.12)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Scale

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Hero name | Inter | 700 | `clamp(3rem, 8vw, 5.5rem)` | -0.03em |
| Section title | Inter | 600 | `clamp(1.8rem, 4vw, 2.5rem)` | -0.02em |
| Card title | Inter | 600 | 1.05rem | -0.01em |
| Body text | Inter | 300 | 0.95rem | 0 |
| Badges / Code | JetBrains Mono | 400 | 0.75rem | 0.05em |
| Stats numbers | JetBrains Mono | 700 | 2rem | 0 |
| Nav links | Inter | 400 | 0.9rem | 0 |
| Skill chips | Inter | 400 | 0.78rem | 0 |

---

## Spacing System

8px base grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps (tag spacing) |
| `--space-2` | 8px | Small gaps (chip margins) |
| `--space-3` | 12px | Card internal padding-sm |
| `--space-4` | 16px | Default element gap |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section internal gap |
| `--space-12` | 48px | Between major elements |
| `--space-16` | 64px | Section padding vertical |
| `--space-24` | 96px | Hero vertical padding |

---

## Page Wireframes (Section-by-Section)

### 1. Navbar (Fixed, Glassmorphic on Scroll)

```
┌──────────────────────────────────────────────────────────────┐
│  S.S             About  Projects  Skills  Blog  Contact  📄 │
└──────────────────────────────────────────────────────────────┘
  ↑ Logo                                              ↑ Resume
  "S" in purple                                       dropdown

  • Initially transparent (hero shows through)
  • After scrolling 100px → glass bg + border-bottom
  • Height: 64px
  • 📄 icon triggers resume role-selector dropdown
```

**Mobile Navbar:**
```
┌──────────────────────────┐
│  S.S                  ☰  │
├──────────────────────────┤
│  About                   │  ← slides down
│  Projects                │
│  Skills                  │
│  Blog                    │
│  Contact                 │
│  📄 Download Resume      │
└──────────────────────────┘
```

---

### 2. Hero (Full Viewport + Three.js Background)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│            ✦  ·    ✦        ·    ✦                           │
│       ·        ✦    ·    ✦       ·    ✦                      │
│                                                              │
│                    // hello world                             │
│                                                              │
│               Shaurya Sharthak                               │
│                                                              │
│          AI/ML Researcher · Tokenizer                        │
│         Architect · TPU Infrastructure                       │
│                  Builder                                     │
│                                                              │
│          ┌──────────────┐  ┌──────────────┐                  │
│          │ View Projects │  │  Get in Touch │                 │
│          └──────────────┘  └──────────────┘                  │
│           ↑ Purple fill     ↑ Glass border                   │
│                                                              │
│                     ↓ scroll indicator                        │
└──────────────────────────────────────────────────────────────┘

  Three.js layer (behind text):
  • Floating particles — low-poly, purple-tinted
  • Slowly drift upward
  • Mouse parallax: particles shift slightly with cursor
  • Mobile: CSS gradient fallback (radial purple glow)
```

---

### 3. About (2-Column: Story + Stats)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  About                                                       │
│  ─────                                                       │
│  The journey so far.                                         │
│                                                              │
│  ┌──────────────────────────┐  ┌────────────────────────┐    │
│  │                          │  │  ┌──────┐  ┌──────┐    │    │
│  │  Started with anime      │  │  │ 234  │  │  4   │    │    │
│  │  downloaders on GitHub   │  │  │ ⭐   │  │ Cite │    │    │
│  │  in 2022. Three years    │  │  │Stars │  │ ions │    │    │
│  │  later — published on    │  │  └──────┘  └──────┘    │    │
│  │  arXiv, 155+ models on   │  │  ┌──────┐  ┌──────┐    │    │
│  │  HuggingFace, built TPU  │  │  │ 155+ │  │  54  │    │    │
│  │  training infra used by  │  │  │Models│  │Data │    │    │
│  │  hundreds.               │  │  │  🤗  │  │ sets │    │    │
│  │                          │  │  └──────┘  └──────┘    │    │
│  │  Founded Tinycompany-AI  │  │                        │    │
│  │  — because if you can't  │  │  ↑ Glass stat cards    │    │
│  │  afford GPUs, build on   │  │    with purple gradient │    │
│  │  free TPUs.              │  │    numbers + amber ✦    │    │
│  │                          │  │    for star count       │    │
│  └──────────────────────────┘  └────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

  • Stats numbers: JetBrains Mono, gradient purple text
  • Star count (234): amber color — warm standout
  • Cards animate in: stagger 100ms delay each
```

---

### 4. Publication (Prominent Glass Card)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Publication                                                 │
│  ───────────                                                 │
│  Peer-recognized research.                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────┐                   │  │
│  │  │ 📄 arXiv:2505.09738 · cs.CL    │  ← purple badge   │  │
│  │  └─────────────────────────────────┘                   │  │
│  │                                                        │  │
│  │  Achieving Tokenizer Flexibility in Language            │  │
│  │  Models through Heuristic Adaptation and               │  │
│  │  Supertoken Learning                                   │  │
│  │                                                        │  │
│  │  Shaurya Sharthak, V. Pahalwan, A. Kamath,            │  │
│  │  A. Shirawalmath                                       │  │
│  │  ↑ First author bold + purple                          │  │
│  │                                                        │  │
│  │  ~2x improvement in zero-shot perplexity ratio         │  │
│  │  vs. ReTok and TransTokenizer baselines.               │  │
│  │                                                        │  │
│  │  4 Citations · 14⭐ · May 2025                         │  │
│  │                                                        │  │
│  │  [Read Paper →]  [View Code →]                         │  │
│  │   ↑ primary       ↑ secondary btn                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 5. Projects (Filter Grid)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Projects                                                    │
│  ────────                                                    │
│  What I've built.                                            │
│                                                              │
│  [All] [Research] [Infrastructure] [Data] [Security]         │
│   ↑ active = purple fill    ↑ inactive = glass border        │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ 📁              │  │ 📁              │  │ 📁           │ │
│  │ TPU Training     │  │ TokenAdapt      │  │ QTK-81K      │ │
│  │ Infrastructure   │  │                 │  │ Tokenizer    │ │
│  │                  │  │ Model-agnostic  │  │              │ │
│  │ End-to-end       │  │ tokenizer       │  │ 4x better    │ │
│  │ PyTorch/XLA...   │  │ transplant...   │  │ Hindi...     │ │
│  │                  │  │                 │  │              │ │
│  │ ┌────┐┌────┐     │  │ ┌────┐┌────┐    │  │ ┌────┐┌────┐│ │
│  │ │XLA ││TPU │     │  │ │NLP ││arXiv│   │  │ │BPE ││Hindi││ │
│  │ └────┘└────┘     │  │ └────┘└────┘    │  │ └────┘└────┘│ │
│  │ ─────────────    │  │ ─────────────   │  │ ────────────│ │
│  │ ⭐234  🍴27  →  │  │ ⭐14   🍴5  →  │  │ 🤗 HF    → │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ...              │
│  │ (more cards)     │  │                 │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

  • Cards: glass-card with hover lift + purple border glow
  • Tags: small mono pills
  • Footer: star/fork counts + external link arrow
  • Filter: AnimatePresence — cards fade in/out on filter change
  • Grid: auto-fill, minmax(340px, 1fr)
```

---

### 6. Skills (Category Glass Cards)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Skills                                                      │
│  ──────                                                      │
│  The toolkit.                                                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ 🧠 Research &    │  │ ⚡ Training      │  │ 💻 Frame-  │ │
│  │    NLP           │  │    Infrastructure │  │    works   │ │
│  │                  │  │                  │  │            │ │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌────────┐ │ │
│  │ │Tokenizer     │ │  │ │PyTorch/XLA   │ │  │ │PyTorch │ │ │
│  │ │Design        │ │  │ │(TPU v2-8)    │ │  │ │(Expert)│ │ │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └────────┘ │ │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌────────┐ │ │
│  │ │Multilingual  │ │  │ │GSPMD Model   │ │  │ │Hugging │ │ │
│  │ │NLP           │ │  │ │Parallelism   │ │  │ │Face    │ │ │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └────────┘ │ │
│  │ ┌──────────────┐ │  │ ...             │  │ ...        │ │
│  │ │RLHF / GRPO  │ │  │                  │  │            │ │
│  │ └──────────────┘ │  │                  │  │            │ │
│  └──────────────────┘  └──────────────────┘  └────────────┘ │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ 🗄️ Data &       │  │ 🛡️ DevOps &     │  │ 🔤 Lang-  │ │
│  │    Databases     │  │    Security      │  │    uages   │ │
│  └──────────────────┘  └──────────────────┘  └────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

  • Skill chips: rounded pills, subtle border, hover → purple glow
  • Category icon: Lucide icon in purple
  • Grid: auto-fill, minmax(300px, 1fr)
```

---

### 7. Blog (Repo Links)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Blog / Writing                                              │
│  ──────────────                                              │
│  Thoughts, tutorials, and uncensored research notes.         │
│                                                              │
│  │┌─ Loading state (skeleton) ────────────────────────────┐  │
│  ││ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │
│  ││ ░░░░░░░░░░░░░░░░░░░░░░                                   │  │
│  │└───────────────────────────────────────────────────┘  │
│                                                              │
│  │┌─ Loaded card ─────────────────────────────────────┐  │
│  ││ Why TPUs Are Underrated                 2025-11-01 │  │
│  ││ [TPU] [XLA] [Infrastructure]                      │  │
│  ││ The compute-poor researcher's guide to free...    │  │
│  ││                             Read on GitHub →       │  │
│  │└───────────────────────────────────────────────────┘  │
│                                                              │
│  │┌─ Error fallback ───────────────────────────────┐  │
│  ││ Couldn't load posts. View all on GitHub →         │  │
│  │└───────────────────────────────────────────────────┘  │
│                                                              │
│  [View All on GitHub →]                                      │
└──────────────────────────────────────────────────────────────┘

  Data: Live GitHub Contents API (auto-updates when new folders added)
  Tags: small monospace pills, purple-tinted — same style as project tags
  Skeleton: pulsing shimmer animation (css @keyframes) before data loads
  No posts: "No posts yet. Check back soon."
  Cards: glass-card style, full-width list (not grid — blog = reading intent)
```

---

### 8. Contact (Centered, Clean)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                       Get in Touch                           │
│                       ────────────                           │
│                                                              │
│           Looking for research internships and               │
│           ML engineering roles. Let's build                  │
│           something meaningful.                              │
│                                                              │
│     ┌────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐         │
│     │ GitHub │ │  🤗 HF │ │ LinkedIn │ │ Twitter │         │
│     └────────┘ └────────┘ └──────────┘ └─────────┘         │
│     ┌──────────┐ ┌────────┐ ┌─────────────────────┐         │
│     │ Scholar  │ │ ArXiv  │ │     Say Hello →      │         │
│     └──────────┘ └────────┘ └─────────────────────┘         │
│                              ↑ Primary purple btn            │
│                                (mailto: link)                │
│                                                              │
└──────────────────────────────────────────────────────────────┘

  • Social buttons: glass-style, icon + label, hover → lift + purple
  • Email CTA: large purple gradient button
  • Clean, minimal, lots of breathing room
```

---

### 9. Footer

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  © 2026 Shaurya Sharthak                                     │
│  Built with ☕ and free TPUs · paneer/sabzi approved          │
│                            ↑ italic, opacity 0.4 → 1.0 hover│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Resume Download Feature — Multi-Role

5 resume variants matching your `.tex` files:

| # | Role | File |
|---|------|------|
| 1 | AI/ML Engineer | `resume_ai_ml_engineer.pdf` |
| 2 | Cybersecurity | `resume_cybersec.pdf` |
| 3 | Data Scientist | `resume_data_scientist.pdf` |
| 4 | NLP Research Scientist | `resume_nlp_research_scientist.pdf` |
| 5 | Python SWE | `resume_python_swe.pdf` |

### UI: Resume Dropdown

```
  Navbar:
  ... Skills  Blog  Contact  [📄 Resume ▾]
                        ┌─────────────────────┐
                        │ AI/ML Engineer       │
                        │ Data Scientist       │
                        │ NLP Researcher       │
                        │ Python SWE           │
                        │ Cybersecurity        │
                        └─────────────────────┘
                         ↑ Glass dropdown
                         Purple hover highlight
                         Click → downloads PDF

  Implementation:
  • Navbar has "Resume" button with dropdown
  • Dropdown = glass card, positioned below button
  • Each item = role name, click triggers <a download>
  • Filler PDFs placed in public/resumes/ until you replace
  • AnimatePresence for smooth open/close
```

### File Structure for Resumes

```
public/
└── resumes/
    ├── resume_ai_ml_engineer.pdf       ← filler until you add
    ├── resume_cybersec.pdf
    ├── resume_data_scientist.pdf
    ├── resume_nlp_research_scientist.pdf
    └── resume_python_swe.pdf
```

> [!TIP]
> Filler PDFs = single-page placeholder saying "Resume — [Role Name] — Coming Soon". You swap with compiled LaTeX PDFs when ready.

---

## Three.js Hero Scene — Detailed Spec

| Aspect | Details |
|--------|---------|
| **Geometry** | `BufferGeometry` with ~500 point particles |
| **Material** | `PointsMaterial` — size 2px, color `#A78BFA`, transparent, opacity 0.6 |
| **Motion** | Slow upward drift (y += 0.001/frame) + sine wave on x-axis |
| **Mouse interaction** | Particles shift subtly toward cursor position (parallax, max 20px offset) |
| **Background** | Solid `#050508` behind canvas |
| **Fallback** | Below 768px viewport → hide `<Canvas>`, show CSS radial gradient instead |
| **Performance** | Request `antialias: false`, `alpha: true`, `powerPreference: 'low-power'` |
| **Loading** | `React.Suspense` wrapper → CSS gradient shown during Three.js init |
| **R3F helpers** | Use `@react-three/drei` `Float` for gentle bobbing, `Stars` as alternative if particles too heavy |

---

## Micro-Animation Catalog

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Sections | Fade up 20px + opacity 0→1 | Scroll into viewport | 0.6s ease-out |
| Project cards | Stagger fade up | Scroll + 80ms stagger per card | 0.4s |
| Stat numbers | Count up from 0 | Scroll into viewport | 1.2s ease-out |
| Nav underline | Width 0→100% | Hover | 0.3s |
| Glass cards | translateY(-2px) + shadow | Hover | 0.3s |
| CTA buttons | translateY(-2px) + glow increase | Hover | 0.3s |
| Blog cards | Stagger fade up (same as project cards) | Scroll into viewport + 80ms stagger | 0.4s |
| Blog skeleton | Shimmer pulse (bg position animation) | On mount while fetching | Continuous until loaded |
| Filter tabs | bg fill + color change | Click | 0.2s |
| Resume dropdown | Scale Y 0→1 from top | Click toggle | 0.2s |
| Footer easter egg | Opacity 0.4→1 | Hover | 0.3s |
| Three.js particles | Continuous drift + mouse parallax | Always | Continuous |
| Page load | Hero content fades in from bottom | Mount | 0.8s delay 0.2s |

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|---------------|
| **>1200px** | Full desktop. 3-col project grid. 2-col about |
| **768–1200px** | 2-col project grid. 2-col about. Slightly smaller hero text |
| **<768px** | 1-col everything. Mobile nav (hamburger). Three.js → CSS gradient. Stack social links vertically |
| **<480px** | Extra compact. Buttons stack vertically. Stats 1-col |

---

## Design References

| Reference | What to Take |
|-----------|-------------|
| [Brittany Chiang](https://brittanychiang.com/) | Section layout, nav style, project card format |
| [Linear.app](https://linear.app/) | Purple accent on dark bg, typography scale, premium feel |
| [Figma: Glass Portfolio](https://www.figma.com/community/search?query=glass+portfolio+dark) | Card glass effects, border treatments |
| [Dribbble: Dark Dev Portfolio](https://dribbble.com/search/dark-developer-portfolio) | Color palette inspiration, hero layouts |
| [Vercel Dashboard](https://vercel.com/dashboard) | Clean spacing, subtle borders, professional dark UI |
| [Raycast](https://raycast.com/) | Purple accents, command-palette style, developer-focused |

---

## Visual Identity Summary

```
┌────────────────────────────────────────────────┐
│  SHAURYA SHARTHAK — VISUAL IDENTITY            │
│                                                │
│  Mood:     Midnight lab. Quiet confidence.      │
│  Colors:   Velvet purple + matt black + amber   │
│  Glass:    Frosted, semi-transparent cards       │
│  Type:     Inter (clean) + JetBrains (tech)     │
│  Motion:   Subtle. Scroll reveals. Soft hovers  │
│  3D:       Purple particles drifting in hero     │
│  Feel:     Premium IDE meets researcher profile  │
│  NOT:      Flashy, neon, corporate, template-y   │
└────────────────────────────────────────────────┘
```
