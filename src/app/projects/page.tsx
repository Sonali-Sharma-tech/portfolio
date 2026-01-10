import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { Fireflies } from "@/components/effects/nature-elements";

export const metadata: Metadata = {
  title: "Projects | Sonali Sharma",
  description: "A collection of projects I've built, from web applications to open-source tools.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      {/* ========================================
          HERO SECTION - Dramatic entrance
          ======================================== */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="orb orb-purple" style={{ top: "10%", left: "10%" }} />
          <div className="orb orb-pink" style={{ bottom: "20%", right: "15%" }} />
          <Fireflies count={15} />
        </div>

        <div className="container relative z-10 text-center py-32">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple" />
            <span className="text-xs font-mono text-purple-light uppercase tracking-[0.3em]">
              Portfolio
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-cinzel mb-8">
            <span className="text-gradient text-glow">Projects</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A curated collection of work that represents my journey as a developer.
            Each project tells a story of{" "}
            <span className="text-purple-light">problems solved</span> and{" "}
            <span className="text-pink-light">lessons learned</span>.
          </p>

          {/* Animated scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-text-muted tracking-widest">Explore</span>
            <svg className="w-6 h-6 text-purple animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Glowing divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple/50 to-transparent" />

      {/* ========================================
          PROJECTS GRID
          ======================================== */}
      <section className="section">
        <div className="container">
          {/* Filter/Stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16">
            <div className="flex items-center gap-4">
              <span className="stat-number text-4xl">{projects.length}</span>
              <span className="text-text-muted font-mono text-sm uppercase tracking-wider">
                Projects<br />Completed
              </span>
            </div>
            <Link
              href="https://github.com/Sonali-Sharma-tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-purple transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-mono">View all on GitHub</span>
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative ${
                  index % 3 === 0 ? "scroll-slide-left" : index % 3 === 1 ? "scroll-scale" : "scroll-slide-right"
                }`}
              >
                <article className="project-card relative overflow-hidden rounded-3xl border border-border bg-bg-elevated p-8 md:p-12 transition-all duration-700 hover:border-purple/50 hover:bg-bg-glass">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Rainbow border effect on hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple via-pink to-cyan p-[1px]">
                      <div className="w-full h-full rounded-3xl bg-bg-elevated" />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                    {/* Project number */}
                    <div className="flex-shrink-0">
                      <span className="text-7xl md:text-9xl font-cinzel font-bold text-border group-hover:text-purple/20 transition-colors duration-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Project info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        {project.featured && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
                            <span className="text-xs font-mono text-purple-light uppercase tracking-wider">
                              Featured
                            </span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel mb-4 text-text-primary group-hover:text-gradient transition-all duration-500">
                        {project.title}
                      </h2>

                      <p className="text-lg text-text-secondary leading-relaxed mb-6 max-w-2xl">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="tag"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* GitHub icon */}
                    <div className="flex-shrink-0 hidden md:block">
                      <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:border-purple group-hover:bg-purple transition-all duration-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-text-muted group-hover:text-white transition-colors duration-500"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-cyan" style={{ top: "30%", right: "10%", opacity: 0.3 }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="scroll-reveal">
              <p className="section-label justify-center mb-6">Have a Project Idea?</p>
            </div>
            <div className="scroll-scale">
              <h2 className="text-4xl md:text-6xl font-cinzel mb-8">
                <span className="text-gradient">Let&apos;s build</span>
                <br />
                something amazing
              </h2>
            </div>
            <div className="scroll-flip">
              <Link href="mailto:sonali.sharma110114@gmail.com" className="btn-magic text-lg">
                <span>Get in Touch</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
