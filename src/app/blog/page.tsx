import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { Fireflies } from "@/components/effects/nature-elements";

export const metadata: Metadata = {
  title: "Blog | Sonali Sharma",
  description: "Thoughts on web development, software engineering, and building products.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="orb orb-pink" style={{ top: "20%", right: "20%" }} />
          <div className="orb orb-purple" style={{ bottom: "30%", left: "10%" }} />
          <Fireflies count={12} />
        </div>

        <div className="container relative z-10 text-center py-32">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink" />
            <span className="text-xs font-mono text-pink-light uppercase tracking-[0.3em]">
              Writings
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-cinzel mb-8">
            <span className="text-gradient text-glow">Blog</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights from my journey in{" "}
            <span className="text-purple-light">software development</span>.
            Learning out loud, one post at a time.
          </p>
        </div>
      </section>

      {/* Glowing divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-pink/50 to-transparent" />

      {/* ========================================
          FEATURED POST - Hero treatment
          ======================================== */}
      {featuredPost && (
        <section className="section">
          <div className="container">
            <div className="scroll-reveal mb-8">
              <p className="section-label">Latest Post</p>
            </div>

            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article className="relative overflow-hidden rounded-3xl border border-border bg-bg-elevated p-10 md:p-16 transition-all duration-700 hover:border-pink/50">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink/10 via-transparent to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Decorative number */}
                <div className="absolute -right-10 -top-10 text-[200px] font-cinzel font-bold text-border/30 pointer-events-none select-none group-hover:text-pink/10 transition-colors duration-700">
                  01
                </div>

                <div className="relative z-10 max-w-3xl">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <time
                      dateTime={featuredPost.date}
                      className="text-sm font-mono text-pink-light tracking-wide"
                    >
                      {formatDate(featuredPost.date)}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-sm font-mono text-text-muted">
                      {featuredPost.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
                      <span className="text-xs font-mono text-pink-light uppercase tracking-wider">
                        New
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel mb-6 text-text-primary group-hover:text-gradient transition-all duration-500">
                    {featuredPost.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xl text-text-secondary leading-relaxed mb-8">
                    {featuredPost.excerpt}
                  </p>

                  {/* Read more */}
                  <div className="flex items-center gap-4">
                    <span className="text-pink-light font-mono text-sm group-hover:translate-x-2 transition-transform duration-500">
                      Read the full article
                    </span>
                    <svg
                      className="w-5 h-5 text-pink group-hover:translate-x-2 transition-transform duration-500"
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
          </div>
        </section>
      )}

      {/* ========================================
          OTHER POSTS - Elegant list
          ======================================== */}
      {otherPosts.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <div className="scroll-reveal mb-12">
              <p className="section-label">More Articles</p>
            </div>

            <div className="space-y-6">
              {otherPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group block ${
                    index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"
                  }`}
                >
                  <article className="relative overflow-hidden rounded-2xl border border-border bg-bg-elevated p-8 transition-all duration-500 hover:border-purple/50 hover:bg-bg-glass">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-transparent to-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                      {/* Number */}
                      <div className="flex-shrink-0 hidden md:block">
                        <span className="text-5xl font-cinzel font-bold text-border group-hover:text-purple/30 transition-colors duration-500">
                          {String(index + 2).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <time
                            dateTime={post.date}
                            className="text-sm font-mono text-purple-light tracking-wide"
                          >
                            {formatDate(post.date)}
                          </time>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-sm font-mono text-text-muted">
                            {post.readingTime}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-cinzel mb-3 text-text-primary group-hover:text-gradient transition-all duration-500">
                          {post.title}
                        </h3>

                        <p className="text-text-secondary leading-relaxed max-w-2xl">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 hidden md:block">
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-purple group-hover:bg-purple transition-all duration-500">
                          <svg
                            className="w-5 h-5 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all duration-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
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
          NEWSLETTER CTA
          ======================================== */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple" style={{ bottom: "20%", left: "20%", opacity: 0.3 }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="scroll-blur">
              <p className="section-label justify-center mb-6">Stay Updated</p>
            </div>
            <div className="scroll-scale">
              <h2 className="text-4xl md:text-6xl font-cinzel mb-8">
                <span className="text-gradient">Never miss</span>
                <br />
                a new post
              </h2>
            </div>
            <div className="scroll-reveal">
              <p className="text-xl text-text-secondary mb-10 max-w-lg mx-auto">
                Get notified when I publish new articles about web development,
                design, and technology.
              </p>
            </div>
            <div className="scroll-flip">
              <Link href="mailto:hello@sonalisharma.dev?subject=Subscribe to Newsletter" className="btn-magic text-lg">
                <span>Subscribe via Email</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
