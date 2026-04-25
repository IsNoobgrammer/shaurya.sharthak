# 2. Objectives Plan — Portfolio Website

## Core Goal
Build a **minimalist, glassy/matt portfolio** that fixes Shaurya's self-promo gap (4/10 score). Let the work speak — but make it visible and beautiful. No fluff, no corporate cringe. On-brand with anti-pretentious personality.

---

## Page Sections (Scroll Order)

### Section 1: Hero
| Aspect | Details |
|--------|---------|
| **Content** | Name "Shaurya Sharthak", tagline, 2 CTA buttons |
| **Tagline** | "AI/ML Researcher · Tokenizer Architect · TPU Infrastructure Builder" |
| **CTAs** | [View Projects] (scroll) + [Get in Touch] (scroll to contact) |
| **Background** | Three.js particle mesh — velvet purple floating particles, slowly drifting. Subtle, not distracting |
| **Greeting** | `// hello world` in monospace above name — coder personality |
| **Vibe** | Calm confidence. Big name, small tagline. Lots of negative space |

### Section 2: About
| Aspect | Details |
|--------|---------|
| **Layout** | 2-column: text left, stats grid right |
| **Text** | Origin story — JNV kid → self-taught → anime downloaders → cybersec → published ML researcher. 3-4 short paragraphs. Voice: first-person, casual-confident |
| **Stats grid** | 4 glass cards: `234⭐ GitHub Stars` · `4 Citations` · `155+ Models` · `54 Datasets` |
| **Photo** | GitHub avatar (from `https://avatars.githubusercontent.com/u/112808251`) |
| **Tone** | Not "I am a passionate engineer..." — more "Started with anime downloaders, ended up publishing on arXiv" |

### Section 3: Publication
| Aspect | Details |
|--------|---------|
| **Layout** | Single prominent glass card |
| **Badge** | `📄 arXiv:2505.09738 · cs.CL` |
| **Title** | "Achieving Tokenizer Flexibility..." (full title) |
| **Authors** | **Shaurya Sharthak** (bold), Vinayak Pahalwan, Adithya Kamath, Adarsh Shirawalmath |
| **Key Result** | "~2x improvement in zero-shot perplexity ratio" — highlighted |
| **Metrics** | 4 Citations · 14⭐ repo · May 2025 |
| **Links** | [Read Paper] → arXiv · [View Code] → GitHub |

### Section 4: Projects
| Aspect | Details |
|--------|---------|
| **Layout** | Filter tabs + responsive grid of glass cards |
| **Filters** | All · Research · Infrastructure · Data · Security |
| **Cards** | Title, description (2-3 lines), tech tags, stars/forks count, platform icon, external link |
| **Projects (8)** | TPU-Alignment (234⭐), TokenAdapt (14⭐), QTK-81K, Be-More-Specific-USER, SuperTokenizer (13⭐), Hybrid RAG, Dataset Portfolio (54 datasets), Security Assessment |
| **Hover** | Card lifts 2px, border glows purple, shadow appears |
| **Animation** | Staggered fade-in on scroll via Framer Motion |

### Section 5: Skills
| Aspect | Details |
|--------|---------|
| **Layout** | Grid of glass category cards |
| **Categories** | Research & NLP · Training Infrastructure · Frameworks · Data & Databases · DevOps & Security · Languages |
| **Style** | Each card: icon + title + skill tag chips |
| **Skill chips** | Small rounded pills, subtle purple border, hover glow |

### Section 6: Blog
| Aspect | Details |
|--------|---------|
| **Layout** | List of glass cards, sorted newest-first |
| **Data Source** | **Live GitHub Contents API** — `GET /repos/IsNoobgrammer/UncensoredAI-Blogs/contents/` |
| **Post Structure** | Each top-level folder in the repo = 1 blog card. Folder needs a `README.md` with YAML frontmatter |
| **Frontmatter** | `title`, `date`, `tags[]`, `excerpt` — parsed from each folder's `README.md` |
| **Card Details** | Title, date, tag chips, excerpt (first 150 chars), `"Read on GitHub →"` link |
| **Link Target** | `github.com/IsNoobgrammer/UncensoredAI-Blogs/tree/main/{folder}` |
| **Loading state** | Skeleton ghost cards while API fetches |
| **Error state** | Fallback banner: `"View all posts on GitHub →"` with direct repo link |
| **Cache** | `localStorage` 1-hour TTL to avoid repeat API hits |
| **Auto-update** | Adding a new folder to `UncensoredAI-Blogs` auto-creates a new card — no portfolio code change |

> [!CAUTION]
> **Filler state:** `UncensoredAI-Blogs` folders may be empty or lack frontmatter at launch. Add `README.md` with proper frontmatter to each folder before going live or the cards will show blank/broken excerpts.

### Section 7: Contact
| Aspect | Details |
|--------|---------|
| **Layout** | Centered, minimal |
| **Text** | "Looking for research internships and ML engineering roles. Let's build something." |
| **Links** | GitHub · HuggingFace · LinkedIn · Twitter · Google Scholar · ArXiv · Email |
| **Style** | Social link buttons in a row, glass-style, icon + label |
| **Email CTA** | Primary purple button: [Say Hello →] |

### Section 8: Footer
| Aspect | Details |
|--------|---------|
| **Content** | `© 2026 Shaurya Sharthak` |
| **Easter egg** | Faded italic text that reveals on hover: *"Built with ☕ and free TPUs · paneer/sabzi approved"* — personality touch |

---

## Design Objectives

| Objective | Implementation |
|-----------|---------------|
| **Minimalist** | Max 2-3 elements per viewport. Whitespace = design. No clutter |
| **Glassmorphism** | Cards use `backdrop-filter: blur(20px)`, semi-transparent bg, subtle purple borders |
| **Matt finish** | Low-contrast backgrounds, muted gradients, no harsh whites. Feels like brushed metal |
| **Velvet purple** | Primary accent throughout — buttons, highlights, gradients, hover glows |
| **Autumn amber** | Secondary warm accent (`#F59E0B`) for star counts, special badges. 🍁 vibes. Used sparingly — 90% purple, 10% amber |
| **Micro-animations** | Framer Motion: fade-up on scroll (each section), stagger on project cards, subtle hover scale (1.02) |
| **Three.js hero** | Floating purple particles behind hero text. Performance-aware — disabled on mobile |
| **Typography** | Inter for body (clean, modern). JetBrains Mono for stats/code/badges. Large hero text with `clamp()` responsive sizing |
| **Dark mode only** | No toggle. Always dark. Your aesthetic = darkness |

---

## SEO Objectives

| Tag | Content |
|-----|---------|
| `<title>` | "Shaurya Sharthak — AI/ML Researcher & Infrastructure Builder" |
| `<meta description>` | "Portfolio of Shaurya Sharthak — Published AI researcher, TPU training infrastructure builder, multilingual tokenizer architect. Founder of Tinycompany-AI." |
| `<meta og:image>` | OG card image (generate later) |
| Heading hierarchy | Single `<h1>` (hero name), `<h2>` per section, proper semantic HTML |
| Semantic elements | `<nav>`, `<main>`, `<section>`, `<footer>` with IDs for anchors |

---

## Assumed Decisions

| Assumption | Reasoning | Override? |
|------------|-----------|-----------|
| **Single scrollable page** | Portfolio = one flow. No need for separate routes | Could do multi-page |
| **GitHub-backed Blog** | Live GitHub API fetches folders from `UncensoredAI-Blogs` as posts. Zero portfolio code changes when new posts are added | Swap static fallback if API deprecated |
| **No CMS** | Content hardcoded in data files. You'll edit .ts files directly | Overkill for this |
| **English UI** | Professional presentation. Hindi/Hinglish in easter egg only | Could add language toggle |
| **No contact form** | `mailto:` link + social links. No backend needed. Use Formspree if you want form later | Can add |
| **Static stats** | Stars/citations/model counts hardcoded. Live API fetching = extra complexity + rate limits | Can add API later |
| **GitHub avatar** | Use your GitHub avatar URL for photo. Replace with real photo whenever | Provide photo |
| **Multi-resume** | 5 role-specific PDFs: AI/ML Engineer, Cybersec, Data Scientist, NLP Research Scientist, Python SWE. Navbar dropdown selector. Filler PDFs until you add compiled LaTeX | Swap PDFs when ready |
| **No analytics** | Clean deploy, no tracking | Can add Vercel Analytics free |

---

## Content Sources

All portfolio content sourced from your existing docs:
- [shaurya_ultimate_profile.md](file:///c:/Users/shaur/OneDrive/Documents/Resume%20Workflow/Resume_Docs/shaurya_ultimate_profile.md) — projects, stats, publication, skills
- [Shaurya_personality.md](file:///c:/Users/shaur/OneDrive/Documents/Resume%20Workflow/Resume_Docs/Shaurya_personality.md) — tone, easter eggs, personality traits
- [shaurya_master_profile_for_resume.md](file:///c:/Users/shaur/OneDrive/Documents/Resume%20Workflow/Resume_Docs/shaurya_master_profile_for_resume.md) — project rankings, work experience
