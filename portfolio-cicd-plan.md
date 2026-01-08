# Portfolio CI/CD Pipeline Plan

## Overview

Automated checks and deployments for the portfolio website using **GitHub Actions** + **Vercel**.

---

## Is CI/CD Required?

**Yes - adding it to learn how to build CI/CD pipelines.**

| Benefit | Why It Matters |
|---------|----------------|
| Learn GitHub Actions | Industry-standard skill |
| Understand automation | Essential for any team role |
| Build professional habits | Good for interviews |
| Portfolio showcase | "I built the CI/CD too" |

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Push to feature/*  ──────►  GitHub Actions             │
│         │                         │                      │
│         │                    ┌────┴────┐                │
│         │                    │  Lint   │                │
│         │                    │  Type   │                │
│         │                    │  Build  │                │
│         │                    └────┬────┘                │
│         │                         │                      │
│         ▼                         ▼                      │
│  Create PR  ──────────────►  Vercel Preview             │
│         │                    (auto-deploy)               │
│         │                         │                      │
│         ▼                         ▼                      │
│  Merge to main  ──────────►  Vercel Production          │
│                              (auto-deploy)               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## What Gets Automated

### On Every Push/PR

| Check | Purpose | Time |
|-------|---------|------|
| **Lint** | Code style (Biome/ESLint) | ~10s |
| **Type Check** | TypeScript errors | ~20s |
| **Build** | Catches build failures | ~60s |

### On PR Creation

| Action | Purpose |
|--------|---------|
| **Vercel Preview** | Live preview URL for testing (automatic) |
| **PR Comment** | Preview link posted to PR |

### On Merge to Main

| Action | Purpose |
|--------|---------|
| **Vercel Production** | Auto-deploy to production (automatic) |

---

## GitHub Actions Workflow

### File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Build
        run: pnpm build
```

---

## Package.json Scripts

Add these scripts for CI:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "type-check": "tsc --noEmit",
    "format": "biome format --write ."
  }
}
```

---

## Vercel Configuration

Vercel handles deployments automatically. No extra config needed.

### What Vercel Does Automatically

| Trigger | Action |
|---------|--------|
| PR opened/updated | Creates preview deployment |
| PR merged to main | Deploys to production |
| Comments on PR | Adds preview URL |

### Optional: vercel.json

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## Branch Protection Rules (Recommended)

Set up on GitHub: **Settings → Branches → Add rule**

| Rule | Setting |
|------|---------|
| Branch name pattern | `main` |
| Require PR before merging | ✅ |
| Require status checks | ✅ |
| Required checks | `ci` (the GitHub Action) |
| Require branches up to date | ✅ |

This prevents:
- Direct pushes to main
- Merging PRs with failing checks

---

## Future Enhancements (Optional)

### Phase 2: Add Testing

```yaml
- name: Run tests
  run: pnpm test
```

### Phase 3: Lighthouse CI

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      ${{ steps.vercel.outputs.preview-url }}
    budgetPath: ./lighthouse-budget.json
```

### Phase 4: Security Scanning

```yaml
- name: Security audit
  run: pnpm audit
```

---

## Implementation Steps

### Step 1: Create GitHub Actions Workflow
```bash
mkdir -p .github/workflows
# Create ci.yml with content above
```

### Step 2: Add Scripts to package.json
```bash
# Add lint, type-check scripts
```

### Step 3: Connect Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Link project
vercel link

# Or just import from Vercel dashboard
```

### Step 4: Set Branch Protection
```
GitHub → Settings → Branches → Add rule for "main"
```

---

## Cost

| Service | Cost |
|---------|------|
| GitHub Actions | Free (2000 min/month) |
| Vercel | Free (hobby tier) |
| **Total** | **$0** |

---

## Summary

**Minimal CI/CD for portfolio:**

1. **GitHub Actions** - Lint, type-check, build on every PR
2. **Vercel** - Auto-deploy previews and production
3. **Branch protection** - Require checks before merge

This setup is:
- Free
- Takes 10 minutes to set up
- Catches 90% of issues before they hit production
- Professional workflow for your portfolio

---

## When to Set This Up

**Phase 7 in the portfolio plan** - after Newsletter & SEO, before Polish & Launch.

This timing ensures:
1. Project is functional before adding CI/CD
2. You have actual code to lint/type-check/build
3. PRs will have meaningful content to test
