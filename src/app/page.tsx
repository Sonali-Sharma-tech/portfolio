import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { getAllPosts, formatDate } from "@/lib/posts";
import { Fireflies } from "@/components/effects/nature-elements";

export default function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3);
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ========================================
          HERO - Cinematic Opening
          ======================================== */}
      <section className="hero relative">
        {/* Floating gradient orbs */}
        <div className="orb orb-purple" />
        <div className="orb orb-pink" />
        <div className="orb orb-cyan" />

        {/* Naturalistic fireflies */}
        <Fireflies count={25} />

        {/* Central morphing blob */}
        <div className="hero-blob" />

        <div className="container relative z-10">
          {/* Main headline - MASSIVE & DRAMATIC */}
          <h1 className="mb-8">
            <span className="block text-reveal">
              <span className="text-reveal-inner text-text-muted font-light">Hi, I&apos;m</span>
            </span>
            <span className="block text-reveal">
              <span className="text-reveal-inner text-gradient text-glow">
                Sonali
              </span>
            </span>
          </h1>

          {/* Animated role text */}
          <div className="overflow-hidden mb-12">
            <p className="text-2xl md:text-4xl font-cinzel text-text-secondary float-delayed">
              I build{" "}
              <span className="text-purple-light">digital experiences</span>{" "}
              that feel like{" "}
              <span className="text-pink-light">magic</span>
            </p>
          </div>

          {/* CTAs with magnetic effect */}
          <div className="flex flex-wrap gap-6">
            <Link href="/projects" className="btn-magic group">
              <span>See My Work</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about" className="btn-ghost group">
              <span>About Me</span>
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse ml-2" />
            </Link>
          </div>
        </div>

        {/* Floating tech icons - ambient decoration */}
        <div className="absolute bottom-20 right-10 opacity-20 hidden lg:block">
          <div className="text-6xl font-mono text-purple animate-float">&lt;/&gt;</div>
        </div>
        <div className="absolute top-40 right-20 opacity-10 hidden lg:block">
          <div className="text-4xl font-mono text-pink animate-float" style={{ animationDelay: "-2s" }}>&#123;&#125;</div>
        </div>
      </section>

      {/* Glowing divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple to-transparent opacity-50" />

      {/* Skills showcase - horizontal scroll */}
      <div className="py-8 border-y border-border overflow-hidden bg-bg-glass">
        <div className="marquee">
          <div className="marquee-content text-text-muted">
            <span className="text-purple-light">React</span>
            <span>✦</span>
            <span className="text-pink-light">TypeScript</span>
            <span>✦</span>
            <span className="text-cyan-light">Next.js</span>
            <span>✦</span>
            <span className="text-purple-light">Node.js</span>
            <span>✦</span>
            <span className="text-pink-light">GraphQL</span>
            <span>✦</span>
            <span className="text-cyan-light">Tailwind</span>
            <span>✦</span>
            <span className="text-purple-light">React</span>
            <span>✦</span>
            <span className="text-pink-light">TypeScript</span>
            <span>✦</span>
            <span className="text-cyan-light">Next.js</span>
            <span>✦</span>
            <span className="text-purple-light">Node.js</span>
            <span>✦</span>
            <span className="text-pink-light">GraphQL</span>
            <span>✦</span>
            <span className="text-cyan-light">Tailwind</span>
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* ========================================
          PROJECTS - Stunning Bento Grid
          ======================================== */}
      <section className="section relative">
        <div className="container">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="scroll-reveal">
              <p className="section-label mb-4">Featured Work</p>
              <h2 className="text-gradient">Selected Projects</h2>
            </div>
            <div className="scroll-reveal">
              <Link href="/projects" className="link-glow text-lg">
                View all projects →
              </Link>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {/* Featured project - large */}
            <div className="bento-large scroll-scale-rotate">
              <Link
                href={featuredProjects[0]?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-card bento-featured group h-full"
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
                      <span className="text-xs font-mono text-purple-light uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                    <h3 className="bento-card-title text-3xl md:text-4xl">
                      {featuredProjects[0]?.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mt-4 max-w-lg">
                      {featuredProjects[0]?.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-8">
                    {featuredProjects[0]?.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                {/* GitHub icon */}
                <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-purple/30 flex items-center justify-center group-hover:bg-purple group-hover:border-purple transition-all duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-purple group-hover:text-white transition-colors duration-500"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Second project */}
            <div className="bento-medium scroll-slide-right">
              <Link
                href={featuredProjects[1]?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-card group h-full"
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <h3 className="bento-card-title">
                      {featuredProjects[1]?.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mt-3">
                      {featuredProjects[1]?.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {featuredProjects[1]?.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>

            {/* Third project */}
            <div className="bento-small scroll-flip">
              <Link
                href={featuredProjects[2]?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-card group h-full"
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <h3 className="bento-card-title text-xl">
                    {featuredProjects[2]?.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {featuredProjects[2]?.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>

            {/* Stats card */}
            <div className="bento-small scroll-blur">
              <div className="bento-card h-full flex flex-col items-center justify-center text-center">
                <span className="stat-number">27+</span>
                <span className="text-text-muted font-mono text-sm uppercase tracking-wider mt-2">
                  Repositories
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider">
          <div className="divider-icon" />
        </div>
      </div>

      {/* ========================================
          BLOG - Elegant List
          ======================================== */}
      <section className="section relative">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="scroll-reveal">
              <p className="section-label mb-4">From the Blog</p>
              <h2 className="text-gradient">Latest Thoughts</h2>
            </div>
            <div className="scroll-reveal">
              <Link href="/blog" className="link-glow text-lg">
                Read all posts →
              </Link>
            </div>
          </div>

          {/* Blog posts */}
          <div className="max-w-4xl space-y-0">
            {recentPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`group border-b border-border last:border-b-0 ${
                  index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"
                }`}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-10 transition-all duration-500 -mx-6 px-6 rounded-2xl hover:bg-purple/5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Date */}
                    <div className="flex-shrink-0 md:w-32">
                      <time
                        dateTime={post.date}
                        className="text-sm font-mono text-purple-light tracking-wide"
                      >
                        {formatDate(post.date)}
                      </time>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-cinzel mb-2 text-text-primary group-hover:text-gradient transition-all duration-500">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                      <span className="text-xs font-mono text-text-muted">{post.readingTime}</span>
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-purple group-hover:bg-purple/10 transition-all duration-500">
                        <svg
                          className="w-4 h-4 text-text-muted group-hover:text-purple group-hover:translate-x-1 transition-all duration-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider">
          <div className="divider-icon" />
        </div>
      </div>

      {/* ========================================
          CTA - Make It Irresistible
          ======================================== */}
      <section className="section relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple" style={{ top: "20%", left: "20%", opacity: 0.4 }} />
          <div className="orb orb-pink" style={{ bottom: "20%", right: "20%", opacity: 0.3 }} />
        </div>

        <div className="container relative z-10 text-center">
          <div className="scroll-blur">
            <p className="section-label justify-center mb-8">
              Let&apos;s Work Together
            </p>
          </div>

          <div className="scroll-scale">
            <h2 className="text-5xl md:text-7xl lg:text-8xl mb-8">
              <span className="block">Have a project</span>
              <span className="block text-gradient text-glow">in mind?</span>
            </h2>
          </div>

          <div className="scroll-reveal">
            <p className="max-w-lg mx-auto text-xl text-text-secondary leading-relaxed mb-12">
              I&apos;m always excited to collaborate on innovative projects.
              Let&apos;s create something extraordinary together.
            </p>
          </div>

          <div className="scroll-flip">
            <Link
              href="mailto:sonali.sharma110114@gmail.com"
              className="btn-magic text-lg px-12 py-6"
            >
              <span>Start a Conversation</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
