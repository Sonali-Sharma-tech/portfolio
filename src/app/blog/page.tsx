import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "BLOG | SONALI.SH",
  description: "Articles on web development, React, TypeScript, and software engineering best practices.",
};

function SignalStrength({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 transition-all duration-300 ${
            bar <= strength
              ? "bg-green shadow-[0_0_6px_rgba(0,255,65,0.8)]"
              : "bg-text-muted/20"
          }`}
          style={{ height: `${bar * 20}%` }}
        />
      ))}
    </div>
  );
}

function PostStatus({ isLatest }: { isLatest: boolean }) {
  if (isLatest) {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
        </span>
        <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">
          LATEST
        </span>
      </div>
    );
  }
  return null;
}

export default function BlogPage() {
  const posts = getAllPosts();
  const currentTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  return (
    <>
      {/* ========================================
          BLOG HERO - Header Section
          ======================================== */}
      <section className="hero-compact">
        <div className="container relative z-10">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8 py-3 px-4 border border-border/50 bg-space-surface/30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-green uppercase tracking-widest">
                  ACTIVELY WRITING
                </span>
              </div>
              <span className="text-border">|</span>
              <span className="text-[10px] font-mono text-text-muted">
                @sonali.sharma
              </span>
            </div>
            <span className="text-[10px] font-mono text-text-muted hidden sm:block">
              Last updated: {currentTimestamp.split(" ")[0]}
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left - Blog Title */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-cyan/50 bg-cyan/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan uppercase tracking-[0.3em] block">
                    DEVELOPER
                  </span>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                    BLOG
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-4 leading-none">
                <span className="text-gradient-cyber">THOUGHTS</span>
                <br />
                <span className="text-text-primary">& CODE</span>
              </h1>

              <p className="text-text-secondary font-mono text-sm mb-6 leading-relaxed max-w-sm">
                {">"} Sharing what I learn about web development, React, TypeScript,
                and building better software.
              </p>

              {/* Blog Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 border border-border/50 bg-space-surface/30">
                  <div className="text-2xl font-mono font-bold text-cyan">{posts.length}</div>
                  <div className="text-[10px] font-mono text-text-muted uppercase">Articles</div>
                </div>
                <div className="p-3 border border-border/50 bg-space-surface/30">
                  <div className="text-2xl font-mono font-bold text-magenta">
                    {[...new Set(posts.flatMap(p => p.tags || []))].length}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted uppercase">Topics</div>
                </div>
                <div className="p-3 border border-border/50 bg-space-surface/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-green">5+</span>
                  </div>
                  <div className="text-[10px] font-mono text-text-muted uppercase">Years Exp</div>
                </div>
              </div>
            </div>

            {/* Right - Interactive Article Finder */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-square max-w-md mx-auto lg:ml-auto">
                {/* Radar circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-cyan/10" />
                  <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan/15" />
                  <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan/20" />
                  <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan/30" />

                  {/* Cross lines */}
                  <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
                  <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

                  {/* Scanning beam */}
                  <div className="absolute w-1/2 h-1 bg-gradient-to-r from-cyan/60 to-transparent origin-left radar-sweep" />

                  {/* Center dot */}
                  <div className="absolute w-3 h-3 bg-cyan rounded-full shadow-[0_0_20px_rgba(0,255,245,0.8)]" />
                </div>

                {/* Blog post blips on radar */}
                {posts.slice(0, 3).map((post, index) => {
                  const angles = [45, 160, 280];
                  const distances = [35, 55, 75];
                  const angle = angles[index];
                  const distance = distances[index];
                  const x = 50 + distance * 0.4 * Math.cos((angle * Math.PI) / 180);
                  const y = 50 + distance * 0.4 * Math.sin((angle * Math.PI) / 180);

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="absolute group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative">
                        <span
                          className={`absolute inset-0 rounded-full animate-ping ${
                            index === 0 ? "bg-cyan" : index === 1 ? "bg-magenta" : "bg-green"
                          }`}
                          style={{ animationDuration: `${2 + index}s` }}
                        />
                        <span
                          className={`relative flex h-3 w-3 rounded-full ${
                            index === 0 ? "bg-cyan shadow-[0_0_12px_rgba(0,255,245,0.8)]" :
                            index === 1 ? "bg-magenta shadow-[0_0_12px_rgba(255,0,255,0.8)]" :
                            "bg-green shadow-[0_0_12px_rgba(0,255,65,0.8)]"
                          }`}
                        />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                        <div className="px-2 py-1 bg-space-void border border-cyan/30 text-[10px] font-mono text-cyan">
                          {post.title.slice(0, 25)}...
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan/40" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================
          ALL ARTICLES - Blog Posts
          ======================================== */}
      <section className="section pt-8">
        <div className="container">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs font-mono text-magenta uppercase tracking-widest">
                All Articles
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-magenta/50 to-transparent" />
            <span className="text-xs font-mono text-text-muted">
              {posts.length} posts
            </span>
          </div>

          {/* Posts Grid */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group block ${index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"}`}
              >
                <article className="relative overflow-hidden border border-border/50 bg-space-surface/20 backdrop-blur-sm transition-all duration-500 hover:border-cyan/50 hover:bg-space-surface/40">
                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent scan-line" />
                  </div>

                  {/* Left accent strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                    index === 0
                      ? "bg-gradient-to-b from-cyan via-cyan to-cyan/50"
                      : "bg-gradient-to-b from-magenta/50 via-magenta/30 to-transparent group-hover:from-cyan group-hover:via-cyan/50"
                  }`} />

                  <div className="p-5 md:p-6 pl-6 md:pl-8">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      {/* Left: Article Number & Status */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-text-muted uppercase">#</span>
                          <span className="text-sm font-mono text-cyan font-bold">
                            {String(posts.length - index).padStart(2, "0")}
                          </span>
                        </div>
                        <PostStatus isLatest={index === 0} />
                      </div>

                      {/* Right: Signal & Time */}
                      <div className="flex items-center gap-4">
                        <SignalStrength strength={5 - Math.min(index, 3)} />
                        <time
                          dateTime={post.date}
                          className="text-xs font-mono text-text-muted"
                        >
                          {formatDate(post.date)}
                        </time>
                      </div>
                    </div>

                    {/* Content Row */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-mono text-text-primary group-hover:text-cyan transition-colors duration-300 mb-2 line-clamp-1">
                          {post.title}
                        </h2>

                        <p className="text-sm font-mono text-text-muted line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && (
                          <div className="flex flex-wrap items-center gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] font-mono text-magenta bg-magenta/10 border border-magenta/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Action */}
                      <div className="flex items-center gap-4 md:flex-shrink-0">
                        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{post.readingTime}</span>
                        </div>

                        <div className="w-10 h-10 border border-border bg-space-surface/50 flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan transition-all duration-300">
                          <svg
                            className="w-4 h-4 text-text-muted group-hover:text-space-void transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================
          SUBSCRIBE - Stay Updated
          ======================================== */}
      <section className="section pt-8 pb-16">
        <div className="container">
          <div className="relative overflow-hidden border border-border/50 bg-space-surface/30 backdrop-blur-sm p-8 md:p-12">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 255, 245, 0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 245, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan/50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-[10px] font-mono text-cyan uppercase tracking-widest">
                    Stay Updated
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-display mb-2">
                  <span className="text-gradient-cyber">Never Miss</span>
                  <br />
                  <span className="text-text-primary">A New Post</span>
                </h2>

                <p className="text-text-muted font-mono text-sm max-w-md">
                  {"// Get notified when I publish new articles"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe%20to%20Blog"
                  className="btn-cyber"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Subscribe via Email</span>
                </Link>

                <Link
                  href="https://github.com/Sonali-Sharma-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-cyber"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Follow on GitHub</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
