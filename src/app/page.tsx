import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { blogSource, type BlogPage } from "@/lib/source";
import { TerminalHero } from "@/components/sections/terminal-hero";
import { SkillBars } from "@/components/sections/skill-bars";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3);
  const recentPosts = (blogSource.getPages() as BlogPage[])
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 3);

  return (
    <>
      {/* ========================================
          HERO - Terminal in Space
          ======================================== */}
      <TerminalHero />

      {/* Skills marquee */}
      <div className="marquee">
        <div className="marquee-content">
          <span className="text-cyan">REACT</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">TYPESCRIPT</span>
          <span className="text-magenta">◆</span>
          <span className="text-cyan">NEXT.JS</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">NODE.JS</span>
          <span className="text-magenta">◆</span>
          <span className="text-cyan">GRAPHQL</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">TAILWIND</span>
          <span className="text-magenta">◆</span>
          <span className="text-cyan">MONGODB</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">POSTGRESQL</span>
          <span className="text-magenta">◆</span>
          <span className="text-cyan">REACT</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">TYPESCRIPT</span>
          <span className="text-magenta">◆</span>
          <span className="text-cyan">NEXT.JS</span>
          <span className="text-magenta">◆</span>
          <span className="text-green">NODE.JS</span>
          <span className="text-magenta">◆</span>
        </div>
      </div>

      {/* ========================================
          PROJECTS - Holographic Cards
          ======================================== */}
      <section className="section relative">
        <div className="container">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="scroll-reveal">
              <p className="section-label mb-4">MISSION_LOG</p>
              <h2 className="text-gradient-cyber">
                Featured Projects
              </h2>
            </div>
            <div className="scroll-reveal">
              <Link href="/projects" className="link-cyber text-lg">
                [VIEW ALL MISSIONS] →
              </Link>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {/* Featured project - large */}
            <div className="bento-large scroll-slide-left">
              <Link
                href={featuredProjects[0]?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="holo-card group h-full flex flex-col"
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan/30 bg-cyan/5 mb-6">
                      <span className="w-2 h-2 bg-cyan animate-pulse" />
                      <span className="text-xs font-mono text-cyan uppercase tracking-wider">
                        PRIORITY_1
                      </span>
                    </div>
                    <h3 className="bento-card-title text-3xl md:text-4xl">
                      {featuredProjects[0]?.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mt-4 max-w-lg font-mono text-sm">
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
                <div className="absolute bottom-8 right-8 w-12 h-12 border border-cyan/30 flex items-center justify-center group-hover:bg-cyan group-hover:border-cyan transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-cyan group-hover:text-space-void transition-colors"
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
                className="holo-card group h-full flex flex-col"
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <h3 className="bento-card-title">
                      {featuredProjects[1]?.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mt-3 font-mono">
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
            <div className="bento-small scroll-scale">
              <Link
                href={featuredProjects[2]?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="holo-card group h-full flex flex-col"
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
            <div className="bento-small scroll-glitch">
              <div className="holo-card h-full flex flex-col items-center justify-center text-center">
                <span className="stat-number">27+</span>
                <span className="text-text-muted font-mono text-xs uppercase tracking-wider mt-2">
                  REPOSITORIES
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-cyan to-magenta mt-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-cyber" />
      </div>

      {/* ========================================
          SKILLS - Terminal Progress Bars
          ======================================== */}
      <SkillBars />

      {/* Divider */}
      <div className="container">
        <div className="divider-cyber" />
      </div>

      {/* ========================================
          BLOG - Transmission Logs
          ======================================== */}
      <section className="section relative">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="scroll-reveal">
              <p className="section-label mb-4">TRANSMISSION_LOG</p>
              <h2 className="text-gradient-cyber">Latest Transmissions</h2>
            </div>
            <div className="scroll-reveal">
              <Link href="/blog" className="link-cyber text-lg">
                [VIEW ALL LOGS] →
              </Link>
            </div>
          </div>

          {/* Blog posts as transmission cards */}
          <div className="grid gap-6 max-w-5xl">
            {recentPosts.map((post, index) => (
              <article
                key={post.slugs[0]}
                className={`group ${
                  index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"
                }`}
              >
                <Link
                  href={post.url}
                  className="transmission-card block relative overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-br from-space-deep/80 to-space-void/90 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-cyan/50 hover:shadow-[0_0_40px_rgba(0,255,245,0.15),inset_0_0_60px_rgba(0,255,245,0.03)] hover:-translate-y-1"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan/0 group-hover:border-cyan/60 transition-all duration-300 rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-magenta/0 group-hover:border-magenta/60 transition-all duration-300 rounded-br-lg" />

                  <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    {/* Left: Transmission number & date */}
                    <div className="flex-shrink-0 md:w-32">
                      <div className="text-4xl font-mono font-bold text-cyan/20 group-hover:text-cyan/40 transition-colors mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <time
                        dateTime={post.data.date}
                        className="text-xs font-mono text-green tracking-wider flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-green rounded-full" />
                        {formatDate(post.data.date)}
                      </time>
                    </div>

                    {/* Center: Content */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-display mb-3 text-text-primary group-hover:text-cyan transition-all duration-300 group-hover:translate-x-2">
                        {post.data.title}
                      </h3>
                      <p className="text-text-secondary text-sm font-mono leading-relaxed line-clamp-2">
                        {post.data.excerpt}
                      </p>
                    </div>

                    {/* Right: Reading time & arrow */}
                    <div className="flex md:flex-col items-center md:items-end gap-4 flex-shrink-0">
                      <span className="px-3 py-1 text-xs font-mono text-cyan/70 border border-cyan/20 rounded-full group-hover:border-cyan/50 group-hover:bg-cyan/10 transition-all">
                        {post.data.readingTime}
                      </span>
                      <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan group-hover:shadow-[0_0_20px_rgba(0,255,245,0.4)] transition-all duration-300">
                        <svg
                          className="w-5 h-5 text-text-muted group-hover:text-space-void transition-colors group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom decorative line */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent group-hover:via-cyan/40 transition-all" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-cyber" />
      </div>

      {/* ========================================
          CTA - Hail Frequencies
          ======================================== */}
      <section className="section relative overflow-hidden">
        <div className="container relative z-10 text-center">
          <div className="scroll-reveal">
            <p className="section-label justify-center mb-8">
              ESTABLISH_CONNECTION
            </p>
          </div>

          <div className="scroll-scale">
            <h2 className="text-5xl md:text-7xl lg:text-8xl mb-8">
              <span className="block text-text-muted">READY TO</span>
              <span className="block text-gradient-cyber glitch" data-text="COLLABORATE?">
                COLLABORATE?
              </span>
            </h2>
          </div>

          <div className="scroll-reveal">
            <p className="max-w-lg mx-auto text-lg text-text-secondary leading-relaxed mb-12 font-mono">
              <span>{"// OPEN TRANSMISSION CHANNEL"}</span>
              <br />
              <span>{"// AWAITING YOUR SIGNAL..."}</span>
            </p>
          </div>

          <div className="scroll-glitch flex flex-wrap justify-center gap-4">
            <Link
              href="mailto:sonali.sharma110114@gmail.com"
              className="btn-cyber text-lg"
            >
              <span>INITIATE CONTACT</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="https://github.com/Sonali-Sharma-tech"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-cyber"
            >
              <span>VIEW GITHUB</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
