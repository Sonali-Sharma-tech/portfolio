import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ABOUT | SONALI.SH",
  description: "Full-stack developer with 5+ years of experience building web applications.",
};

const skills = {
  frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Svelte", "Angular"],
  backend: ["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL"],
  tools: ["Git", "Docker", "VS Code", "Socket.io", "REST APIs", "Redux"],
};

const experience = [
  {
    company: "Glance",
    role: "SDE III",
    period: "Jul 2025 - Present",
    duration: "Current",
    type: "Full-time",
    location: "Bengaluru",
    color: "cyan",
    current: true,
  },
  {
    company: "Glance",
    role: "SDE II",
    period: "Aug 2023 - Jun 2025",
    duration: "1 yr 11 mos",
    type: "Full-time",
    location: "Bengaluru",
    skills: ["Svelte", "SvelteKit"],
    color: "cyan",
  },
  {
    company: "Captain Fresh",
    role: "Software Engineer",
    period: "Jun 2022 - Jul 2023",
    duration: "1 yr 2 mos",
    type: "Full-time",
    location: "Bengaluru",
    skills: ["Redux", "Ant Design"],
    color: "magenta",
  },
  {
    company: "6figr.com",
    role: "Frontend Developer",
    period: "Dec 2020 - May 2022",
    duration: "1 yr 6 mos",
    type: "Full-time",
    location: "Remote",
    skills: ["TypeScript", "Angular"],
    color: "green",
  },
  {
    company: "EY",
    role: "Web Developer",
    period: "Aug 2019 - Apr 2020",
    duration: "9 mos",
    type: "Internship",
    location: "Bengaluru",
    skills: ["Angular", "AJAX"],
    color: "orange",
  },
];

const interests = [
  { icon: "📚", label: "READING", status: "ACTIVE" },
  { icon: "🎵", label: "MUSIC", status: "STREAMING" },
  { icon: "✈️", label: "TRAVEL", status: "EXPLORING" },
  { icon: "🎮", label: "GAMING", status: "PAUSED" },
  { icon: "💡", label: "LEARNING", status: "ALWAYS_ON" },
  { icon: "🚀", label: "BUILDING", status: "IN_PROGRESS" },
];

export default function AboutPage() {
  const totalYears = "5+";

  return (
    <>
      {/* ========================================
          COMPACT HERO - Profile Overview
          ======================================== */}
      <section className="hero-compact">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Profile Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-cyan animate-pulse" />
                <span className="text-xs font-mono text-cyan uppercase tracking-[0.3em]">
                  ABOUT_ME
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-display mb-6">
                <span className="text-gradient-cyber">SONALI</span>
              </h1>

              <div className="space-y-0.5 text-sm font-mono mb-6">
                <p className="text-text-muted">
                  <span className="text-green">const</span> role <span className="text-magenta">=</span> <span className="text-cyan">{`"`}engineer{`"`}</span>;
                </p>
                <p className="text-text-muted">
                  <span className="text-green">const</span> mode <span className="text-magenta">=</span> <span className="text-cyan">{`"`}build{`"`}</span>;
                </p>
                <p className="text-text-muted">
                  <span className="text-green">const</span> status <span className="text-magenta">=</span> <span className="text-cyan">{`"`}shipping{`"`}</span>;
                </p>
              </div>

              <p className="text-text-muted font-mono text-xs leading-relaxed mb-8 max-w-sm">
                <span className="text-magenta">//</span> {totalYears} years. Bengaluru. Building interfaces that work.
              </p>

              {/* Quick stats - inline */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 border border-border bg-space-surface/50">
                  <span className="text-xl font-mono text-cyan font-bold">{totalYears}</span>
                  <span className="text-xs text-text-muted font-mono">Years Exp</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-border bg-space-surface/50">
                  <span className="text-xl font-mono text-magenta font-bold">5</span>
                  <span className="text-xs text-text-muted font-mono">Companies</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-border bg-space-surface/50">
                  <span className="text-xl font-mono text-green font-bold">27+</span>
                  <span className="text-xs text-text-muted font-mono">Repos</span>
                </div>
              </div>
            </div>

            {/* Right - Terminal Card */}
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="terminal-title">~/.config/sonali</span>
              </div>
              <div className="terminal-body text-xs">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">whoami --verbose</span>
                </div>
                <div className="mt-3 space-y-1 font-mono">
                  <p><span className="text-cyan">name:</span> <span className="text-text-secondary">Sonali Sharma</span></p>
                  <p><span className="text-cyan">loc:</span> <span className="text-text-secondary">Bengaluru</span></p>
                  <p><span className="text-cyan">role:</span> <span className="text-text-secondary">SDE III @ Glance</span></p>
                  <p><span className="text-cyan">exp:</span> <span className="text-text-secondary">{totalYears} years</span></p>
                  <p><span className="text-cyan">stack:</span> <span className="text-text-secondary">React, TS, Node</span></p>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    <span className="text-green text-[10px] font-mono">OPEN_TO_WORK=true</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CAREER JOURNEY - Timeline
          ======================================== */}
      <section className="section pt-12">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-cyan uppercase tracking-widest">Career_Journey</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-mono text-text-muted">{totalYears} years</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-gradient-cyber">Experience</h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-magenta to-green transform md:-translate-x-1/2" />

            <div className="space-y-8">
              {experience.map((job, index) => (
                <div
                  key={`${job.company}-${job.role}`}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 -translate-x-1/2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      job.current
                        ? `bg-${job.color} border-${job.color} shadow-[0_0_20px_rgba(0,255,245,0.6)]`
                        : `bg-space-void border-${job.color}/50`
                    }`}>
                      {job.current && (
                        <span className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-40" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className={`holo-card p-6 ${index % 2 === 0 ? "scroll-slide-left" : "scroll-slide-right"}`}>
                      <div className={`flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        {/* Company initial */}
                        <div className={`flex-shrink-0 w-12 h-12 border border-${job.color}/30 bg-${job.color}/5 flex items-center justify-center`}>
                          <span className={`text-xl font-mono font-bold text-${job.color}`}>
                            {job.company.charAt(0)}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className={`flex flex-wrap items-center gap-2 mb-1 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <h3 className="text-lg font-mono text-text-primary">{job.role}</h3>
                            {job.current && (
                              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan/20 text-cyan border border-cyan/30 rounded">
                                CURRENT
                              </span>
                            )}
                          </div>

                          <p className={`text-sm font-mono text-${job.color} mb-2`}>{job.company}</p>

                          <div className={`flex flex-wrap items-center gap-2 text-xs font-mono text-text-muted mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <span>{job.period}</span>
                            <span className="text-border">•</span>
                            <span>{job.duration}</span>
                            <span className="text-border">•</span>
                            <span>{job.location}</span>
                          </div>

                          {job.skills && (
                            <div className={`flex flex-wrap gap-1 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                              {job.skills.map((skill) => (
                                <span key={skill} className="tag text-[10px] py-0.5 px-2">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-cyber" />

      {/* ========================================
          SKILLS SECTION - Compact
          ======================================== */}
      <section className="section">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-magenta uppercase tracking-widest">Tech_Stack</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-gradient-cyber">Skills</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="holo-card p-6 scroll-slide-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-cyan/30 bg-cyan/5 flex items-center justify-center rounded">
                  <span className="text-lg">🎨</span>
                </div>
                <h3 className="text-lg font-mono text-cyan">Frontend</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill) => (
                  <span key={skill} className="tag text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="holo-card p-6 scroll-scale">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-magenta/30 bg-magenta/5 flex items-center justify-center rounded">
                  <span className="text-lg">⚙️</span>
                </div>
                <h3 className="text-lg font-mono text-magenta">Backend</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill) => (
                  <span key={skill} className="tag text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="holo-card p-6 scroll-slide-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-green/30 bg-green/5 flex items-center justify-center rounded">
                  <span className="text-lg">🛠️</span>
                </div>
                <h3 className="text-lg font-mono text-green">Tools</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <span key={skill} className="tag text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-cyber" />

      {/* ========================================
          INTERESTS - Compact Grid
          ======================================== */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <span className="text-xs font-mono text-green uppercase tracking-widest">Beyond_Code</span>
              <h2 className="text-2xl md:text-3xl font-display text-gradient-cyber mt-2">Interests</h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {interests.map((interest) => (
                <div
                  key={interest.label}
                  className="holo-card p-4 text-center group hover:scale-105 transition-transform"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                    {interest.icon}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted block">
                    {interest.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA - Compact Inline
          ======================================== */}
      <section className="section pt-8 pb-16">
        <div className="container">
          <div className="holo-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display mb-2">
                  <span className="text-gradient-cyber">{"Let's Connect"}</span>
                </h2>
                <p className="text-text-secondary font-mono text-sm">
                  {"// Open to new opportunities and collaborations"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="mailto:sonali.sharma110114@gmail.com" className="btn-cyber">
                  <span>Email</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href="https://linkedin.com/in/sonali-sharma110114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-cyber"
                >
                  <span>LinkedIn</span>
                </Link>
                <Link
                  href="https://github.com/Sonali-Sharma-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-cyber"
                >
                  <span>GitHub</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
