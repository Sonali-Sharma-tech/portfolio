"use client";

import { useMemo } from "react";
import Link from "next/link";
import { voyageData, sceneRanges } from "@/lib/voyage-data";
import type { VoyageProject } from "@/lib/voyage-data";
import { useSceneProgress } from "../VoyageController";

// ==========================================
// PROJECT PLANET SCENE
// Each project as a themed world
// ==========================================

interface ProjectPlanetSceneProps {
  scrollProgress: number;
}

export function ProjectPlanetScene({ scrollProgress }: ProjectPlanetSceneProps) {
  const { isActive } = useSceneProgress(
    scrollProgress,
    sceneRanges.projects.start,
    sceneRanges.projects.end
  );

  // Find current project
  const currentProject = voyageData.projects.find(
    (p) => scrollProgress >= p.scrollStart && scrollProgress < p.scrollEnd
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Render themed backgrounds */}
      {voyageData.projects.map((project) => (
        <ProjectWorld
          key={project.id}
          project={project}
          scrollProgress={scrollProgress}
          isCurrent={currentProject?.id === project.id}
        />
      ))}

      {/* Project timeline on left */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-green/30 via-magenta/30 to-cyan/30" />

          {voyageData.projects.map((project) => {
            const isPassed = scrollProgress >= project.scrollEnd;
            const isCurrent = scrollProgress >= project.scrollStart && scrollProgress < project.scrollEnd;

            return (
              <div
                key={project.id}
                className="flex items-center gap-3 py-4 transition-all duration-300"
                style={{
                  opacity: isCurrent ? 1 : isPassed ? 0.5 : 0.3,
                  transform: `translateX(${isCurrent ? "8px" : "0"})`,
                }}
              >
                <div
                  className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isCurrent
                      ? `bg-${project.color} border-${project.color}`
                      : isPassed
                      ? "bg-green/50 border-green/50"
                      : "bg-transparent border-white/20"
                  }`}
                  style={isCurrent ? { boxShadow: `0 0 15px var(--neon-${project.color})` } : {}}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-40" />
                  )}
                </div>
                <span
                  className={`text-xs font-mono transition-colors duration-300 ${
                    isCurrent ? `text-${project.color}` : "text-white/40"
                  }`}
                >
                  {project.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current project panel */}
      {currentProject && (
        <ProjectPanel project={currentProject} scrollProgress={scrollProgress} />
      )}
    </div>
  );
}

// ==========================================
// PROJECT WORLD
// Themed background for each project
// ==========================================

interface ProjectWorldProps {
  project: VoyageProject;
  scrollProgress: number;
  isCurrent: boolean;
}

function ProjectWorld({ project, scrollProgress, isCurrent }: ProjectWorldProps) {
  const progress = isCurrent
    ? (scrollProgress - project.scrollStart) / (project.scrollEnd - project.scrollStart)
    : 0;

  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: isCurrent ? 1 : 0 }}
    >
      {project.theme === "matrix" && <MatrixWorld progress={progress} />}
      {project.theme === "rainbow" && <RainbowWorld progress={progress} />}
      {project.theme === "minimal" && <MinimalWorld progress={progress} />}
    </div>
  );
}

// ==========================================
// MATRIX WORLD
// DevToolkit - Terminal/code aesthetic
// ==========================================

function MatrixWorld({ progress }: { progress: number }) {
  // Generate code columns
  const columns = useMemo(() => {
    const chars = "01アイウエオカキクケコ</>{}[]=>const function return";
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${(i / 25) * 100}%`,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      text: Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
    }));
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* Matrix rain */}
      <div className="absolute inset-0 overflow-hidden">
        {columns.map((col) => (
          <div
            key={col.id}
            className="matrix-column absolute top-0 font-mono text-xs text-green whitespace-pre leading-tight"
            style={{
              left: col.left,
              animationDelay: `${col.delay}s`,
              animationDuration: `${col.duration}s`,
              textShadow: "0 0 10px #00ff41",
              writingMode: "vertical-rl",
            }}
          >
            {col.text}
          </div>
        ))}
      </div>

      {/* Terminal prompt at bottom */}
      <div className="absolute bottom-24 left-8 right-8">
        <div className="max-w-lg">
          <div className="text-green/80 font-mono text-sm">
            <span className="text-green">guest@devtoolkit</span>
            <span className="text-white">:</span>
            <span className="text-cyan">~</span>
            <span className="text-white">$ </span>
            <span className="animate-pulse">npm run build</span>
            <span className="animate-blink ml-1">▊</span>
          </div>
          <div className="mt-2 text-green/60 font-mono text-xs">
            &gt; Building productivity modules...
          </div>
        </div>
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <style jsx>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .matrix-column {
          animation: matrix-fall 8s linear infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}

// ==========================================
// RAINBOW WORLD
// Colorful Extension - Paint/color aesthetic
// ==========================================

function RainbowWorld({ progress }: { progress: number }) {
  // Generate floating color orbs
  const orbs = useMemo(() => {
    const colors = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff", "#ff00ff"];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: 40 + Math.random() * 80,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 50%, #0a0a20 100%)",
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,0,0,0.3) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(255,136,0,0.3) 0%, transparent 40%),
            radial-gradient(circle at 50% 70%, rgba(0,136,255,0.3) 0%, transparent 40%),
            radial-gradient(circle at 30% 80%, rgba(136,0,255,0.3) 0%, transparent 40%)
          `,
          animation: "rainbow-shift 10s ease-in-out infinite",
        }}
      />

      {/* Floating color orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-xl"
          style={{
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            opacity: 0.4,
            animation: `float-orb ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* Paint splashes */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: "200px",
              height: "200px",
              left: `${20 * i}%`,
              top: `${30 + (i % 3) * 20}%`,
              background: `radial-gradient(ellipse,
                hsla(${i * 60}, 100%, 60%, 0.2) 0%,
                transparent 70%
              )`,
              transform: `rotate(${i * 30}deg)`,
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      {/* VS Code icon hint */}
      <div className="absolute top-1/4 right-1/4 opacity-10">
        <div className="text-8xl text-white">{ }</div>
      </div>

      {/* Color palette at bottom */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff", "#ff00ff"].map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes rainbow-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-10px, 20px) scale(0.9); }
          75% { transform: translate(-20px, -10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// MINIMAL WORLD
// Black Note - Clean, elegant aesthetic
// ==========================================

function MinimalWorld({ progress }: { progress: number }) {
  // Subtle floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* Subtle gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float-particle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Elegant note cards floating */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-48 h-32 border border-white/20 bg-white/5 backdrop-blur-sm"
              style={{
                transform: `
                  rotate(${-10 + i * 10}deg)
                  translate(${i * 30}px, ${i * 20}px)
                `,
              }}
            >
              <div className="p-4">
                <div className="w-3/4 h-2 bg-white/20 mb-2" />
                <div className="w-1/2 h-2 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal text */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
        <div className="text-white/30 font-mono text-sm tracking-widest">
          MINIMAL · ELEGANT · DARK
        </div>
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-30px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// PROJECT PANEL
// Info display for current project
// ==========================================

interface ProjectPanelProps {
  project: VoyageProject;
  scrollProgress: number;
}

function ProjectPanel({ project, scrollProgress }: ProjectPanelProps) {
  const progress =
    (scrollProgress - project.scrollStart) / (project.scrollEnd - project.scrollStart);

  return (
    <div
      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-80 md:w-96 z-30"
      style={{
        opacity: Math.min(1, progress * 3),
        transform: `translateY(-50%) translateX(${Math.max(0, (1 - progress * 3) * 50)}px)`,
      }}
    >
      <div
        className="border bg-black/80 backdrop-blur-md p-6"
        style={{
          borderColor: `var(--neon-${project.color})`,
          boxShadow: `0 0 30px rgba(var(--neon-${project.color}), 0.2)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded border-2 border-${project.color} flex items-center justify-center bg-${project.color}/10`}
          >
            {project.theme === "matrix" && <span className="text-xl">⚡</span>}
            {project.theme === "rainbow" && <span className="text-xl">🎨</span>}
            {project.theme === "minimal" && <span className="text-xl">📝</span>}
          </div>
          <div>
            <div className="text-xs font-mono text-white/40 tracking-widest">PROJECT</div>
            <h3 className={`text-xl font-display text-${project.color}`}>{project.name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm font-mono text-white/70 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 text-[10px] font-mono border border-${project.color}/40 text-${project.color} bg-${project.color}/10`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 py-2 text-center text-sm font-mono border border-${project.color}/50 text-${project.color} hover:bg-${project.color}/10 transition-colors`}
          >
            GitHub
          </Link>
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 py-2 text-center text-sm font-mono bg-${project.color}/20 border border-${project.color} text-${project.color} hover:bg-${project.color}/30 transition-colors`}
            >
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
