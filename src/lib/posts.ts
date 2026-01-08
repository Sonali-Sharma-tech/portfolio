export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  tags?: string[];
}

// Replace with MDX files later - this is placeholder content
export const posts: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 15",
    excerpt:
      "A practical guide to setting up a new Next.js project with TypeScript, Tailwind, and best practices.",
    content: `
Next.js 15 brings exciting new features that make building web applications even better.

## What's New

The latest version includes Turbopack as the default bundler, React 19 support, and improved caching.

## Setting Up

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind
\`\`\`

## Project Structure

A typical Next.js 15 project looks like:

\`\`\`
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
  lib/
\`\`\`

## Key Concepts

1. **App Router** - File-based routing in the app directory
2. **Server Components** - Components that render on the server by default
3. **Server Actions** - Functions that run on the server

More content to come...
    `.trim(),
    date: "2024-01-15",
    readingTime: "5 min read",
    tags: ["Next.js", "React", "Tutorial"],
  },
  {
    slug: "typescript-tips",
    title: "TypeScript Tips I Wish I Knew Earlier",
    excerpt:
      "Practical TypeScript patterns that will make your code more maintainable and type-safe.",
    content: `
After years of writing TypeScript, here are patterns I wish I'd learned sooner.

## 1. Use \`satisfies\` for Type Checking

\`\`\`typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies Config;
\`\`\`

## 2. Discriminated Unions

\`\`\`typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
\`\`\`

## 3. Template Literal Types

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
\`\`\`

More tips coming...
    `.trim(),
    date: "2024-01-10",
    readingTime: "8 min read",
    tags: ["TypeScript", "JavaScript"],
  },
  {
    slug: "building-accessible-forms",
    title: "Building Accessible Forms in React",
    excerpt:
      "How to create forms that work for everyone, including keyboard and screen reader users.",
    content: `
Accessibility isn't optional - it's essential for reaching all users.

## Label Everything

\`\`\`tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
\`\`\`

## Announce Errors

Use aria-live regions to announce form errors to screen readers.

## Keyboard Navigation

Ensure all form controls are reachable via Tab key.

More patterns coming...
    `.trim(),
    date: "2024-01-05",
    readingTime: "6 min read",
    tags: ["Accessibility", "React"],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
