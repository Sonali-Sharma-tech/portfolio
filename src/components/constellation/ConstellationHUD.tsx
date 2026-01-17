"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { constellationSceneRanges, voyageData } from "@/lib/voyage-data";

// ==========================================
// CONSTELLATION HUD
// Minimal overlay with progress and navigation
// ==========================================

interface ConstellationHUDProps {
  progress: number;
  currentScene: string;
  isBoosting: boolean;
}

// Scene labels for display
const SCENE_LABELS: Record<string, string> = {
  intro: "CHARTING COURSE",
  origin: "ORIGIN STAR",
  career: "CAREER PATH",
  warp: "WARP TRANSIT",
  projects: "PROJECT NEBULA",
  reveal: "CONSTELLATION COMPLETE",
};

export function ConstellationHUD({
  progress,
  currentScene,
  isBoosting,
}: ConstellationHUDProps) {
  const sceneLabel = SCENE_LABELS[currentScene] || "NAVIGATING";

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          {/* Left - Scene indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isBoosting ? 'bg-orange animate-pulse' : 'bg-cyan'}`} />
              <span className="text-xs font-mono text-cyan/80 tracking-widest">
                {sceneLabel}
              </span>
            </div>
          </div>

          {/* Center - Progress */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="text-xs font-mono text-white/40">PROGRESS</span>
            <span className="text-lg font-mono text-cyan tabular-nums">
              {Math.floor(progress)}%
            </span>
          </div>

          {/* Right - Exit */}
          <Link
            href="/"
            className="text-xs font-mono text-orange/60 hover:text-orange transition-colors pointer-events-auto px-3 py-1.5 border border-orange/20 hover:border-orange/40"
          >
            ← EXIT
          </Link>
        </div>
      </div>

      {/* Bottom progress visualization */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
          {/* Star markers on progress bar */}
          <div className="relative h-6 mb-2">
            {/* Origin marker */}
            <StarMarker position={10} label="Origin" isActive={currentScene === 'origin'} isPassed={progress >= 10} />

            {/* Career markers */}
            <StarMarker position={25} label="EY" isActive={progress >= 20 && progress < 37} isPassed={progress >= 25} color="orange" />
            <StarMarker position={37} label="6figr" isActive={progress >= 37 && progress < 50} isPassed={progress >= 37} color="green" />
            <StarMarker position={50} label="CF" isActive={progress >= 50 && progress < 62} isPassed={progress >= 50} color="magenta" />
            <StarMarker position={62} label="Glance" isActive={progress >= 62 && progress < 65} isPassed={progress >= 62} color="cyan" />

            {/* Warp zone */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-cyan/30 via-magenta/50 to-cyan/30"
              style={{ left: '65%', width: '10%' }}
            />

            {/* Project markers */}
            <StarMarker position={80} label="DT" isActive={progress >= 75 && progress < 87} isPassed={progress >= 80} color="green" />
            <StarMarker position={87} label="CE" isActive={progress >= 87 && progress < 93} isPassed={progress >= 87} color="magenta" />
            <StarMarker position={93} label="BN" isActive={progress >= 93 && progress < 95} isPassed={progress >= 93} color="cyan" />
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              style={{
                background: `linear-gradient(90deg,
                  #ffd700 0%,
                  #ff8844 25%,
                  #44ff88 50%,
                  #ff44aa 65%,
                  #44ffff 100%
                )`,
              }}
            />

            {/* Current position indicator */}
            <motion.div
              className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
              initial={{ left: 0 }}
              animate={{ left: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              style={{
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            />
          </div>

          {/* Stats summary - visible in reveal scene */}
          {currentScene === 'reveal' && (
            <motion.div
              className="flex justify-center gap-8 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <StatBadge label="Years" value={voyageData.stats.years} color="gold" />
              <StatBadge label="Companies" value={voyageData.stats.companies.toString()} color="cyan" />
              <StatBadge label="Projects" value={voyageData.stats.projects.toString()} color="magenta" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Intro overlay */}
      {currentScene === 'intro' && progress < 5 && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: progress > 2 ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-display text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Chart Your Journey
            </motion.h1>
            <motion.p
              className="text-lg font-mono text-white/60 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Navigate through the constellation of my career
            </motion.p>
            <motion.div
              className="text-sm font-mono text-cyan animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Press W or ▲ to begin
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Reveal overlay */}
      {currentScene === 'reveal' && progress >= 98 && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              ✨
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold via-cyan to-magenta mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Constellation Complete
            </motion.h2>
            <motion.p
              className="text-lg font-mono text-white/60 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Your journey has been charted
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex gap-4 justify-center pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link
                href="/contact"
                className="px-6 py-3 bg-cyan/20 border border-cyan text-cyan font-mono text-sm hover:bg-cyan/30 transition-colors"
              >
                Contact Me
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3 bg-magenta/20 border border-magenta text-magenta font-mono text-sm hover:bg-magenta/30 transition-colors"
              >
                View Projects
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border border-white/30 text-white/70 font-mono text-sm hover:bg-white/20 transition-colors"
              >
                Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}

// Star marker on progress bar
function StarMarker({
  position,
  label,
  isActive,
  isPassed,
  color = 'gold',
}: {
  position: number;
  label: string;
  isActive: boolean;
  isPassed: boolean;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    gold: '#ffd700',
    orange: '#ff8844',
    green: '#44ff88',
    magenta: '#ff44aa',
    cyan: '#44ffff',
  };
  const hexColor = colorMap[color] || colorMap.gold;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ left: `${position}%` }}
    >
      <div
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive ? 'scale-150' : ''
        }`}
        style={{
          backgroundColor: isPassed ? hexColor : '#333',
          boxShadow: isActive ? `0 0 10px ${hexColor}` : 'none',
        }}
      />
      <span
        className={`text-[8px] font-mono mt-1 transition-colors ${
          isActive ? 'text-white' : 'text-white/30'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// Stat badge for reveal screen
function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    gold: '#ffd700',
    cyan: '#44ffff',
    magenta: '#ff44aa',
  };
  const hexColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="text-center">
      <div
        className="text-3xl font-display font-bold mb-1"
        style={{ color: hexColor }}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono text-white/50 tracking-widest">
        {label.toUpperCase()}
      </div>
    </div>
  );
}
