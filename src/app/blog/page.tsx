import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | SONALI.SH",
  description: "Articles on web development, React, TypeScript, and software engineering best practices.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Editorial Header */}
        <header className="mb-16 text-center">
          <p className="text-xs font-mono text-cyan uppercase tracking-[0.3em] mb-4">
            Thoughts & Writings
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight">
            <span className="text-gradient-cyber">Blog</span>
          </h1>
        </header>

        {/* Featured Post - Hero Style */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block mb-20"
          >
            <article className="relative border border-cyan/20 bg-gradient-to-br from-space-deep/60 to-space-void/80 p-8 md:p-12 lg:p-16 transition-all duration-500 hover:border-cyan/40 hover:shadow-[0_0_60px_rgba(0,255,245,0.1)]">
              {/* Featured badge */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan/10 border border-cyan/30 text-[10px] font-mono text-cyan uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse" />
                  Featured
                </span>
              </div>

              {/* Content */}
              <div className="pt-8 md:pt-4">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-mono text-text-muted">
                  <time dateTime={featuredPost.date}>
                    {formatDate(featuredPost.date)}
                  </time>
                  <span className="w-1 h-1 bg-magenta rounded-full" />
                  <span>{featuredPost.readingTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-display leading-tight mb-6 text-text-primary group-hover:text-cyan transition-colors duration-300">
                  {featuredPost.title}
                </h2>

                {/* Excerpt */}
                <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mb-8">
                  {featuredPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                  {featuredPost.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono text-magenta border border-magenta/30 bg-magenta/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read arrow */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-text-muted group-hover:text-space-void transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Section divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            More Articles
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Other Posts - Editorial List */}
        <div className="space-y-0">
          {otherPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className={`py-10 ${index !== otherPosts.length - 1 ? "border-b border-border/30" : ""}`}>
                <div className="grid md:grid-cols-12 gap-6 items-start">
                  {/* Number */}
                  <div className="md:col-span-1 hidden md:block">
                    <span className="text-4xl font-display text-text-muted/20 group-hover:text-cyan/40 transition-colors">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-8">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-display leading-snug mb-3 text-text-primary group-hover:text-cyan transition-colors duration-300">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-text-secondary leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-magenta/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="md:col-span-3 flex md:flex-col md:items-end gap-4 md:gap-2 text-sm font-mono text-text-muted">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span className="text-cyan/70">{post.readingTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-border/30 text-center">
          <p className="text-text-muted font-mono text-sm mb-4">
            Want more? Subscribe for updates.
          </p>
          <Link
            href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe%20to%20Blog"
            className="inline-flex items-center gap-2 text-cyan hover:text-magenta transition-colors font-mono text-sm"
          >
            <span>Get notified</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
