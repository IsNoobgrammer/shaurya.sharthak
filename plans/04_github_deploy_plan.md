# 4. GitHub Push & Deployment Plan — Portfolio Website

## Part A: Pushing to GitHub (MCP Only)

All via GitHub MCP tools — **zero manual git CLI**. No `git init`, no `git push`, no terminal git commands.

---

### Step 1: Create Repository

**Tool:** `create_repository`

| Parameter | Value |
|-----------|-------|
| `name` | `shaurya.sharthak` |
| `description` | "Personal portfolio — AI/ML Researcher & Infrastructure Builder" |
| `private` | `false` (must be public for free Vercel/Netlify deploy) |
| `autoInit` | `false` (we push our own files) |

> [!NOTE]
> Vercel URL will be: **`shaurya-sharthak.vercel.app`** (dots become hyphens in subdomain).

---

### Step 2: Push All Source Files

**Tool:** `push_files` (single commit with all files)

| Parameter | Value |
|-----------|-------|
| `owner` | `IsNoobgrammer` |
| `repo` | `shaurya.sharthak` |
| `branch` | `main` |
| `message` | `feat: initial portfolio website — velvet purple glassmorphism` |

**Files to push:**

```
index.html
package.json
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
eslint.config.js
.gitignore
src/main.tsx
src/App.tsx
src/vite-env.d.ts
src/styles/globals.css
src/components/Navbar.tsx
src/components/Hero.tsx
src/components/About.tsx
src/components/Publication.tsx
src/components/Projects.tsx
src/components/Skills.tsx
src/components/Blog.tsx
src/components/Contact.tsx
src/components/Footer.tsx
src/components/three/HeroScene.tsx
src/data/projects.ts
src/data/skills.ts
src/data/blog.ts
src/data/socials.ts
```

> [!WARNING]
> **MCP `push_files` limitation:** Only handles text files. Binary files (images, fonts, PDFs) cannot be pushed via MCP. For this portfolio:
> - **Images:** Use external URLs (GitHub avatar, generated OG image)
> - **Fonts:** Loaded from Google Fonts CDN (no local files)
> - **Resume PDF:** Skip for now, or host on Google Drive/Dropbox with link
>
> If you need binary files later, you'll need one manual `git push` from terminal.

> [!CAUTION]
> ## 🚧 Filler Content — Update Before Going Live
>
> The following items are **placeholders** and must be replaced before the portfolio is shared publicly:
>
> ### Resume PDFs — `public/resumes/`
> | File | Status | Action |
> |------|--------|--------|
> | `resume_ai_ml_engineer.pdf` | ⛔ Filler | Replace with compiled LaTeX PDF |
> | `resume_cybersec.pdf` | ⛔ Filler | Replace with compiled LaTeX PDF |
> | `resume_data_scientist.pdf` | ⛔ Filler | Replace with compiled LaTeX PDF |
> | `resume_nlp_research_scientist.pdf` | ⛔ Filler | Replace with compiled LaTeX PDF |
> | `resume_python_swe.pdf` | ⛔ Filler | Replace with compiled LaTeX PDF |
>
> **How:** Compile your `.tex` files → drop the 5 PDFs into `public/resumes/` → push to GitHub. Vercel auto-deploys.
>
> ### Blog Repo — `IsNoobgrammer/UncensoredAI-Blogs`
> | Item | Status | Action |
> |------|--------|--------|
> | Repo itself | ✅ Real repo exists | No action needed |
> | Blog posts (folders) | ⚠️ May be sparse | Add new folders = new blog posts auto-appear |
> | `README.md` in each folder | ⚠️ Required for excerpt | Each folder needs a `README.md` with frontmatter |
>
> **How blog auto-updates:** See **Part C** below for the GitHub API dynamic fetch strategy. No code changes needed when you add new posts — just push a new folder to `UncensoredAI-Blogs`.

---

### Step 3: Create README

**Tool:** `push_files` or `create_or_update_file`

```markdown
# Shaurya Sharthak — Portfolio

Personal portfolio website built with React + TypeScript + Three.js.

**Live:** [shaurya-sharthak.vercel.app](https://shaurya-sharthak.vercel.app)

## Stack
- Vite 8 + React 19 + TypeScript
- Vanilla CSS (glassmorphism design system)
- Three.js + React Three Fiber (hero particles)
- Framer Motion (animations)

## Run Locally
npm install
npm run dev

## Build
npm run build

## Deploy
Deployed on Vercel. Auto-deploys on push to `main`.
```

---

### Step 4: Verify Upload

**Tool:** `get_file_contents`

- Check `src/App.tsx` exists and content is correct
- Check `package.json` has right dependencies
- Confirm repo name is `shaurya.sharthak`
- Check `src/styles/globals.css` is present

---

### Step 5 (Optional): Set Up Branch Protection

Not critical for solo portfolio, but good practice:
- Protect `main` branch
- Require passing build check before merge
- Can set up later

---

## Part B: Deployment (Vercel — Recommended)

### Why Vercel

| Feature | Details |
|---------|---------|
| **Free tier** | Hobby plan = unlimited personal projects, no credit card |
| **Vite support** | Auto-detects Vite, zero build config needed |
| **GitHub integration** | Connects to repo, auto-deploys every push to `main` |
| **Instant URL** | `shaurya-sharthak.vercel.app` immediately |
| **CDN** | Global edge network, fast loads worldwide |
| **Preview deploys** | Every PR/branch gets its own preview URL |
| **Custom domain** | Free HTTPS/SSL, easy DNS setup |
| **Three.js compatible** | 100% — serves static JS bundle, no server needed |

### Deployment Steps

#### Step 1: Sign Up / Login
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Select **Hobby (Free)** plan

#### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `IsNoobgrammer/shaurya.sharthak` in repo list
3. Click **"Import"**

#### Step 3: Configure Build
Vercel auto-detects Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x (default) |

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 30-60 seconds for build
3. Get live URL: **`shaurya-sharthak.vercel.app`**

#### Step 5: Custom Domain (Optional, Later)
1. Buy domain (~$10/yr from Namecheap or Cloudflare)
2. In Vercel: **Settings** → **Domains** → **Add**
3. Enter domain name (e.g., `shaurya.dev` or `shaurya-sharthak.dev`)
4. Add DNS records as Vercel instructs (usually 2 records)
5. Vercel handles SSL/HTTPS automatically
6. Domain propagates in 5-30 minutes

---

### Auto-Deploy (CI/CD — Automatic)

Once connected, Vercel auto-deploys:
- **Push to `main`** → Production deploy
- **Push to any branch** → Preview deploy with unique URL
- **No GitHub Actions needed** — Vercel handles it

Build status badge can be added to README.

---

### Alternative Platforms Compared

| Platform | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Vercel** | Best DX, auto-detect Vite, preview deploys, fast | None for this use case | ✅ **Recommended** |
| **Netlify** | Good free tier, form handling built-in | Slightly slower builds, less React-optimized | ✅ Good alternative |
| **GitHub Pages** | Free, no signup needed, direct from repo | Manual deploy config, no auto-builds without Actions, no serverless | ⚠️ Works but more setup |
| **Cloudflare Pages** | Fastest CDN, generous free tier | Less mature React/Vite support, newer platform | ⚠️ Good but less tested |
| **Render** | Free static hosting | Slower cold starts, less features | ❌ Not ideal |

> [!TIP]
> **Fastest path:** Vercel. Sign in with GitHub → Import repo → Deploy. Done in 2 minutes. Zero config needed for Vite.

---

## Post-Deploy Checklist

| Check | How |
|-------|-----|
| All sections render | Visit live URL, scroll through entire page |
| Three.js loads | Hero particles visible on desktop |
| Mobile responsive | Open on phone or Chrome DevTools mobile |
| Links work | Click every GitHub/HF/LinkedIn/Twitter link |
| Meta tags | Share URL on Twitter/LinkedIn — check preview card renders |
| Performance | Run Lighthouse on live URL |
| Blog loads | Blog section shows posts fetched from UncensoredAI-Blogs |
| Blog links | Each "Read on GitHub →" goes to correct folder URL |
| Resume PDFs | All 5 PDFs download correctly (not filler) |
| HTTPS | Verify padlock icon in browser (Vercel does this automatically) |

---

## Part C: Dynamic Blog — GitHub API Strategy

> [!IMPORTANT]
> **YES — new folders in `UncensoredAI-Blogs` will auto-appear as blog posts.** No portfolio code changes needed. Here's how:

### How It Works

```
UncensoredAI-Blogs repo (github.com/IsNoobgrammer/UncensoredAI-Blogs)
│
├── why-tpus-are-underrated/
│   └── README.md   ← Contains blog content + metadata
│
├── state-of-open-source-models/
│   └── README.md
│
└── (new folder) = new blog post — auto-fetched
```

**Portfolio Blog component calls GitHub Contents API at runtime:**
```
GET https://api.github.com/repos/IsNoobgrammer/UncensoredAI-Blogs/contents/
```
Returns a JSON array of all top-level folders → each folder = one blog post card.

For each folder, fetch its `README.md` for the excerpt:
```
GET https://api.github.com/repos/IsNoobgrammer/UncensoredAI-Blogs/contents/{folder}/README.md
```

### README.md Frontmatter Convention (for each blog folder)

```markdown
---
title: "Why TPUs Are Underrated"
date: "2025-11-01"
tags: ["TPU", "Infrastructure", "XLA"]
excerpt: "The compute-poor researcher's guide to free TPUs and why everyone ignores them."
---

# Why TPUs Are Underrated

... rest of blog content ...
```

Portfolio reads only the frontmatter block + first 150 chars for the card excerpt.

### Technical Implementation (for `src/components/Blog.tsx`)

| Step | What | How |
|------|------|-----|
| 1 | Fetch folder list | `fetch('https://api.github.com/repos/IsNoobgrammer/UncensoredAI-Blogs/contents/')` |
| 2 | Filter for dirs | `.filter(item => item.type === 'dir')` |
| 3 | Fetch README per folder | Per-folder `fetch(item.url + '/README.md')` — `atob(res.content)` to decode base64 |
| 4 | Parse frontmatter | Simple regex or `gray-matter` (tiny npm package) |
| 5 | Render cards | Glass cards — title, date, tags, excerpt, "Read on GitHub →" link |
| 6 | Sort | By `date` field in frontmatter, newest first |
| 7 | Link target | `https://github.com/IsNoobgrammer/UncensoredAI-Blogs/tree/main/{folder}` |

### Rate Limits & Caching

| Concern | Details |
|---------|---------|
| **GitHub API rate limit** | 60 requests/hour unauthenticated. Fine for a portfolio — not high traffic |
| **Mitigation** | Add `localStorage` cache with 1-hour TTL so repeat visitors don't re-hit API |
| **Token (optional)** | Add a public read-only GitHub token as Vercel env var → 5000 req/hr. Only if needed |
| **Fallback** | If API fails, show a static message: "View all posts on GitHub →" with repo link |

### Workflow: Adding a New Blog Post

```
1. Create folder in UncensoredAI-Blogs   → e.g. my-new-post/
2. Add README.md with frontmatter        → title, date, excerpt
3. Push to GitHub                        → git push (manual, in that repo)
4. Portfolio auto-fetches on next load   → new card appears
5. Zero changes to portfolio code        → ✅
```

> [!TIP]
> **Private repo?** GitHub API can fetch private repos if you add a personal access token (PAT) as a Vercel environment variable (`VITE_GITHUB_TOKEN`). The token is exposed in client bundle — use a fine-grained read-only token scoped to that repo only. For public blogs, no token needed.

---

## Summary Timeline

```
1. Code complete         → [Phase 4-5 of build]
2. npm run build passes  → [Phase 6]
3. MCP push to GitHub    → 5 minutes (create repo + push files)
4. Vercel import         → 2 minutes (sign in + import + deploy)
5. Live URL ready        → ~30 seconds after deploy
6. Custom domain         → Optional, anytime later
```

Total from code-complete to live: **~10 minutes**.
