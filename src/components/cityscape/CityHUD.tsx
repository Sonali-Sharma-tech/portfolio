"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { sceneRanges, cityData } from "@/lib/city-data";
import type { CityCompany, CityProject } from "@/lib/city-data";

// ==========================================
// CITY HUD - CYBERPUNK HEADS-UP DISPLAY
// Persistent navigation and info overlay
// ==========================================

interface CityHUDProps {
  scrollProgress: number;
  currentScene: string;
  activeCompany: CityCompany | null;
  activeProject: CityProject | null;
}

export function CityHUD({
  scrollProgress,
  currentScene,
  activeCompany,
  activeProject,
}: CityHUDProps) {
  const sceneLabels: Record<string, string> = {
    rooftop: "ORIGIN",
    downtown: "CORPORATE DISTRICT",
    portal: "DATA STREAM",
    districts: "PROJECT ZONE",
    skyline: "DESTINATION",
  };

  const currentWaypoint = activeCompany?.name || activeProject?.name || sceneLabels[currentScene];

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Mission status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest">
                ONLINE
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
              {sceneLabels[currentScene]}
            </span>
          </div>

          {/* Center: Current waypoint */}
          <motion.div
            key={currentWaypoint}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-mono tracking-wider"
            style={{
              color: activeCompany?.neonColor || activeProject?.neonColor || '#00fff5',
            }}
          >
            {currentWaypoint}
          </motion.div>

          {/* Right: Progress + Exit */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono text-white/40 tracking-widest">
                PROGRESS
              </div>
              <div className="text-sm font-mono text-white">
                {scrollProgress.toFixed(1)}%
              </div>
            </div>
            <Link
              href="/"
              className="text-[10px] font-mono text-white/40 hover:text-cyan-400 transition-colors tracking-widest pointer-events-auto"
            >
              ← EXIT
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Scene markers */}
          <div className="relative h-8 mb-1">
            {Object.entries(sceneRanges).map(([scene, range]) => {
              const midpoint = (range.start + range.end) / 2;
              const isActive = currentScene === scene;

              return (
                <div
                  key={scene}
                  className="absolute -translate-x-1/2 text-center"
                  style={{ left: `${midpoint}%` }}
                >
                  <div
                    className={`w-1 h-2 mx-auto mb-1 transition-colors ${
                      isActive ? 'bg-cyan-400' : 'bg-white/20'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-mono tracking-widest transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-white/30'
                    }`}
                  >
                    {scene.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress track */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            {/* Gradient progress fill */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${scrollProgress}%`,
                background: 'linear-gradient(90deg, #00fff5, #ff00ff, #00ff88)',
              }}
              transition={{ duration: 0.1 }}
            />

            {/* Current position indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-cyan-500/50"
              style={{ left: `${scrollProgress}%`, x: '-50%' }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Company markers on timeline */}
          <div className="relative h-4 mt-1">
            {cityData.companies.map((company) => {
              const midpoint = (company.scrollStart + company.scrollEnd) / 2;
              const isPast = scrollProgress > company.scrollEnd;
              const isActive = activeCompany?.id === company.id;

              return (
                <div
                  key={company.id}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${midpoint}%` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: isActive
                        ? company.neonColor
                        : isPast
                        ? company.neonColor
                        : 'rgba(255,255,255,0.2)',
                      boxShadow: isActive ? `0 0 8px ${company.neonColor}` : 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scanlines overlay for cyberpunk effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />
    </div>
  );
}
