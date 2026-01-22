import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | SONALI.SH",
  description: "Articles on web development, React, TypeScript, and software engineering best practices.",
};

export default function BlogPage() {
  const posts = getAllPosts();

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
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="py-4 border-b border-border/20 hover:border-cyan/30 transition-colors">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-2 text-xs font-mono text-text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-xs md:text-sm font-medium text-text-primary group-hover:text-cyan transition-colors mb-1">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-text-secondary line-clamp-2">
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
