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
    <section className="section">
      <div className="container max-w-4xl">
        {/* Simple Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-display mb-3">
            <span className="text-gradient-cyber">Blog</span>
          </h1>
          <p className="text-text-secondary font-mono text-sm">
            Thoughts on web development, React, TypeScript, and building better software.
          </p>
        </header>

        {/* Blog Posts List */}
        <div className="space-y-8">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`group ${index !== posts.length - 1 ? "pb-8 border-b border-border/30" : ""}`}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Date & Reading Time */}
                <div className="flex items-center gap-3 text-xs font-mono text-text-muted mb-2">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="text-border">•</span>
                  <span>{post.readingTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-display text-text-primary group-hover:text-cyan transition-colors mb-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-magenta"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>

        {/* Subscribe CTA - Simple */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-text-muted text-sm font-mono mb-3">
            Want to get notified when I publish new articles?
          </p>
          <Link
            href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe%20to%20Blog"
            className="text-cyan hover:text-magenta transition-colors text-sm font-mono"
          >
            Subscribe via email →
          </Link>
        </div>
      </div>
    </section>
  );
}
