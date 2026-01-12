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

// Filter categories derived from actual project tags
const filterCategories = [
  { id: "all", label: "ALL", icon: "◈", color: "cyan" },
  { id: "typescript", label: "TypeScript", icon: "TS", color: "cyan" },
  { id: "react", label: "React", icon: "⚛️", color: "cyan" },
  { id: "vs code", label: "VS Code", icon: "💻", color: "magenta" },
  { id: "developer tools", label: "Dev Tools", icon: "🔧", color: "green" },
  { id: "productivity", label: "Productivity", icon: "⚡", color: "magenta" },
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
          SPACE HERO - Wild Galaxy Elements
          ======================================== */}
      <section className="hero-compact relative overflow-hidden">
        {/* === COSMIC BACKGROUND LAYER === */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          {/* Deep space nebula gradients */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,255,245,0.6) 0%, rgba(0,255,245,0.1) 40%, transparent 70%)',
              top: '-20%',
              right: '-15%',
              animation: 'nebulaPulse 12s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,0,255,0.6) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
              bottom: '-30%',
              left: '-20%',
              animation: 'nebulaPulse 15s ease-in-out infinite reverse',
            }}
          />

          {/* Distant galaxy spiral (subtle) */}
          <div
            className="absolute w-32 h-32 opacity-10"
            style={{
              top: '15%',
              left: '10%',
              background: 'conic-gradient(from 0deg, transparent, rgba(0,255,245,0.3), transparent, rgba(255,0,255,0.2), transparent)',
              borderRadius: '50%',
              animation: 'spin 60s linear infinite',
            }}
          />


          {/* === CONSTELLATION PATTERN === */}
          <svg className="absolute inset-0 w-full h-full opacity-20" style={{ animation: 'constellationFade 8s ease-in-out infinite' }}>
            {/* Constellation 1 - Triangle */}
            <line x1="15%" y1="25%" x2="25%" y2="15%" stroke="rgba(0,255,245,0.4)" strokeWidth="0.5" />
            <line x1="25%" y1="15%" x2="30%" y2="30%" stroke="rgba(0,255,245,0.4)" strokeWidth="0.5" />
            <line x1="30%" y1="30%" x2="15%" y2="25%" stroke="rgba(0,255,245,0.4)" strokeWidth="0.5" />
            {/* Constellation 2 - Arrow */}
            <line x1="70%" y1="20%" x2="80%" y2="25%" stroke="rgba(255,0,255,0.4)" strokeWidth="0.5" />
            <line x1="80%" y1="25%" x2="85%" y2="15%" stroke="rgba(255,0,255,0.4)" strokeWidth="0.5" />
            <line x1="80%" y1="25%" x2="90%" y2="30%" stroke="rgba(255,0,255,0.4)" strokeWidth="0.5" />
          </svg>

          {/* === TWINKLING STARS (multi-layer) === */}
          {/* Large bright stars */}
          {[
            { left: 8, top: 12, size: 3, color: 'cyan' },
            { left: 85, top: 18, size: 2.5, color: 'white' },
            { left: 45, top: 8, size: 2, color: 'magenta' },
            { left: 72, top: 75, size: 2.5, color: 'cyan' },
          ].map((star, i) => (
            <div
              key={`bright-${i}`}
              className="absolute"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size * 4}px`,
                height: `${star.size * 4}px`,
              }}
            >
              {/* Star core */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: star.color === 'cyan' ? '#00fff5' : star.color === 'magenta' ? '#ff00ff' : '#ffffff',
                  boxShadow: `0 0 ${star.size * 3}px ${star.color === 'cyan' ? 'rgba(0,255,245,0.8)' : star.color === 'magenta' ? 'rgba(255,0,255,0.8)' : 'rgba(255,255,255,0.8)'}`,
                  animation: `starPulse ${2 + i * 0.5}s ease-in-out infinite`,
                }}
              />
              {/* Star rays */}
              <div
                className="absolute inset-[-50%]"
                style={{
                  background: `conic-gradient(from 45deg, transparent, ${star.color === 'cyan' ? 'rgba(0,255,245,0.3)' : star.color === 'magenta' ? 'rgba(255,0,255,0.3)' : 'rgba(255,255,255,0.3)'} 5%, transparent 10%)`,
                  animation: `spin ${20 + i * 5}s linear infinite`,
                }}
              />
            </div>
          ))}

          {/* Small distant stars */}
          {[
            { left: 10, top: 15, opacity: 0.5, duration: 2.5, delay: 0.2 },
            { left: 25, top: 8, opacity: 0.7, duration: 3.2, delay: 0.8 },
            { left: 40, top: 22, opacity: 0.4, duration: 2.8, delay: 1.5 },
            { left: 55, top: 5, opacity: 0.6, duration: 3.5, delay: 0.5 },
            { left: 70, top: 18, opacity: 0.8, duration: 2.2, delay: 1.2 },
            { left: 85, top: 12, opacity: 0.5, duration: 3.0, delay: 0.3 },
            { left: 15, top: 65, opacity: 0.6, duration: 2.7, delay: 1.8 },
            { left: 30, top: 78, opacity: 0.4, duration: 3.3, delay: 0.7 },
            { left: 50, top: 85, opacity: 0.7, duration: 2.4, delay: 1.0 },
            { left: 75, top: 72, opacity: 0.5, duration: 2.9, delay: 1.6 },
            { left: 90, top: 55, opacity: 0.6, duration: 3.1, delay: 0.4 },
            { left: 5, top: 40, opacity: 0.8, duration: 2.6, delay: 1.3 },
            { left: 62, top: 35, opacity: 0.5, duration: 2.9, delay: 0.9 },
            { left: 18, top: 88, opacity: 0.6, duration: 3.4, delay: 1.1 },
            { left: 95, top: 42, opacity: 0.4, duration: 2.3, delay: 1.7 },
            { left: 38, top: 62, opacity: 0.7, duration: 3.0, delay: 0.6 },
          ].map((star, i) => (
            <div
              key={`small-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}

          {/* === FLOATING COSMIC DUST PARTICLES === */}
          {[
            { left: 20, top: 30, size: 2, duration: 25, delay: 0 },
            { left: 60, top: 50, size: 1.5, duration: 30, delay: 5 },
            { left: 80, top: 20, size: 1, duration: 20, delay: 10 },
            { left: 35, top: 70, size: 2, duration: 28, delay: 3 },
            { left: 90, top: 60, size: 1.5, duration: 22, delay: 8 },
          ].map((particle, i) => (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-cyan/30 to-magenta/30"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `floatDust ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}

          {/* === ORBIT RINGS (subtle planetary system hint) === */}
          <div
            className="absolute w-96 h-96 border border-cyan/5 rounded-full"
            style={{
              top: '50%',
              right: '-10%',
              transform: 'translateY(-50%) rotateX(75deg)',
              animation: 'orbitRotate 40s linear infinite',
            }}
          >
            {/* Orbiting object */}
            <div
              className="absolute w-2 h-2 bg-cyan rounded-full shadow-[0_0_10px_rgba(0,255,245,0.8)]"
              style={{
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* === KEYFRAME ANIMATIONS === */}
          <style>{`
            @keyframes nebulaPulse {
              0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.15; }
              50% { transform: scale(1.1) rotate(5deg); opacity: 0.25; }
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.5); }
            }
            @keyframes starPulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.3); opacity: 1; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes constellationFade {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.35; }
            }
            @keyframes floatDust {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(10px, -15px) rotate(90deg); }
              50% { transform: translate(5px, 10px) rotate(180deg); }
              75% { transform: translate(-10px, -5px) rotate(270deg); }
            }
            @keyframes orbitRotate {
              from { transform: translateY(-50%) rotateX(75deg) rotateZ(0deg); }
              to { transform: translateY(-50%) rotateX(75deg) rotateZ(360deg); }
            }
          `}</style>
        </div>

        <div className="container relative z-10">
          {/* Cyber breadcrumb / location indicator */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-sm font-mono">
              <span className="text-text-muted">~</span>
              <span className="text-cyan">/</span>
              <span className="text-text-muted">sonali</span>
              <span className="text-cyan">/</span>
              <span className="text-white font-semibold">projects</span>
              <span className="inline-block w-2 h-4 bg-cyan animate-pulse ml-1" />
            </div>
          </div>

          {/* Main title */}
          <div className="relative mb-10">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight">
              <span className="text-cyan">{"{"}</span>
              <span className="text-white"> BUILD</span>
              <span className="text-magenta">.</span>
              <span className="text-white">SHIP</span>
              <span className="text-magenta">.</span>
              <span className="text-white">REPEAT </span>
              <span className="text-cyan">{"}"}</span>
            </h2>
          </div>

          {/* Quick filters - Creative chip design */}
          <div className="relative">
            {/* Filter label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Filter by</span>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-3">
              {filterCategories.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`group relative px-4 py-2.5 font-mono text-sm transition-all duration-300 cursor-pointer
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-white border border-cyan/50'
                        : 'bg-space-surface/50 text-text-secondary border border-border hover:border-cyan/30 hover:text-white'
                      }`}
                    style={{
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    {/* Glow effect on active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-cyan/10 blur-sm -z-10" />
                    )}

                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${isActive ? 'border-cyan' : 'border-transparent group-hover:border-cyan/50'}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${isActive ? 'border-magenta' : 'border-transparent group-hover:border-magenta/50'}`} />

                    {/* Content */}
                    <div className="flex items-center gap-2">
                      <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-[0_0_4px_currentColor]' : ''}`}>
                        {filter.icon}
                      </span>
                      <span className="font-medium">{filter.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse ml-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active filter indicator */}
            {activeFilter !== 'all' && (
              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-text-muted">
                <span className="text-cyan">→</span>
                <span>Showing {activeFilter} projects</span>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-magenta hover:text-white transition-colors ml-2"
                >
                  [clear]
                </button>
              </div>
            )}
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
