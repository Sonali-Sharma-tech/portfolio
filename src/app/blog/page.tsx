import type { Metadata } from "next";
import Link from "next/link";
import { blogSource, type BlogPage } from "@/lib/source";

export const metadata: Metadata = {
  title: "Blog | SONALI.SH",
  description:
    "Articles on web development, React, TypeScript, and software engineering best practices.",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = (blogSource.getPages() as BlogPage[]).sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Simple Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-display mb-2">Blog</h1>
          <p className="text-text-muted text-sm">
            Thoughts on code, craft, and building things.
          </p>
        </header>

        {/* Articles List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.slugs.join("/")} href={post.url} className="group block">
              <article className="py-4 border-b border-border/20 hover:border-cyan/30 transition-colors">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-2 text-xs font-mono text-text-muted">
                  <time dateTime={post.data.date}>
                    {formatDate(post.data.date)}
                  </time>
                  <span>·</span>
                  <span>{post.data.readingTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-xs md:text-sm font-medium text-text-primary group-hover:text-cyan transition-colors mb-1">
                  {post.data.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-text-secondary line-clamp-2">
                  {post.data.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
