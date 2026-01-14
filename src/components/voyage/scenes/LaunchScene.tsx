"use client";

import { motion } from "framer-motion";
import { sceneRanges } from "@/lib/voyage-data";
import { useSceneProgress } from "../VoyageController";

// ==========================================
// LAUNCH SCENE - CINEMATIC LIFTOFF
// Smooth ascent from Earth into space
// Camera stays fixed, Earth gracefully recedes
// ==========================================

interface LaunchSceneProps {
  scrollProgress: number;
}

export function LaunchScene({ scrollProgress }: LaunchSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.launch.start,
    sceneRanges.launch.end
  );

  // Smooth easing for all transitions
  const easeProgress = easeOutCubic(progress);

  // Earth smoothly recedes - starts large, shrinks gracefully
  const earthScale = 1.2 - easeProgress * 0.9;
  const earthY = easeProgress * 80; // Smooth downward movement
  const earthOpacity = 1 - easeProgress * 0.8;

  // Atmosphere haze fades as we leave
  const atmosphereOpacity = Math.max(0, 0.4 - easeProgress * 0.5);

  // Engine glow - builds up then stabilizes
  const engineGlow = progress < 0.3
    ? progress * 2
    : progress < 0.8
    ? 0.6
    : 0.6 - (progress - 0.8) * 3;

  // Telemetry values - smooth interpolation
  const altitude = Math.floor(easeProgress * 400);
  const velocity = Math.floor(easeProgress * 7800);

  // Star density increases as we leave atmosphere
  const starOpacity = Math.min(1, easeProgress * 1.5);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Deep space background - fades in */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: starOpacity }}
        style={{
          background: `
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 80% 60%, white, transparent),
            radial-gradient(1.5px 1.5px at 10% 40%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1.5px 1.5px at 70% 80%, white, transparent),
            radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 30% 90%, white, transparent),
            radial-gradient(1px 1px at 25% 15%, rgba(255,255,255,0.6), transparent)
          `,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Earth - smooth recession animation */}
      <motion.div
        className="absolute left-1/2"
        style={{
          bottom: `${-15 - earthY}%`,
          transform: `translateX(-50%) scale(${earthScale})`,
          opacity: earthOpacity,
          transition: "all 0.3s ease-out",
        }}
      >
        {/* Earth sphere */}
        <div
          className="w-[700px] h-[700px] rounded-full relative"
          style={{
            background: `
              radial-gradient(circle at 35% 35%,
                #6eb5ff 0%,
                #4a90d9 15%,
                #2d6eb5 30%,
                #1a5a8a 45%,
                #0d3a5d 60%,
                #061a2e 80%,
                #020a12 100%)
            `,
            boxShadow: `
              0 0 80px rgba(74,144,217,0.4),
              0 0 160px rgba(74,144,217,0.2),
              inset -50px -50px 100px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Cloud patterns */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 35% 18% at 25% 35%, rgba(255,255,255,0.35) 0%, transparent 70%),
                radial-gradient(ellipse 28% 12% at 55% 28%, rgba(255,255,255,0.3) 0%, transparent 60%),
                radial-gradient(ellipse 45% 22% at 40% 55%, rgba(255,255,255,0.25) 0%, transparent 65%),
                radial-gradient(ellipse 20% 10% at 70% 45%, rgba(255,255,255,0.3) 0%, transparent 55%)
              `,
            }}
          />

          {/* Land masses hint */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 15% 25% at 45% 40%, rgba(34,139,34,0.15) 0%, transparent 70%),
                radial-gradient(ellipse 20% 15% at 35% 55%, rgba(139,90,43,0.1) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* Atmosphere glow ring */}
        <motion.div
          className="absolute inset-[-20px] rounded-full pointer-events-none"
          animate={{ opacity: atmosphereOpacity }}
          style={{
            background: "radial-gradient(circle, transparent 48%, rgba(100,180,255,0.3) 50%, rgba(100,180,255,0.1) 52%, transparent 55%)",
          }}
        />

        {/* Outer atmospheric haze */}
        <motion.div
          className="absolute inset-[-60px] rounded-full pointer-events-none"
          animate={{ opacity: atmosphereOpacity * 0.5 }}
          style={{
            background: "radial-gradient(circle, transparent 45%, rgba(100,150,255,0.15) 50%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Atmospheric haze overlay - fades as we leave */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: atmosphereOpacity }}
        style={{
          background: `
            linear-gradient(to top,
              rgba(100,150,200,0.15) 0%,
              rgba(50,100,150,0.1) 20%,
              transparent 50%)
          `,
        }}
      />

      {/* Engine glow at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        animate={{ opacity: Math.max(0, engineGlow) }}
      >
        {/* Primary engine glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to top,
                rgba(255,120,20,0.5) 0%,
                rgba(255,80,0,0.35) 20%,
                rgba(255,150,50,0.2) 40%,
                rgba(255,200,100,0.08) 60%,
                transparent 100%)
            `,
          }}
        />
        {/* Flickering flame effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.6, 0.35, 0.55, 0.3],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `
              linear-gradient(to top,
                rgba(255,220,150,0.4) 0%,
                rgba(255,180,80,0.2) 25%,
                transparent 50%)
            `,
          }}
        />
      </motion.div>

      {/* Viewport vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 75% at center,
              transparent 40%,
              rgba(0,0,0,0.3) 70%,
              rgba(0,0,0,0.7) 100%)
          `,
        }}
      />

      {/* Launch scene - no title overlay, just the cinematic visuals */}

      {/* Telemetry HUD - minimal */}
      <div className="absolute top-6 left-6 font-mono text-xs pointer-events-none">
        <div className="border border-cyan/30 bg-black/60 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              className="w-2 h-2 rounded-full bg-green"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <span className="text-cyan/60 tracking-widest text-[10px]">LAUNCH PHASE</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between gap-8">
              <span className="text-white/40">ALT</span>
              <span className="text-cyan tabular-nums">{altitude} km</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-white/40">VEL</span>
              <span className="text-green tabular-nums">{velocity} m/s</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-white/40">STATUS</span>
              <motion.span
                className="text-orange"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ASCENDING
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Altitude milestone messages */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        {progress > 0.3 && progress < 0.6 && (
          <motion.div
            className="font-mono text-xs text-cyan/50 tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            PASSING THROUGH STRATOSPHERE
          </motion.div>
        )}
        {progress >= 0.6 && progress < 0.85 && (
          <motion.div
            className="font-mono text-xs text-cyan/50 tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ENTERING MESOSPHERE
          </motion.div>
        )}
        {progress >= 0.85 && (
          <motion.div
            className="font-mono text-xs text-green/60 tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            EXITING ATMOSPHERE
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Smooth easing function
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
