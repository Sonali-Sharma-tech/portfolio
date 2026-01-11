import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "PROJECTS | SONALI.SH",
  description: "A collection of projects showcasing full-stack development skills and creative problem-solving.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <>
      {/* ========================================
          COMPACT HERO - Integrated Header
          ======================================== */}
      <section className="hero-compact">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left - Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-cyan animate-pulse" />
                <span className="text-xs font-mono text-cyan uppercase tracking-[0.3em]">
                  PROJECT_ARCHIVE
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display mb-4">
                <span className="text-gradient-cyber">PROJECTS</span>
              </h1>

              <p className="text-text-secondary font-mono text-sm max-w-md">
                Full-stack applications, experiments, and open-source contributions.
              </p>
            </div>

            {/* Right - Stats Cards */}
            <div className="flex gap-4">
              <div className="group relative p-4 border border-border bg-space-surface/50 backdrop-blur-sm hover:border-cyan/50 transition-all min-w-[100px]">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan/0 group-hover:border-cyan transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan/0 group-hover:border-cyan transition-colors" />
                <div className="text-3xl font-mono text-cyan font-bold">{projects.length}</div>
                <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Total</div>
              </div>
              <div className="group relative p-4 border border-border bg-space-surface/50 backdrop-blur-sm hover:border-magenta/50 transition-all min-w-[100px]">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-magenta/0 group-hover:border-magenta transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-magenta/0 group-hover:border-magenta transition-colors" />
                <div className="text-3xl font-mono text-magenta font-bold">{featuredCount}</div>
                <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Featured</div>
              </div>
              <Link
                href="https://github.com/Sonali-Sharma-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 border border-border bg-space-surface/50 backdrop-blur-sm hover:border-green/50 hover:bg-green/5 transition-all flex flex-col items-center justify-center min-w-[100px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-text-muted group-hover:text-green transition-colors mb-1">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div className="text-xs text-text-muted font-mono uppercase tracking-wider group-hover:text-green transition-colors">GitHub</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          PROJECTS MASONRY GRID
          ======================================== */}
      <section className="section pt-12">
        <div className="container">
          {/* Projects in alternating layout */}
          <div className="space-y-6">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block ${
                  index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"
                }`}
              >
                <article className="holo-card relative overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Left accent bar */}
                    <div className={`hidden md:block w-1 ${project.featured ? 'bg-gradient-to-b from-cyan via-magenta to-cyan' : 'bg-gradient-to-b from-cyan/30 to-transparent'}`} />

                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Project number - floating */}
                        <div className="flex-shrink-0 flex items-center gap-4">
                          <span className="text-5xl font-mono font-bold text-cyan/20 group-hover:text-cyan/40 transition-colors">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {project.featured && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-cyan/10 border border-cyan/30">
                              <span className="w-1.5 h-1.5 bg-cyan animate-pulse rounded-full" />
                              <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">Featured</span>
                            </span>
                          )}
                        </div>

                        {/* Project info */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl md:text-2xl font-mono mb-2 text-text-primary group-hover:text-cyan transition-colors truncate">
                            {project.title}
                          </h2>

                          <p className="text-text-secondary text-sm font-mono mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tags - horizontal scroll on mobile */}
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="tag text-[10px] py-1 px-2">
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 4 && (
                              <span className="text-xs font-mono text-text-muted">+{project.tags.length - 4}</span>
                            )}
                          </div>
                        </div>

                        {/* View indicator */}
                        <div className="flex-shrink-0 self-center">
                          <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center group-hover:border-cyan group-hover:bg-cyan transition-all duration-300">
                            <svg
                              className="w-4 h-4 text-text-muted group-hover:text-space-void transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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

      {/* ========================================
          CTA - Inline compact
          ======================================== */}
      <section className="section pt-8 pb-16">
        <div className="container">
          <div className="holo-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display mb-2">
                  <span className="text-text-muted">Have a</span>{" "}
                  <span className="text-gradient-cyber">project idea?</span>
                </h2>
                <p className="text-text-secondary font-mono text-sm">
                  {"// Let's build something amazing together"}
                </p>
              </div>
              <Link href="mailto:sonali.sharma110114@gmail.com" className="btn-cyber">
                <span>Get in Touch</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
