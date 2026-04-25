# 3. UI/UX Testing Plan — Portfolio Website

## Testing Philosophy
Test **visuals first** (your aesthetic is the selling point), then **interactions**, then **performance**. Use browser subagent for automated visual checks + manual verification for feel.

---

## Phase 1: Visual Testing (Browser Subagent)

### Breakpoint Screenshots
| Breakpoint | Width | What to verify |
|------------|-------|---------------|
| **Desktop** | 1440px | Full layout, glassmorphism renders, Three.js particles visible, proper spacing |
| **Tablet** | 768px | Grid collapses gracefully, navbar switches to mobile, cards stack |
| **Mobile** | 375px | Single column, touch-friendly targets (44px min), Three.js disabled or simplified |

### Section-by-Section Visual Checks
| Section | Check |
|---------|-------|
| **Navbar** | Glass effect on scroll, links visible, logo renders, sticky behavior |
| **Hero** | Name legible over Three.js background, CTAs visible, responsive text sizing |
| **About** | 2-col → 1-col transition, stats cards aligned, text readable |
| **Publication** | Card doesn't overflow, badge renders, links styled correctly |
| **Projects** | Filter tabs work, cards same height in grid, tags don't overflow |
| **Skills** | Category cards aligned, skill chips wrap properly |
| **Blog** | Skeleton loads first, then cards appear with title/date/tags/excerpt. Links open correct GitHub folder |
| **Contact** | Social links centered, hover states visible |
| **Footer** | Easter egg hidden by default, reveals on hover |

### Color & Glass Verification
| Check | Expected |
|-------|----------|
| Background gradient | Smooth `#07070C` → subtle purple radial glow in hero |
| Glass cards | Semi-transparent with visible blur effect behind them |
| Purple accents | Consistent `#A78BFA` / `#7C3AED` across all interactive elements |
| Text contrast | Primary text `#E2E8F0` on `#07070C` = ratio ~15:1 ✅ |
| Secondary text | `#94A3B8` on `#07070C` = ratio ~7:1 ✅ |
| Purple on dark | `#A78BFA` on `#07070C` = ratio ~6:1 ✅ (passes AA) |

> [!WARNING]
> **Contrast concern:** `#7C3AED` (purple-600) on `#07070C` = ratio ~4:1 — borderline for small text. Use for buttons/large text only, not body text. `#A78BFA` (purple-400) is safer for smaller text.

---

## Phase 2: Interaction Testing

### Hover & Click Tests (via Browser Subagent)
| Element | Expected Behavior |
|---------|-------------------|
| Nav links | Underline slides in from left, text brightens |
| CTA buttons (primary) | Lifts 2px, shadow intensifies, glow increases |
| CTA buttons (secondary) | Border turns purple, subtle bg fill |
| Project cards | Lifts 2px, border glows purple, shadow appears |
| Skill chips | Border brightens, text turns purple |
| Social links | Lifts 2px, icon/text turns purple |
| Footer easter egg | Opacity goes from 0.4 → 1.0 |
| Project filter tabs | Active tab fills with purple bg |

### Scroll Tests
| Test | Expected |
|------|----------|
| Smooth scroll | Clicking nav link scrolls smoothly to section (CSS `scroll-behavior: smooth`) |
| Navbar background | Transparent → glass blur after scrolling past hero |
| Framer Motion reveals | Sections fade-up as they enter viewport |
| Staggered cards | Project/skill cards appear one-by-one with 50ms delay |

### Three.js Tests
| Test | Expected |
|------|----------|
| Renders on desktop | Purple particles floating behind hero text |
| Performance | Stable 60fps on modern hardware, no jank |
| Mobile fallback | Three.js canvas hidden below 768px OR replaced with CSS gradient |
| Interaction | Optional: particles react to mouse position (subtle parallax) |
| Loading | `Suspense` fallback shows CSS gradient while Three.js loads |

### Blog API Tests

| Test | Expected |
|------|----------|
| **Fetch success** | Blog cards render with title, date, tags, excerpt populated from frontmatter |
| **Sorted order** | Cards sorted newest-first by `date` frontmatter field |
| **Correct link** | "Read on GitHub →" opens `github.com/IsNoobgrammer/UncensoredAI-Blogs/tree/main/{folder}` |
| **Fetch failure** | API errors gracefully — fallback banner shows with direct repo link, no crash |
| **Loading state** | Skeleton ghost cards visible during fetch (not blank white screen) |
| **Cache hit** | Reload within 1 hour serves from `localStorage`, no API call made |
| **Cache miss** | After 1 hour or first load, fresh API call triggered |
| **Missing frontmatter** | Folder without `README.md` or missing fields — card shows `"Untitled"` / `"No excerpt"` gracefully |
| **Empty repo** | If `UncensoredAI-Blogs` has no folders, show `"No posts yet. Check back soon."` |

> [!CAUTION]
> **Pre-deploy filler check:** Before going live, verify each folder in `UncensoredAI-Blogs` has a `README.md` with valid frontmatter (`title`, `date`, `excerpt`). Run a manual test by opening the live URL in a private browser window (no cache) and confirming blog cards populate correctly.

---

## Phase 3: Performance Testing

### Build Verification
```bash
npm run build    # Must pass — TypeScript compiles, Vite bundles
npm run lint     # ESLint clean, no errors
npm run preview  # Local production preview works
```

### Lighthouse Audit (via Browser DevTools)
| Metric | Target |
|--------|--------|
| **Performance** | >85 (Three.js may lower this slightly) |
| **Accessibility** | >90 |
| **Best Practices** | >95 |
| **SEO** | >90 |

### Bundle Size Check
| Chunk | Expected Size (gzipped) |
|-------|------------------------|
| React + ReactDOM | ~45KB |
| Framer Motion | ~30KB |
| Three.js + R3F + Drei | ~200KB |
| Lucide (tree-shaken) | ~5KB |
| App code + CSS | ~15KB |
| **Total** | **~295KB** |

> [!NOTE]
> Three.js adds ~200KB to bundle. Acceptable for portfolio — first load is one-time, subsequent visits cached. If too heavy, can lazy-load Three.js scene with `React.lazy()` + `Suspense`.

### Font Loading
| Check | Expected |
|-------|----------|
| FOUT (Flash of Unstyled Text) | Minimal — use `font-display: swap` in Google Fonts import |
| Font files | Loaded from Google CDN, cached aggressively |

---

## Phase 4: Accessibility Testing

### Keyboard Navigation
| Test | Expected |
|------|----------|
| Tab through nav links | Focus visible (purple outline), logical order |
| Tab through CTA buttons | Focusable, activated with Enter |
| Tab through project cards | Links focusable |
| Tab through social links | All reachable |
| Escape key | Closes mobile nav if open |

### Screen Reader
| Element | ARIA requirement |
|---------|-----------------|
| Nav | `<nav aria-label="Main navigation">` |
| Sections | Proper `<section>` with heading hierarchy |
| Three.js canvas | `aria-hidden="true"` (decorative) |
| External links | `target="_blank" rel="noopener noreferrer"` + screen reader text |
| Icons | `aria-hidden="true"` when paired with text label |
| Stats | Descriptive labels, not just numbers |

### Contrast Summary
| Pair | Ratio | WCAG AA | WCAG AAA |
|------|-------|---------|----------|
| `#E2E8F0` on `#07070C` | ~15:1 | ✅ | ✅ |
| `#94A3B8` on `#07070C` | ~7:1 | ✅ | ✅ |
| `#A78BFA` on `#07070C` | ~6:1 | ✅ | ❌ |
| `#7C3AED` on `#07070C` | ~4:1 | ⚠️ Large text only | ❌ |
| White on `#7C3AED` button | ~7:1 | ✅ | ✅ |

---

## Testing Tools

| Tool | Purpose |
|------|---------|
| **Browser Subagent** | Screenshots, interaction testing, responsive checks |
| **Chrome Lighthouse** | Performance, accessibility, SEO audit |
| **Vite build** | TypeScript + bundle verification |
| **ESLint** | Code quality |
| **Manual (you)** | Final "feel" check — does it match your vision? Real phone test |
