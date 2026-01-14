"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// SPACESHIP PILOT CONTROLLER
// Creates immersive first-person space flight
// - UP ARROW: Thrust forward (dive deeper into space)
// - LEFT/RIGHT: Bank and strafe (space moves opposite)
// - SHIFT: Boost for hyperspeed effect
// ==========================================

interface SpaceshipPilotProps {
  onProgressChange: (delta: number) => void;
  onLateralChange: (lateral: number, roll: number) => void;
  currentProgress: number;
  hasLaunched: boolean;
  onLaunch: () => void;
}

// Check if voyage is complete
const isVoyageComplete = (progress: number) => progress >= 98;

interface ShipState {
  thrust: number;
  lateralPosition: number;
  roll: number;
  pitch: number;
  speed: number;
  boostActive: boolean;
}

interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
  space: boolean;
}

export function SpaceshipPilot({
  onProgressChange,
  onLateralChange,
  currentProgress,
  hasLaunched,
  onLaunch,
}: SpaceshipPilotProps) {
  // Check if voyage is complete - hide cockpit HUD to allow button clicks
  const voyageComplete = isVoyageComplete(currentProgress);
  const [keys, setKeys] = useState<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    space: false,
  });

  const [ship, setShip] = useState<ShipState>({
    thrust: 0,
    lateralPosition: 0,
    roll: 0,
    pitch: 0,
    speed: 0,
    boostActive: false,
  });

  const [showControls, setShowControls] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    setKeys((prev) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return { ...prev, up: true };
        case 'ArrowDown':
        case 's':
        case 'S':
          return { ...prev, down: true };
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return { ...prev, left: true };
        case 'ArrowRight':
        case 'd':
        case 'D':
          return { ...prev, right: true };
        case 'Shift':
          return { ...prev, shift: true };
        case ' ':
          return { ...prev, space: true };
        default:
          return prev;
      }
    });

    if (!hasLaunched && (e.key === ' ' || e.key === 'ArrowUp')) {
      onLaunch();
      setShowControls(false);
    }
  }, [hasLaunched, onLaunch]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return { ...prev, up: false };
        case 'ArrowDown':
        case 's':
        case 'S':
          return { ...prev, down: false };
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return { ...prev, left: false };
        case 'ArrowRight':
        case 'd':
        case 'D':
          return { ...prev, right: false };
        case 'Shift':
          return { ...prev, shift: false };
        case ' ':
          return { ...prev, space: false };
        default:
          return prev;
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Game loop
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = timestamp;

      // Disable all controls when voyage is complete
      const voyageComplete = isVoyageComplete(currentProgress);

      setShip((prev) => {
        // If voyage is complete, gradually bring ship to rest
        if (voyageComplete) {
          return {
            thrust: prev.thrust * 0.9,
            lateralPosition: prev.lateralPosition * 0.95,
            roll: prev.roll * 0.95,
            pitch: prev.pitch * 0.9,
            speed: prev.speed * 0.95,
            boostActive: false,
          };
        }

        const thrustAcceleration = keys.shift ? 0.08 : 0.04;
        const lateralSpeed = 0.06;
        const friction = 0.96;
        const rollSpeed = 0.12;
        const maxSpeed = keys.shift ? 2.5 : 1.2;

        let newThrust = prev.thrust;
        let newSpeed = prev.speed;

        if (keys.up && hasLaunched) {
          newThrust = Math.min(1, prev.thrust + thrustAcceleration);
          newSpeed = Math.min(maxSpeed, prev.speed + thrustAcceleration * 0.5);
        } else if (keys.down && hasLaunched) {
          newThrust = Math.max(0, prev.thrust - 0.03);
          newSpeed = Math.max(0, prev.speed - 0.02);
        } else {
          newThrust = prev.thrust * 0.92;
          newSpeed = prev.speed * friction;
        }

        let newLateral = prev.lateralPosition;
        let newRoll = prev.roll;

        if (keys.left) {
          newLateral = Math.max(-1, prev.lateralPosition - lateralSpeed);
          newRoll = Math.max(-1, prev.roll - rollSpeed);
        } else if (keys.right) {
          newLateral = Math.min(1, prev.lateralPosition + lateralSpeed);
          newRoll = Math.min(1, prev.roll + rollSpeed);
        } else {
          newLateral = prev.lateralPosition * 0.9;
          newRoll = prev.roll * 0.88;
        }

        const newPitch = keys.up ? Math.min(0.4, prev.pitch + 0.03) : prev.pitch * 0.9;

        // Notify parent of lateral movement for environment shift
        onLateralChange(newLateral, newRoll);

        return {
          thrust: newThrust,
          lateralPosition: newLateral,
          roll: newRoll,
          pitch: newPitch,
          speed: newSpeed,
          boostActive: keys.shift && keys.up,
        };
      });

      // Only allow progress changes if voyage not complete
      if (hasLaunched && keys.up && !voyageComplete) {
        const progressDelta = ship.speed * 0.18 * deltaTime * 60;
        if (currentProgress < 100) {
          onProgressChange(progressDelta);
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [keys, hasLaunched, ship.speed, currentProgress, onProgressChange, onLateralChange]);

  useEffect(() => {
    if (hasLaunched) {
      const timer = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [hasLaunched]);

  return (
    <>
      {/* Cockpit HUD - minimal, doesn't obstruct view */}
      {/* Hide completely when voyage is complete to allow CTA button clicks */}
      {!voyageComplete && (
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          transform: `
            perspective(1200px)
            rotateZ(${ship.roll * -8}deg)
            rotateX(${ship.pitch * 3}deg)
          `,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Minimal cockpit frame - corners only */}
        <div className="absolute inset-4 pointer-events-none">
          {/* Top-left corner */}
          <div className="absolute top-0 left-0 w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan/40 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-cyan/40 to-transparent" />
          </div>
          {/* Top-right corner */}
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan/40 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-cyan/40 to-transparent" />
          </div>
          {/* Bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-20 h-20">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-magenta/40 to-transparent" />
            <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-magenta/40 to-transparent" />
          </div>
          {/* Bottom-right corner */}
          <div className="absolute bottom-0 right-0 w-20 h-20">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-magenta/40 to-transparent" />
            <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-magenta/40 to-transparent" />
          </div>
        </div>

        {/* Center reticle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative"
            animate={{
              scale: 1 + ship.thrust * 0.15,
              opacity: hasLaunched ? 0.7 : 0,
            }}
          >
            {/* Outer ring */}
            <div className="w-16 h-16 border border-cyan/30 rounded-full" />
            {/* Inner crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-cyan/50" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-4 bg-cyan/50" />
            </div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan"
                animate={{
                  boxShadow: ship.thrust > 0.5
                    ? '0 0 20px rgba(0,255,245,0.8)'
                    : '0 0 8px rgba(0,255,245,0.5)'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom HUD bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8">
          {/* Speed */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan/50 text-[10px]">VEL</span>
            <div className="w-20 h-1 bg-black/50 rounded overflow-hidden">
              <motion.div
                className="h-full bg-cyan"
                animate={{ width: `${Math.min(100, ship.speed * 45)}%` }}
              />
            </div>
            <span className="text-cyan w-16">{(ship.speed * 1200).toFixed(0)} m/s</span>
          </div>

          {/* Thrust */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-orange/50 text-[10px]">THR</span>
            <div className="w-20 h-1 bg-black/50 rounded overflow-hidden">
              <motion.div
                className="h-full bg-orange"
                animate={{ width: `${ship.thrust * 100}%` }}
              />
            </div>
            <span className="text-orange w-12">{(ship.thrust * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Boost indicator */}
        <AnimatePresence>
          {ship.boostActive && (
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="font-mono text-xs text-magenta flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  ◆
                </motion.span>
                HYPERDRIVE ENGAGED
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  ◆
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Engine glow reflection on bottom of screen */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          animate={{
            opacity: ship.thrust * 0.6,
          }}
          style={{
            background: `linear-gradient(to top,
              rgba(255,100,0,${ship.thrust * 0.4}) 0%,
              rgba(255,50,0,${ship.thrust * 0.2}) 30%,
              transparent 100%)`,
          }}
        />
      </div>
      )}

      {/* Speed lines removed per user request - cleaner view */}

      {/* Subtle bottom controls hint - replaces modal */}
      <AnimatePresence>
        {!hasLaunched && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              {/* Launch prompt */}
              <motion.div
                className="mb-3 text-xl font-display text-magenta tracking-widest"
                animate={{ opacity: [1, 0.4, 1], textShadow: ['0 0 10px rgba(255,0,255,0.5)', '0 0 25px rgba(255,0,255,0.8)', '0 0 10px rgba(255,0,255,0.5)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                PRESS ↑ TO LAUNCH
              </motion.div>

              {/* Compact control hints */}
              <div className="bg-black/70 backdrop-blur-sm border border-cyan/30 px-5 py-2.5 font-mono text-xs inline-flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="w-6 h-6 border border-cyan flex items-center justify-center text-cyan text-sm"
                    animate={{ borderColor: ['rgba(0,255,245,0.5)', 'rgba(0,255,245,1)', 'rgba(0,255,245,0.5)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↑
                  </motion.span>
                  <span className="text-white/50">Thrust</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <span className="flex gap-0.5">
                    <span className="w-6 h-6 border border-cyan/40 flex items-center justify-center text-cyan/50 text-sm">←</span>
                    <span className="w-6 h-6 border border-cyan/40 flex items-center justify-center text-cyan/50 text-sm">→</span>
                  </span>
                  <span className="text-white/50">Strafe</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <span className="text-magenta/70 text-[10px]">SHIFT</span>
                  <span className="text-white/50">Boost</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini hint after launch */}
      <AnimatePresence>
        {hasLaunched && showControls && (
          <motion.div
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/80 border border-cyan/30 px-5 py-2 font-mono text-xs rounded">
              <span className="text-cyan">↑</span> Thrust
              <span className="mx-4 text-white/20">|</span>
              <span className="text-cyan">← →</span> Bank
              <span className="mx-4 text-white/20">|</span>
              <span className="text-magenta">SHIFT</span> Hyperdrive
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
