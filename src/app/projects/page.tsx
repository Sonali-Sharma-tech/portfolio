"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

// Tech icon mappings for visual interest
const techIcons: Record<string, string> = {
  TypeScript: "TS",
  React: "⚛️",
  "Next.js": "▲",
  "Node.js": "⬢",
  "VS Code": "💻",
  Notes: "📝",
  Productivity: "⚡",
  "Developer Tools": "🔧",
  Utilities: "⚙️",
  Themes: "🎨",
  "Dark Mode": "🌙",
};

// Terminal typing animation component
function TerminalTyping({ text, delay = 0, speed = 30 }: { text: string; delay?: number; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeChar, speed + Math.random() * 20);
        } else {
          // Blink cursor after typing complete
          const cursorBlink = setInterval(() => {
            setShowCursor(prev => !prev);
          }, 500);
          return () => clearInterval(cursorBlink);
        }
      };
      typeChar();
    };

    timeout = setTimeout(startTyping, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>▊</span>
    </span>
  );
}

// Project card with cyberpunk terminal design
function ProjectCard({
  project,
  index
}: {
  project: {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    featured: boolean;
    github: string;
    color?: string;
  };
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const color = project.color || "cyan";

  // Generate deterministic hex codes based on index to avoid hydration mismatch
  const hexCodes = [
    ((index + 1) * 0x1a2b3c4d >>> 0).toString(16).padStart(8, "0"),
    ((index + 1) * 0x2b3c4d5e >>> 0).toString(16).padStart(8, "0"),
    ((index + 1) * 0x3c4d5e6f >>> 0).toString(16).padStart(8, "0"),
  ];

  const colorClasses: Record<string, { border: string; bg: string; text: string; glow: string; gradient: string; rgb: string }> = {
    cyan: {
      border: "border-cyan/30 group-hover:border-cyan",
      bg: "bg-cyan/10",
      text: "text-cyan",
      glow: "group-hover:shadow-[0_0_40px_rgba(0,255,245,0.3)]",
      gradient: "from-cyan/20 via-cyan/5 to-transparent",
      rgb: "0, 255, 245",
    },
    magenta: {
      border: "border-magenta/30 group-hover:border-magenta",
      bg: "bg-magenta/10",
      text: "text-magenta",
      glow: "group-hover:shadow-[0_0_40px_rgba(255,0,255,0.3)]",
      gradient: "from-magenta/20 via-magenta/5 to-transparent",
      rgb: "255, 0, 255",
    },
    green: {
      border: "border-green/30 group-hover:border-green",
      bg: "bg-green/10",
      text: "text-green",
      glow: "group-hover:shadow-[0_0_40px_rgba(0,255,65,0.3)]",
      gradient: "from-green/20 via-green/5 to-transparent",
      rgb: "0, 255, 65",
    },
  };

  const styles = colorClasses[color];

  return (
    <Link
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        className={`relative h-full bg-gradient-to-b from-space-surface to-space-void border ${styles.border} overflow-hidden transition-all duration-500 ${styles.glow}`}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />

        {/* CRT flicker effect on hover */}
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:animate-pulse pointer-events-none z-10" />

        {/* Terminal header bar */}
        <div className={`relative flex items-center gap-2 px-4 py-2 border-b ${styles.border} bg-space-void/80`}>
          {/* Window controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors" />
          </div>

          {/* Terminal title */}
          <div className="flex-1 text-center">
            <span className="text-[10px] font-mono text-text-muted tracking-wider">
              project@{project.slug}:~
            </span>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${styles.bg.replace('/10', '')} animate-pulse`} />
          </div>
        </div>

        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-30`} />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
          style={{
            backgroundImage: `
              linear-gradient(rgba(${styles.rgb},0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(${styles.rgb},0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Data stream effect on hover */}
        <div className="absolute top-10 right-4 font-mono text-[8px] text-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="animate-pulse">0x{hexCodes[0]}</div>
          <div className="animate-pulse" style={{ animationDelay: '100ms' }}>0x{hexCodes[1]}</div>
          <div className="animate-pulse" style={{ animationDelay: '200ms' }}>0x{hexCodes[2]}</div>
        </div>

        {/* Corner accents with animation */}
        <div className={`absolute top-0 left-0 w-0 group-hover:w-16 h-px bg-gradient-to-r ${styles.text.replace('text-', 'from-')} to-transparent transition-all duration-500`} />
        <div className={`absolute top-0 left-0 w-px h-0 group-hover:h-16 bg-gradient-to-b ${styles.text.replace('text-', 'from-')} to-transparent transition-all duration-500`} />
        <div className={`absolute bottom-0 right-0 w-0 group-hover:w-16 h-px bg-gradient-to-l ${styles.text.replace('text-', 'from-')} to-transparent transition-all duration-500`} />
        <div className={`absolute bottom-0 right-0 w-px h-0 group-hover:h-16 bg-gradient-to-t ${styles.text.replace('text-', 'from-')} to-transparent transition-all duration-500`} />

        {/* Clipped corner indicators */}
        <div className={`absolute top-0 right-0 w-4 h-4 ${styles.bg} border-l border-b ${styles.border}`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 ${styles.bg} border-t border-r ${styles.border}`} style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />

        {/* Content */}
        <div className="relative p-5 h-full flex flex-col">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Project number with glitch effect */}
            <div className={`relative flex-shrink-0 w-14 h-14 border-2 ${styles.border} flex items-center justify-center font-mono text-2xl font-bold ${styles.text} bg-space-void/50 group-hover:scale-105 transition-transform`}>
              <span className="relative z-10">{String(index + 1).padStart(2, "0")}</span>
              {/* Glitch layers */}
              <span className={`absolute inset-0 flex items-center justify-center ${styles.text} opacity-0 group-hover:opacity-50 translate-x-0.5 -translate-y-0.5 blur-[1px]`}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Featured badge */}
            {project.featured && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 ${styles.bg} border ${styles.border} group-hover:animate-pulse`}>
                <span className={`w-2 h-2 rounded-full bg-current ${styles.text}`} />
                <span className={`text-[10px] font-mono ${styles.text} uppercase tracking-widest font-semibold`}>
                  FEATURED
                </span>
              </div>
            )}
          </div>

          {/* Terminal command line */}
          <div className="font-mono text-xs mb-3 text-text-muted">
            <span className={styles.text}>$</span>
            <span className="ml-2">cat project.info</span>
          </div>

          {/* Title with typing effect on hover */}
          <h3 className={`text-[13px] md:text-[15px] font-mono font-semibold mb-3 ${styles.text} group-hover:drop-shadow-[0_0_15px_currentColor] transition-all leading-snug min-h-[2.5em]`}>
            {isHovered ? (
              <TerminalTyping text={project.title} speed={25} />
            ) : (
              project.title
            )}
          </h3>

          {/* Description in terminal output style */}
          <div className="mb-4 flex-grow">
            <div className="text-text-secondary text-sm font-mono leading-relaxed pl-3 border-l-2 border-border group-hover:border-current transition-colors min-h-[4em]">
              {isHovered ? (
                <TerminalTyping text={project.description} speed={15} delay={200} />
              ) : (
                project.description
              )}
            </div>
          </div>

          {/* Tech stack with icon boxes */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {project.tags.slice(0, 4).map((tag, i) => (
                <div
                  key={tag}
                  className={`w-9 h-9 border ${styles.border} bg-space-void/50 flex items-center justify-center text-sm font-mono ${styles.text} group-hover:scale-110 group-hover:border-current transition-all`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  title={tag}
                >
                  {techIcons[tag] || tag.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Tags as hashtags */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-mono text-text-muted group-hover:${styles.text} transition-colors`}
              >
                #{tag.replace(/\s+/g, '_')}
              </span>
            ))}
          </div>

          {/* Action bar - terminal style */}
          <div className={`flex items-center justify-between pt-4 border-t border-border/50 group-hover:border-current/30 transition-colors`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono ${styles.text}`}>{">"}</span>
              <span className="text-xs font-mono text-text-muted group-hover:text-text-secondary transition-colors">
                ./open --source
              </span>
            </div>
            <div className={`w-9 h-9 border ${styles.border} flex items-center justify-center bg-space-void/50 group-hover:${styles.bg} group-hover:scale-110 transition-all`}>
              <svg
                className={`w-4 h-4 ${styles.text} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom progress bar animation on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-space-void overflow-hidden">
          <div
            className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${styles.text.replace('text-', 'from-')} to-transparent transition-all duration-1000 ease-out`}
          />
        </div>

        {/* Glitch overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>
      </article>
    </Link>
  );
}

// Filter categories with icons
const filterCategories = [
  { id: "all", label: "ALL", icon: "◈", color: "cyan" },
  { id: "react", label: "REACT", icon: "⚛️", color: "cyan" },
  { id: "extension", label: "EXTENSION", icon: "💻", color: "magenta" },
  { id: "tools", label: "TOOLS", icon: "🔧", color: "green" },
  { id: "docs", label: "DOCS", icon: "📝", color: "cyan" },
  { id: "fullstack", label: "FULL_STACK", icon: "▲", color: "magenta" },
];

export default function ProjectsPage() {
  const allProjects = getAllProjects();
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter projects based on selected category
  const projects = activeFilter === "all"
    ? allProjects
    : allProjects.filter(project =>
        project.tags.some(tag =>
          tag.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );

  return (
    <>
      {/* ========================================
          CYBERPUNK HERO - Clean & Bold
          ======================================== */}
      <section className="hero-compact relative overflow-hidden">
        {/* Scanning line animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* <div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
            style={{
              animation: 'scan 4s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes scan {
              0%, 100% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              50% { top: 100%; }
            }
          `}</style> */}
        </div>

        <div className="container relative z-10">
          {/* Main title - Large & Bold */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan to-magenta bg-clip-text text-transparent">
                PROJECTS
              </span>
            </h1>
          
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-text-secondary max-w-md mb-8">
            Building the future, one commit at a time.
          </p>

          {/* Quick filters / tags */}
          <div className="flex flex-wrap items-center gap-2">
            {filterCategories.map((filter) => {
              const isActive = activeFilter === filter.id;
              const colorStyles: Record<string, string> = {
                cyan: isActive ? "bg-cyan/20 border-cyan text-cyan" : "border-cyan/30 text-cyan/70 hover:border-cyan hover:text-cyan",
                magenta: isActive ? "bg-magenta/20 border-magenta text-magenta" : "border-magenta/30 text-magenta/70 hover:border-magenta hover:text-magenta",
                green: isActive ? "bg-green/20 border-green text-green" : "border-green/30 text-green/70 hover:border-green hover:text-green",
              };
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${colorStyles[filter.color]}`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          PROJECTS GALLERY GRID
          ======================================== */}
      <section className="section pt-12">
        <div className="container">
          {/* Gallery grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>

          {/* More projects hint */}
          <div className="mt-16 text-center">
            <Link
              href="https://github.com/Sonali-Sharma-tech?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-8 py-4 border border-border bg-space-surface/50 hover:border-cyan/50 hover:bg-cyan/5 transition-all"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-text-muted group-hover:text-cyan transition-colors">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-mono text-text-muted group-hover:text-cyan transition-colors">
                View all 27+ repositories
              </span>
              <svg className="w-4 h-4 text-text-muted group-hover:text-cyan group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA - Inline compact
          ======================================== */}
      <section className="section pt-8 pb-16">
        <div className="container">
          <div
            className="relative bg-space-surface border border-cyan/20 p-8 md:p-12 overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            }}
          >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
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
