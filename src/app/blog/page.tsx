import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "BLOG | SONALI.SH",
  description: "Thoughts on web development, software engineering, and building products.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      {/* ========================================
          COMPACT HERO - With Featured Post
          ======================================== */}
      <section className="hero-compact">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left - Title */}
            <div className="lg:w-1/3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-magenta animate-pulse" />
                <span className="text-xs font-mono text-magenta uppercase tracking-[0.3em]">
                  BLOG
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-display mb-4">
                <span className="text-gradient-cyber">THOUGHTS</span>
              </h1>

              <p className="text-text-secondary font-mono text-sm mb-6">
                Insights on web development, engineering practices, and lessons learned.
              </p>

              <div className="flex items-center gap-4 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-cyan">{posts.length}</span>
                  <span className="text-text-muted">articles</span>
                </div>
                <span className="text-border">|</span>
                <Link
                  href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe"
                  className="text-magenta hover:text-cyan transition-colors"
                >
                  Subscribe →
                </Link>
              </div>
            </div>

            {/* Right - Featured Post Card */}
            {featuredPost && (
              <div className="lg:w-2/3">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <article className="holo-card relative overflow-hidden p-6 md:p-8">
                    {/* New badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-cyan/10 border border-cyan/30 rounded-full">
                      <span className="w-1.5 h-1.5 bg-cyan animate-pulse rounded-full" />
                      <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">Latest</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left - Number */}
                      <div className="flex-shrink-0">
                        <span className="text-6xl font-mono font-bold text-magenta/20 group-hover:text-magenta/40 transition-colors">
                          01
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <time dateTime={featuredPost.date} className="text-sm font-mono text-green">
                            {formatDate(featuredPost.date)}
                          </time>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <span className="text-sm font-mono text-text-muted">{featuredPost.readingTime}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-mono mb-3 text-text-primary group-hover:text-cyan transition-colors">
                          {featuredPost.title}
                        </h2>

                        <p className="text-text-secondary text-sm font-mono mb-4 line-clamp-2">
                          {featuredPost.excerpt}
                        </p>

                        {featuredPost.tags && (
                          <div className="flex flex-wrap gap-2">
                            {featuredPost.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag text-[10px] py-1 px-2">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 self-center hidden md:block">
                        <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan transition-all duration-300">
                          <svg className="w-4 h-4 text-text-muted group-hover:text-space-void transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          OTHER POSTS - Clean list
          ======================================== */}
      {otherPosts.length > 0 && (
        <section className="section pt-12">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">More Articles</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-4">
              {otherPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group block ${index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"}`}
                >
                  <article className="holo-card relative overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Accent bar */}
                      <div className="hidden md:block w-1 bg-gradient-to-b from-magenta/30 to-transparent" />

                      <div className="flex-1 p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Number */}
                          <span className="flex-shrink-0 text-3xl font-mono font-bold text-magenta/20 group-hover:text-magenta/40 transition-colors">
                            {String(index + 2).padStart(2, "0")}
                          </span>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <time dateTime={post.date} className="text-xs font-mono text-green">
                                {formatDate(post.date)}
                              </time>
                              <span className="w-1 h-1 bg-border rounded-full" />
                              <span className="text-xs font-mono text-text-muted">{post.readingTime}</span>
                            </div>

                            <h3 className="text-lg font-mono text-text-primary group-hover:text-cyan transition-colors truncate">
                              {post.title}
                            </h3>
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 border border-border rounded flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan transition-all duration-300">
                              <svg className="w-3 h-3 text-text-muted group-hover:text-space-void transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
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
      )}

      {/* ========================================
          CTA - Compact inline
          ======================================== */}
      <section className="section pt-8 pb-16">
        <div className="container">
          <div className="holo-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display mb-3">
              <span className="text-text-muted">Stay</span>{" "}
              <span className="text-gradient-cyber">Updated</span>
            </h2>
            <p className="text-text-secondary font-mono text-sm mb-6 max-w-md mx-auto">
              {"// Get notified when I publish new articles"}
            </p>
            <Link href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe to Blog" className="btn-cyber">
              <span>Subscribe via Email</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
