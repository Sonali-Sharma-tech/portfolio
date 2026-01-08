# Portfolio Website Plan - sonalisharma.dev

## Overview

A professional developer portfolio website built **from scratch** (new repo, no code reuse from black-note) with a **Lord of the Rings / Fantasy Medieval** visual theme, focusing on **performance**, **SEO**, **accessibility**, and **unique animations**.

---

## Decision Summary

| Item | Decision |
|------|----------|
| Domain | `sonalisharma.vercel.app` (free, custom domain later) |
| Hosting | Vercel (free tier) |
| Framework | Next.js 15 (App Router) |
| Design | **Lord of the Rings Fantasy Theme** with dark/light toggle |
| Animations | **GSAP ScrollTrigger** + CSS effects |
| Content | MDX blog + project case studies |
| Newsletter | ConvertKit (1000 free subscribers) |
| Repo | **portfolio** - fresh start, no black-note code |

---

## Git Workflow

### Branch Strategy
```
main              # Production - protected, only merged via PR
├── develop       # Integration branch (optional)
└── feature/*     # Feature branches for all work
```

### PR Workflow
1. **Never commit directly to main**
2. Create feature branch: `git checkout -b feature/hero-section`
3. Make commits on feature branch
4. Push and create PR: `gh pr create`
5. Review and merge PR to main
6. Delete feature branch after merge

### Branch Naming Convention
```
feature/hero-section      # New features
feature/gsap-animations
feature/blog-system
fix/mobile-nav            # Bug fixes
chore/update-deps         # Maintenance
```

### Example Workflow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/hero-section

# Work on feature...
git add .
git commit -m "Add hero section with ink text animation"

# Push and create PR
git push -u origin feature/hero-section
gh pr create --title "Add hero section" --body "..."

# After PR is merged
git checkout main
git pull origin main
git branch -d feature/hero-section
```

---

## Design Theme: Lord of the Rings / Fantasy Medieval

### Visual Identity

Inspired by Middle-earth aesthetics - elvish elegance meets aged parchment.

### Key Visual Elements

| Element | Implementation |
|---------|----------------|
| **Parchment texture** | CSS feTurbulence filter + sepia overlay |
| **Gold ornate borders** | SVG decorative frames, elvish patterns |
| **Elvish typography** | Cinzel / Cormorant fonts (elegant serifs) |
| **Aged paper effect** | mix-blend-mode: multiply with texture |
| **Illuminated letters** | Drop caps with gold/decorative styling |
| **Map-like navigation** | Interactive scroll-based exploration |

### Color Palette

**Parchment Mode (Light)**
```css
--background:     #f4e4c1  /* Aged parchment */
--background-alt: #e8d4a8  /* Darker parchment */
--foreground:     #2c1810  /* Dark brown ink */
--accent:         #8b6914  /* Burnished gold */
--accent-glow:    #d4af37  /* Bright gold */
--muted:          #6b5344  /* Faded ink */
--border:         #c9a959  /* Gold border */
```

**Dark Mode (Night in Middle-earth - DEFAULT)**
```css
--background:     #1a1410  /* Dark leather */
--background-alt: #2a2018  /* Worn leather */
--foreground:     #e8d4a8  /* Parchment text */
--accent:         #d4af37  /* Gold */
--accent-glow:    #ffd700  /* Bright gold */
--muted:          #8b7355  /* Aged gold */
--border:         #8b6914  /* Burnished gold */
```

### Typography

```css
/* Headings - Elvish/Medieval feel */
font-family: 'Cinzel', 'Cormorant Garamond', serif;

/* Body - Readable but thematic */
font-family: 'Crimson Pro', 'EB Garamond', Georgia, serif;

/* Code blocks - Monospace with character */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Decorative Elements

1. **Ornate corner frames** - SVG elvish knotwork patterns
2. **Section dividers** - Horizontal decorative rules with leaf/vine motifs
3. **Gold leaf accents** - Subtle shimmer on hover
4. **Wax seal icons** - For categories/tags
5. **Scroll-like cards** - Curled edges, parchment texture

---

## Unique Animations (GSAP)

### Hero Section
- **Parchment unroll** - Page "unrolls" on load like an ancient scroll
- **Ink writing effect** - Text appears as if being written
- **Gold shimmer** - Subtle light reflection on gold elements

### Scroll Animations
- **Parallax map** - Background moves like exploring a map (like "A Journey Through Middle-earth")
- **Fade-in sections** - Content reveals as you scroll down
- **Floating particles** - Subtle dust/ember particles

### Interactions
- **Hover glow** - Gold elements glow on hover
- **Card flip** - Project cards flip to reveal details
- **Page transitions** - Smooth parchment-style transitions

### GSAP Implementation
```javascript
// Scroll-triggered reveals
gsap.registerPlugin(ScrollTrigger);

// Ink writing effect
gsap.from(".hero-title", {
  clipPath: "inset(0 100% 0 0)",
  duration: 2,
  ease: "power2.out"
});

// Parallax background
gsap.to(".map-bg", {
  yPercent: -20,
  scrollTrigger: {
    trigger: ".hero",
    scrub: true
  }
});
```

### Inspiration Sources
- [A Journey Through Middle-earth](https://experiments.withgoogle.com/a-journey-through-middle-earth) - Awwwards SOTD
- [Made With GSAP](https://madewithgsap.com/) - 50 animation effects
- [Codrops GSAP Tutorials](https://tympanus.net/codrops/) - Scroll-driven animations

---

## Part 1: Performance (Core Web Vitals)

### Target Metrics
| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** | < 2.5s | Largest Contentful Paint - how fast main content loads |
| **INP** | < 200ms | Interaction to Next Paint - responsiveness |
| **CLS** | < 0.1 | Cumulative Layout Shift - visual stability |

### Implementation Strategy

1. **LCP Optimization**
   - Use `fetchpriority="high"` on hero images
   - Serve images in WebP/AVIF format via `next/image`
   - Implement CDN (Vercel Edge Network)
   - Lazy load 3D components (don't block initial paint)

2. **INP Optimization**
   - Break long JavaScript tasks into smaller chunks
   - Use React Server Components (RSC) - less client JS
   - Minimize third-party scripts
   - Use `dynamic()` imports for heavy components

3. **CLS Optimization**
   - Set explicit `width` and `height` on all images
   - Use `aspect-ratio` CSS for media containers
   - Reserve space for async content (skeleton loaders)
   - Preload fonts to prevent FOUT

### Rendering Strategy (Hybrid)
| Page | Strategy | Why |
|------|----------|-----|
| Home | Static (SSG) | Rarely changes, fast load |
| Projects | Static + ISR (revalidate: 3600) | Updates occasionally |
| Blog list | Static + ISR (revalidate: 3600) | New posts periodically |
| Blog post | Static (SSG) | Content doesn't change |
| About | Static (SSG) | Rarely changes |
| Contact | Static (SSG) | Form is client-side |

---

## Part 2: SEO Strategy

### Technical SEO

1. **Structured Data (JSON-LD)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Sonali Sharma",
     "jobTitle": "Full-Stack Developer",
     "url": "https://sonalisharma.dev",
     "sameAs": [
       "https://github.com/Sonali-Sharma-tech",
       "https://linkedin.com/in/..."
     ]
   }
   ```

2. **Meta Tags**
   - Unique title per page (50-60 chars)
   - Meta description (150-160 chars)
   - Open Graph tags for social sharing
   - Canonical URLs

3. **Technical Foundations**
   - `sitemap.xml` (auto-generated via `next-sitemap`)
   - `robots.txt` with proper directives
   - Clean URL structure (`/blog/post-slug`)
   - 301 redirects for any moved content

4. **Performance = SEO**
   - Google uses Core Web Vitals as ranking signals
   - Mobile-first indexing (responsive design)
   - HTTPS (automatic with Vercel)

### Content SEO

1. **Blog Strategy**
   - Long-tail keywords: "how to build X with Next.js"
   - Internal linking between posts and projects
   - Alt text on all images
   - Reading time display

2. **Project Case Studies**
   - Problem → Solution → Tech Stack → Results
   - Include metrics where possible
   - Link to live demos and GitHub repos

---

## Part 3: Accessibility (WCAG 2.2 AA)

### Core Requirements

1. **Semantic HTML**
   - Use `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`
   - Proper heading hierarchy (h1 → h2 → h3)
   - Landmark regions for screen readers

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators (custom styles)
   - Skip link to main content
   - No focus traps

3. **Color & Contrast**
   - 4.5:1 minimum contrast ratio
   - Don't rely on color alone for meaning
   - Dark/light mode toggle respects system preference

4. **Touch Targets**
   - Minimum 24x24 CSS pixels (WCAG 2.2)
   - 44x44 pixels recommended for mobile

5. **Motion**
   - Respect `prefers-reduced-motion`
   - Pause/stop controls for animations
   - 3D scene fallback for motion-sensitive users

### Testing
- Lighthouse accessibility audit (target 100)
- Manual testing with VoiceOver/NVDA
- Keyboard-only navigation test

---

## Part 4: Content Architecture

### Pages

1. **Home (`/`)**
   - Hero: Name, tagline, CTA
   - 3D black hole animation (lazy loaded)
   - Featured projects (3 max)
   - Newsletter signup
   - Social links

2. **Projects (`/projects`)**
   - Grid of all projects
   - Filter by tech stack
   - Each card: title, description, tech badges

3. **Project Detail (`/projects/[slug]`)**
   - Case study format:
     - Problem/Challenge
     - Solution/Approach
     - Tech Stack
     - Screenshots/Demo
     - Learnings
     - Links (GitHub, Live)

4. **Blog (`/blog`)**
   - Post list with title, date, reading time, tags
   - Featured/pinned posts
   - Search/filter by tag

5. **Blog Post (`/blog/[slug]`)**
   - MDX content with code highlighting
   - Table of contents (sticky sidebar)
   - Newsletter CTA at end
   - Related posts

6. **About (`/about`)**
   - Personal story
   - Skills (visual)
   - Interests (humanizes you)
   - Optional: career timeline

7. **Contact (`/contact`)**
   - Simple form: name, email, message
   - Social links
   - Response time expectation

---

## Part 5: Tech Stack

### Core
```
Framework:     Next.js 15 (App Router)
Language:      TypeScript (strict mode)
Styling:       Tailwind CSS v4
Package Mgr:   pnpm
```

### Animation (GSAP - No React Three Fiber)
```
Animation:     GSAP 3 (GreenSock Animation Platform)
Scroll:        GSAP ScrollTrigger (scroll-driven animations)
Smooth Scroll: GSAP ScrollSmoother (optional)
Page Trans:    Framer Motion (route transitions)
```

### Content
```
Blog:          MDX (next-mdx-remote)
Syntax:        Shiki or rehype-pretty-code
```

### Forms & Email
```
Contact Form:  Resend API (3000 free/month)
Newsletter:    ConvertKit (1000 free subscribers)
```

### SEO & Analytics
```
SEO:           next-seo + JSON-LD
Sitemap:       next-sitemap
Analytics:     Vercel Analytics (free)
```

### Theme
```
Theme Toggle:  next-themes (dark/light, system default)
```

---

## Part 6: File Structure

```
portfolio/
├── app/
│   ├── layout.tsx           # Root layout, theme provider, fonts
│   ├── page.tsx             # Homepage
│   ├── projects/
│   │   ├── page.tsx         # Projects grid
│   │   └── [slug]/page.tsx  # Project detail
│   ├── blog/
│   │   ├── page.tsx         # Blog listing
│   │   └── [slug]/page.tsx  # Blog post
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       ├── contact/route.ts # Resend integration
│       └── subscribe/route.ts # ConvertKit integration
│
├── components/
│   ├── animations/
│   │   ├── ScrollReveal.tsx   # GSAP scroll reveal wrapper
│   │   ├── InkText.tsx        # Ink writing animation
│   │   ├── ParallaxBg.tsx     # Parallax background
│   │   └── GoldShimmer.tsx    # Gold hover effect
│   ├── decorative/
│   │   ├── OrnateFrame.tsx    # Decorative corner frames
│   │   ├── SectionDivider.tsx # Elvish divider patterns
│   │   └── WaxSeal.tsx        # Category/tag icons
│   ├── ui/                    # Buttons, cards, inputs
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Newsletter.tsx
│   └── ThemeToggle.tsx
│
├── content/
│   ├── projects/              # MDX project files
│   └── blog/                  # MDX blog posts
│
├── lib/
│   ├── mdx.ts                 # MDX utilities
│   ├── gsap.ts                # GSAP initialization
│   └── utils.ts               # Helper functions
│
├── styles/
│   ├── globals.css            # Tailwind + CSS variables
│   └── parchment.css          # Parchment texture effects
│
└── public/
    ├── images/
    ├── textures/              # Parchment, paper textures
    ├── svg/                   # Ornate frames, dividers
    └── og/                    # Open Graph images
```

---

## Part 7: Implementation Phases

### Phase 1: Foundation
- [ ] Create new repo in Projects folder: `portfolio`
- [ ] Initialize Next.js 15 + TypeScript + Tailwind + pnpm
- [ ] Configure `next-themes` for dark/light toggle
- [ ] Set up folder structure
- [ ] Add Google Fonts (Cinzel, Crimson Pro)
- [ ] Create CSS variables for LOTR color palette
- [ ] Deploy to Vercel (sonalisharma.vercel.app)

### Phase 2: Theme & Decorative Elements
- [ ] Create parchment texture CSS (feTurbulence filter)
- [ ] Build OrnateFrame component (SVG corners)
- [ ] Build SectionDivider component (elvish patterns)
- [ ] Style buttons with gold borders
- [ ] Add gold shimmer hover effect
- [ ] Create base layout (header, footer, navigation)

### Phase 3: GSAP Animations
- [ ] Install GSAP + ScrollTrigger
- [ ] Create ScrollReveal wrapper component
- [ ] Build InkText animation (writing effect)
- [ ] Add parallax background
- [ ] Implement hero scroll unroll effect
- [ ] Add reduced-motion fallback

### Phase 4: Core Pages
- [ ] Homepage with animated hero
- [ ] About page (scroll-driven story)
- [ ] Contact page with styled form
- [ ] Projects grid with card flip
- [ ] Project detail template

### Phase 5: Blog System
- [ ] Set up MDX with next-mdx-remote
- [ ] Blog listing page
- [ ] Blog post template with TOC
- [ ] Code syntax highlighting (Shiki)
- [ ] Add illuminated drop caps
- [ ] Write 1-2 initial posts

### Phase 6: Newsletter & SEO
- [ ] Integrate ConvertKit signup
- [ ] Add JSON-LD structured data
- [ ] Configure meta tags + OG images
- [ ] Generate sitemap + robots.txt
- [ ] Add Vercel Analytics

### Phase 7: CI/CD Pipeline
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add lint, type-check, build scripts to package.json
- [ ] Test workflow on feature branch PR
- [ ] Set up branch protection rules on main
- [ ] Verify Vercel preview deployments work

### Phase 8: Polish & Launch
- [ ] Performance optimization (Lighthouse 90+)
- [ ] Accessibility audit (target 100)
- [ ] Mobile responsiveness testing
- [ ] Connect custom domain (optional)
- [ ] Update GitHub profile with link

---

## Part 8: Pre-Launch Checklist

- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 100
- [ ] Lighthouse SEO 100
- [ ] All pages load < 2.5s (LCP)
- [ ] No CLS issues
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Forms work (contact, newsletter)
- [ ] OG images render correctly
- [ ] Sitemap submitted to Google Search Console
- [ ] Analytics tracking verified

---

## Sources

- [Core Web Vitals - Google](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [How to Improve Core Web Vitals 2025](https://owdt.com/insight/how-to-improve-core-web-vitals/)
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)
- [Structured Data for SEO](https://comms.thisisdefinition.com/insights/ultimate-guide-to-structured-data-for-seo)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG21/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [Lee Robinson's Portfolio](https://github.com/leerob/leerob.io)
- [Developer Portfolio Best Practices - Codementor](https://www.codementor.io/learn-programming/12-important-things-to-include-in-web-dev-portfolios)
