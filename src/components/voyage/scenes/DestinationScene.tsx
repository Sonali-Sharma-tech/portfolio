"use client";

import { useMemo } from "react";
import Link from "next/link";
import { voyageData, sceneRanges } from "@/lib/voyage-data";
import { useSceneProgress } from "../VoyageController";

// ==========================================
// DESTINATION SCENE
// Voyage complete - final celebration
// Refined color palette: slate blues, warm amber, soft whites
// ==========================================

interface DestinationSceneProps {
  scrollProgress: number;
}

// Sophisticated color palette - muted and elegant
const COLORS = {
  primary: "#94a3b8",      // Slate blue-gray
  secondary: "#cbd5e1",    // Light slate
  accent: "#f59e0b",       // Warm amber
  success: "#10b981",      // Emerald (softer green)
  highlight: "#6366f1",    // Indigo
  text: "#e2e8f0",         // Light gray
  muted: "#64748b",        // Muted slate
};

export function DestinationScene({ scrollProgress }: DestinationSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.destination.start,
    sceneRanges.destination.end
  );

  // Generate celebratory particles with refined colors
  const particles = useMemo(() => {
    const particleColors = ["#94a3b8", "#cbd5e1", "#f59e0b", "#6366f1"];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      color: particleColors[i % 4],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
  }, []);

  // Generate spiral galaxy stars with refined colors
  const galaxyStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const armIndex = i % 3;
      const positionInArm = Math.floor(i / 3);
      const baseAngle = (armIndex * Math.PI * 2) / 3 + positionInArm * 0.2;
      const baseRadius = 5 + positionInArm * 3;

      return {
        id: i,
        baseAngle,
        baseRadius,
        size: 1 + (i % 3),
        opacity: 0.2 + (i % 5) * 0.1,
        color: i % 10 === 0 ? "#f59e0b" : i % 15 === 0 ? "#6366f1" : "#ffffff",
      };
    });
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-10 pointer-events-auto">
      {/* Spiral galaxy background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Galaxy center glow - warm amber/indigo blend */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)",
          }}
        />

        {/* Rotating galaxy stars */}
        {galaxyStars.map((star) => {
          const rotationOffset = progress * Math.PI * 2;
          const currentAngle = star.baseAngle + rotationOffset * 0.3;
          const x = 50 + Math.cos(currentAngle) * star.baseRadius;
          const y = 50 + Math.sin(currentAngle) * star.baseRadius;

          return (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: star.color !== "#ffffff" ? `0 0 ${star.size * 2}px ${star.color}` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Celebration particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `float-celebrate ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* Main content - z-20 ensures it's above background, pointer-events-auto on container */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: Math.min(1, progress * 2),
          transform: `scale(${0.9 + progress * 0.1})`,
        }}
      >
        <div className="text-center max-w-2xl px-4 pointer-events-auto">
          {/* Success icon - emerald green */}
          <div
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: COLORS.success,
              boxShadow: `0 0 40px rgba(16,185,129,0.4)`
            }}
          >
            <svg
              className="w-10 h-10 md:w-12 md:h-12"
              style={{ color: COLORS.success }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <div
            className="text-xs font-mono tracking-[0.5em] mb-2"
            style={{ color: `${COLORS.success}99` }}
          >
            MISSION COMPLETE
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            <span className="text-gradient-refined">VOYAGE COMPLETE</span>
          </h1>
          <p className="text-lg font-mono text-white/60 mb-8">
            You&apos;ve witnessed the journey. Now explore the universe.
          </p>

          {/* Stats grid - refined colors */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div
              className="p-4 bg-black/50 backdrop-blur-sm"
              style={{ border: `1px solid ${COLORS.primary}40` }}
            >
              <div
                className="text-3xl md:text-4xl font-mono font-bold"
                style={{ color: COLORS.secondary }}
              >
                {voyageData.stats.years}
              </div>
              <div className="text-xs font-mono text-white/40 mt-1">YEARS</div>
            </div>
            <div
              className="p-4 bg-black/50 backdrop-blur-sm"
              style={{ border: `1px solid ${COLORS.accent}40` }}
            >
              <div
                className="text-3xl md:text-4xl font-mono font-bold"
                style={{ color: COLORS.accent }}
              >
                {voyageData.stats.companies}
              </div>
              <div className="text-xs font-mono text-white/40 mt-1">STATIONS</div>
            </div>
            <div
              className="p-4 bg-black/50 backdrop-blur-sm"
              style={{ border: `1px solid ${COLORS.highlight}40` }}
            >
              <div
                className="text-3xl md:text-4xl font-mono font-bold"
                style={{ color: COLORS.highlight }}
              >
                {voyageData.stats.projects}
              </div>
              <div className="text-xs font-mono text-white/40 mt-1">WORLDS</div>
            </div>
          </div>

          {/* CTA buttons - refined colors, z-30 for extra safety */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-30">
            <Link
              href="/"
              className="px-8 py-4 border-2 font-mono text-sm transition-all tracking-wider font-bold cursor-pointer"
              style={{
                borderColor: COLORS.secondary,
                color: COLORS.secondary,
                boxShadow: `0 0 20px rgba(203,213,225,0.2)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.secondary;
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = COLORS.secondary;
              }}
            >
              HOME BASE
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 border-2 font-mono text-sm transition-all tracking-wider font-bold cursor-pointer"
              style={{
                borderColor: COLORS.success,
                color: COLORS.success,
                boxShadow: `0 0 20px rgba(16,185,129,0.2)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.success;
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = COLORS.success;
              }}
            >
              VIEW PROJECTS
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 font-mono text-sm transition-all tracking-wider font-bold cursor-pointer"
              style={{
                borderColor: COLORS.accent,
                color: COLORS.accent,
                boxShadow: `0 0 20px rgba(245,158,11,0.2)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.accent;
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = COLORS.accent;
              }}
            >
              ABOUT PILOT
            </Link>
          </div>

          {/* Replay hint */}
          <div className="mt-8 relative z-30">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-mono text-white/50 hover:text-white border border-white/20 hover:border-white/50 transition-all cursor-pointer"
            >
              ↻ REPLAY VOYAGE
            </button>
          </div>

          {/* Quote */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm font-mono text-white/40 italic">
              &ldquo;The journey continues...&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Corner accents - refined color */}
      <div className="absolute inset-8 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2" style={{ borderColor: `${COLORS.primary}40` }} />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2" style={{ borderColor: `${COLORS.primary}40` }} />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2" style={{ borderColor: `${COLORS.primary}40` }} />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2" style={{ borderColor: `${COLORS.primary}40` }} />
      </div>

      {/* CSS */}
      <style jsx>{`
        @keyframes float-celebrate {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }
        .text-gradient-refined {
          background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.accent} 50%, ${COLORS.highlight} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
