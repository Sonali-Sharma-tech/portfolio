import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | SONALI.SH",
  description: "Full-stack developer with 5+ years of experience building web applications.",
};

const experience = [
  {
    company: "Glance",
    role: "SDE III",
    period: "Jul 2025 - Present",
    duration: "Current",
    location: "Bengaluru",
    description: "Leading frontend architecture for products reaching millions daily.",
    skills: ["React", "TypeScript", "System Design"],
    color: "cyan",
    current: true,
    year: "2025",
  },
  {
    company: "Glance",
    role: "SDE II",
    period: "Aug 2023 - Jun 2025",
    duration: "1 yr 11 mos",
    location: "Bengaluru",
    description: "Built interactive features with Svelte for the lock screen platform.",
    skills: ["Svelte", "SvelteKit"],
    color: "cyan",
    year: "2023",
  },
  {
    company: "Captain Fresh",
    role: "Software Engineer",
    period: "Jun 2022 - Jul 2023",
    duration: "1 yr 2 mos",
    location: "Bengaluru",
    description: "Developed B2B seafood logistics platform frontend.",
    skills: ["React", "Redux", "Ant Design"],
    color: "magenta",
    year: "2022",
  },
  {
    company: "6figr.com",
    role: "Frontend Developer",
    period: "Dec 2020 - May 2022",
    duration: "1 yr 6 mos",
    location: "Remote",
    description: "Created salary insights and career analytics platform.",
    skills: ["Angular", "TypeScript"],
    color: "green",
    year: "2020",
  },
  {
    company: "EY",
    role: "Web Developer Intern",
    period: "Aug 2019 - Apr 2020",
    duration: "9 mos",
    location: "Bengaluru",
    description: "Started the journey. Built internal tools and learned enterprise patterns.",
    skills: ["Angular", "AJAX"],
    color: "orange",
    year: "2019",
  },
];

const techStack = {
  languages: ["TypeScript", "JavaScript", "HTML", "CSS"],
  frontend: ["React", "Next.js", "Svelte", "Angular", "Tailwind"],
  backend: ["Node.js", "Express", "GraphQL", "REST"],
  databases: ["MongoDB", "PostgreSQL"],
  tools: ["Git", "Docker", "VS Code", "Figma"],
};

const interests = [
  { icon: "📚", label: "Reading", detail: "Sci-fi & tech blogs" },
  { icon: "🎵", label: "Music", detail: "Lo-fi & synthwave" },
  { icon: "✈️", label: "Travel", detail: "New cities, new food" },
  { icon: "🎮", label: "Gaming", detail: "Occasional sessions" },
];

export default function AboutPage() {
  const totalYears = "5+";

  return (
    <div className="py-12 md:py-20">
      {/* Hero Section - Minimal */}
      <section className="container max-w-5xl mb-20">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left - Main intro */}
          <div className="lg:col-span-3">
            <p className="text-xs font-mono text-cyan uppercase tracking-[0.3em] mb-4">
              About
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight mb-6">
              <span className="text-gradient-cyber">Sonali Sharma</span>
            </h1>

            <div className="space-y-4 text-text-secondary leading-relaxed mb-8">
              <p className="text-lg">
                Software engineer with {totalYears} years of experience building web applications
                that scale. Currently crafting interfaces at{" "}
                <span className="text-magenta font-medium">Glance</span>.
              </p>
              <p>
                I specialize in React, TypeScript, and modern frontend architecture.
                I care about clean code, intuitive UX, and shipping products that
                people actually want to use.
              </p>
            </div>

            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-space-surface/30 text-sm font-mono">
              <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
              <span className="text-text-muted">Bengaluru, India</span>
              <span className="text-border mx-1">•</span>
              <span className="text-green">Open to work</span>
            </div>
          </div>

          {/* Right - Quick links */}
          <div className="lg:col-span-2">
            <div className="border border-border/50 bg-space-surface/20 p-6">
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <Link
                  href="mailto:sonali.sharma110114@gmail.com"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-cyan transition-colors group"
                >
                  <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="group-hover:underline underline-offset-2">Email</span>
                </Link>
                <Link
                  href="https://github.com/Sonali-Sharma-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-cyan transition-colors group"
                >
                  <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="group-hover:underline underline-offset-2">GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/sonali-sharma110114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-cyan transition-colors group"
                >
                  <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="group-hover:underline underline-offset-2">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline - Git Log Style */}
      <section className="container max-w-5xl mb-20">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-2xl md:text-3xl font-display text-gradient-cyber">
            Career Journey
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-mono text-text-muted">{totalYears} years</span>
        </div>

        {/* Git-style timeline */}
        <div className="relative">
          {/* Main branch line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan via-magenta to-orange" />

          <div className="space-y-0">
            {experience.map((job, index) => (
              <div key={`${job.company}-${job.role}`} className="relative group">
                {/* Commit node */}
                <div className="absolute left-0 top-6 z-10">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      job.current
                        ? "bg-cyan border-cyan shadow-[0_0_20px_rgba(0,255,245,0.5)]"
                        : `bg-space-void border-${job.color}/50 group-hover:border-${job.color}`
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-text-primary">
                      {job.year.slice(-2)}
                    </span>
                  </div>
                  {job.current && (
                    <span className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-30" />
                  )}
                </div>

                {/* Content */}
                <div className="pl-16 pb-10">
                  <div className={`border border-border/30 bg-space-surface/20 p-6 transition-all duration-300 hover:border-${job.color}/50 hover:bg-space-surface/40`}>
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-display text-text-primary">
                            {job.role}
                          </h3>
                          {job.current && (
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan/20 text-cyan border border-cyan/30">
                              HEAD
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-mono text-${job.color}`}>
                          @ {job.company}
                        </p>
                      </div>

                      <div className="text-right text-xs font-mono text-text-muted">
                        <div>{job.period}</div>
                        <div className="text-text-muted/60">{job.duration} • {job.location}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-[11px] font-mono text-text-muted bg-space-void border border-border/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Git hash decoration */}
                    <div className="mt-4 pt-4 border-t border-border/20 flex items-center gap-2 text-[10px] font-mono text-text-muted/50">
                      <span className="text-cyan/50">commit</span>
                      <span>{Math.random().toString(36).substring(2, 9)}</span>
                      <span className="text-border">•</span>
                      <span>{job.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Origin point */}
            <div className="relative">
              <div className="absolute left-0 top-0">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-text-muted/30 flex items-center justify-center">
                  <span className="text-xs font-mono text-text-muted">○</span>
                </div>
              </div>
              <div className="pl-16 pt-2 text-xs font-mono text-text-muted/50">
                git init // The beginning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Compact */}
      <section className="container max-w-5xl mb-20">
        <h2 className="text-2xl md:text-3xl font-display text-gradient-cyber mb-8">
          Tech Stack
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category} className="border border-border/30 bg-space-surface/20 p-5">
              <h3 className="text-xs font-mono text-cyan uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="text-sm text-text-secondary">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond Code */}
      <section className="container max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-display text-gradient-cyber mb-8">
          Beyond Code
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interests.map((interest) => (
            <div
              key={interest.label}
              className="border border-border/30 bg-space-surface/20 p-5 group hover:border-cyan/50 transition-colors"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform inline-block">
                {interest.icon}
              </span>
              <h3 className="text-sm font-mono text-text-primary mb-1">{interest.label}</h3>
              <p className="text-xs text-text-muted">{interest.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
