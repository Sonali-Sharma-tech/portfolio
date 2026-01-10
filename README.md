<div align="center">

# ✨ Sonali Sharma | Portfolio

**Throwing thoughts into the void & building what emerges**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[**View Live**](https://sonalisharma.dev) · [**GitHub**](https://github.com/Sonali-Sharma-tech) · [**LinkedIn**](https://linkedin.com/in/sonali-sharma110114)

</div>

---

## Preview

<div align="center">

| Home | Projects | About |
|:---:|:---:|:---:|
| Cinematic hero with floating orbs | Gallery with GitHub integration | Interactive skill showcase |

</div>

---

## Features

### Visual Excellence
- **Floating Gradient Orbs** — Animated purple, pink & cyan orbs creating depth
- **Naturalistic Fireflies** — Bioluminescent particles with realistic glow
- **Glassmorphism UI** — Frosted glass effects with backdrop blur
- **Scroll Animations** — Elements animate into view as you scroll
- **Rainbow Border Hovers** — Gradient borders on interactive elements

### Technical Highlights
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with CSS variables
- **Server-Side Rendering** with static generation
- **Responsive Design** — Mobile-first approach
- **Reduced Motion Support** — Accessibility-friendly

### Pages
| Page | Description |
|------|-------------|
| `/` | Hero section, featured projects, blog preview, CTA |
| `/projects` | Full project gallery linking to GitHub repos |
| `/blog` | Article list with featured post highlight |
| `/about` | Personal info, skills, interests, contact |

---

## Tech Stack

```
Frontend        Next.js 16 · React 19 · TypeScript
Styling         Tailwind CSS v4 · CSS Animations
Fonts           Cinzel (headings) · JetBrains Mono (code)
Effects         Custom CSS keyframes · Scroll-driven animations
Deployment      Vercel (recommended)
```

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Sonali-Sharma-tech/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── projects/         # Projects page
│   ├── blog/             # Blog pages
│   ├── about/            # About page
│   ├── globals.css       # Global styles & animations
│   └── layout.tsx        # Root layout
├── components/
│   ├── effects/          # Fireflies, particles
│   ├── layout/           # Header, footer, mobile nav
│   └── ui/               # Reusable UI components
└── lib/
    ├── projects.ts       # Project data
    └── posts.ts          # Blog post data
```

---

## Customization

### Update Projects
Edit `src/lib/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    slug: "your-project",
    title: "Your Project Name",
    description: "What it does...",
    tags: ["React", "TypeScript"],
    featured: true,
    github: "https://github.com/you/project",
  },
];
```

### Update Personal Info
- **About page**: `src/app/about/page.tsx`
- **Footer**: `src/components/layout/footer.tsx`
- **Social links**: Update GitHub, LinkedIn, email

### Adjust Colors
Edit CSS variables in `src/app/globals.css`:

```css
--color-purple: #7c3aed;
--color-pink: #ec4899;
--color-cyan: #06b6d4;
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sonali-Sharma-tech/portfolio)

### Other Platforms
Works with any platform supporting Node.js:
- Netlify
- Railway
- Render
- Self-hosted

---

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **Static Generation**: Pages pre-rendered at build time
- **Optimized Fonts**: Local font files, no external requests
- **Minimal JavaScript**: CSS-driven animations

---

## License

MIT License — feel free to use this as a template for your own portfolio.

---

<div align="center">

**Built with Next.js & deployed on Vercel**

Made with 💜 by [Sonali Sharma](https://github.com/Sonali-Sharma-tech)

</div>
