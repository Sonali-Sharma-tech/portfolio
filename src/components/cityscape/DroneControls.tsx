"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ==========================================
// DRONE CONTROLS
// Cyberpunk-styled vehicle controls
// Keyboard + touch support
// ==========================================

interface DroneControlsProps {
  onProgressChange: (delta: number) => void;
  onLateralChange: (lateral: number, roll: number) => void;
  currentProgress: number;
  hasLaunched: boolean;
  onLaunch: () => void;
}

export function DroneControls({
  onProgressChange,
  onLateralChange,
  currentProgress,
  hasLaunched,
  onLaunch,
}: DroneControlsProps) {
  // Track key states
  const keysRef = useRef<Set<string>>(new Set());
  const frameRef = useRef<number | null>(null);

  // Drone state
  const [thrust, setThrust] = useState(0);
  const lateralRef = useRef(0);
  const rollRef = useRef(0);

  // Touch state for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Physics constants
  const THRUST_ACCELERATION = 0.08;
  const THRUST_DECAY = 0.95;
  const LATERAL_SPEED = 0.08;
  const LATERAL_DECAY = 0.92;
  const BOOST_MULTIPLIER = 2.5;

  // Main game loop
  const gameLoop = useCallback(() => {
    const keys = keysRef.current;
    let currentThrust = thrust;

    // Forward/backward thrust
    if (keys.has("ArrowUp") || keys.has("KeyW")) {
      const boost = keys.has("ShiftLeft") || keys.has("ShiftRight") ? BOOST_MULTIPLIER : 1;
      currentThrust = Math.min(1, currentThrust + THRUST_ACCELERATION * boost);
    } else if (keys.has("ArrowDown") || keys.has("KeyS")) {
      currentThrust = Math.max(-0.3, currentThrust - THRUST_ACCELERATION * 0.5);
    } else {
      currentThrust *= THRUST_DECAY;
      if (Math.abs(currentThrust) < 0.01) currentThrust = 0;
    }

    // Lateral movement
    if (keys.has("ArrowLeft") || keys.has("KeyA")) {
      lateralRef.current = Math.max(-1, lateralRef.current - LATERAL_SPEED);
      rollRef.current = Math.max(-1, rollRef.current - LATERAL_SPEED * 0.8);
    } else if (keys.has("ArrowRight") || keys.has("KeyD")) {
      lateralRef.current = Math.min(1, lateralRef.current + LATERAL_SPEED);
      rollRef.current = Math.min(1, rollRef.current + LATERAL_SPEED * 0.8);
    } else {
      lateralRef.current *= LATERAL_DECAY;
      rollRef.current *= LATERAL_DECAY;
      if (Math.abs(lateralRef.current) < 0.01) lateralRef.current = 0;
      if (Math.abs(rollRef.current) < 0.01) rollRef.current = 0;
    }

    // Apply changes
    if (hasLaunched && currentThrust !== 0) {
      onProgressChange(currentThrust * 0.3);
    }
    onLateralChange(lateralRef.current, rollRef.current);
    setThrust(currentThrust);

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [thrust, hasLaunched, onProgressChange, onLateralChange]);

  // Start game loop
  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameLoop]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);

      // Launch on space
      if (e.code === "Space" && !hasLaunched) {
        e.preventDefault();
        onLaunch();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [hasLaunched, onLaunch]);

  // Touch handlers for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Vertical swipe = thrust
      if (Math.abs(deltaY) > 10) {
        const thrustDelta = -deltaY * 0.001;
        if (hasLaunched) onProgressChange(thrustDelta);
      }

      // Horizontal swipe = lateral
      if (Math.abs(deltaX) > 10) {
        lateralRef.current = Math.max(-1, Math.min(1, deltaX * 0.005));
        rollRef.current = lateralRef.current * 0.8;
        onLateralChange(lateralRef.current, rollRef.current);
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [hasLaunched, onProgressChange, onLateralChange]);

  const isBoost = keysRef.current.has("ShiftLeft") || keysRef.current.has("ShiftRight");

  return (
    <>
      {/* Cockpit HUD overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Cockpit frame - cyberpunk style */}
        <div className="absolute inset-0">
          {/* Top corners */}
          <div className="absolute top-3 left-3 w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" />
            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-cyan-500/60 to-transparent" />
          </div>
          <div className="absolute top-3 right-3 w-20 h-20">
            <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-500/60 to-transparent" />
            <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-cyan-500/60 to-transparent" />
          </div>

          {/* Bottom corners */}
          <div className="absolute bottom-3 left-3 w-20 h-20">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-magenta-500/60 to-transparent" style={{ background: 'linear-gradient(to right, rgba(255,0,255,0.6), transparent)' }} />
            <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-magenta-500/60 to-transparent" style={{ background: 'linear-gradient(to top, rgba(255,0,255,0.6), transparent)' }} />
          </div>
          <div className="absolute bottom-3 right-3 w-20 h-20">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-magenta-500/60 to-transparent" style={{ background: 'linear-gradient(to left, rgba(255,0,255,0.6), transparent)' }} />
            <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-magenta-500/60 to-transparent" style={{ background: 'linear-gradient(to top, rgba(255,0,255,0.6), transparent)' }} />
          </div>
        </div>

        {/* Center reticle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
          style={{ transform: `translate(-50%, -50%) scale(${1 + thrust * 0.3})` }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-1/2 w-0.5 h-2 -translate-x-1/2 bg-cyan-500/50" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-2 -translate-x-1/2 bg-cyan-500/50" />
            <div className="absolute left-0 top-1/2 w-2 h-0.5 -translate-y-1/2 bg-cyan-500/50" />
            <div className="absolute right-0 top-1/2 w-2 h-0.5 -translate-y-1/2 bg-cyan-500/50" />
          </div>
        </div>

        {/* Boost indicator */}
        {isBoost && thrust > 0.1 && (
          <div className="absolute left-1/2 bottom-32 -translate-x-1/2 text-center">
            <div className="text-xs font-mono tracking-widest text-cyan-400 animate-pulse">
              BOOST ACTIVE
            </div>
          </div>
        )}

        {/* Bottom HUD */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8">
          {/* Velocity meter */}
          <div className="text-center">
            <div className="text-[10px] font-mono text-white/40 mb-1">VEL</div>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${Math.abs(thrust) * 100}%`,
                  background: thrust > 0.7 ? '#ff00ff' : '#00fff5',
                }}
              />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: thrust > 0.7 ? '#ff00ff' : '#00fff5' }}>
              {Math.round(thrust * 100)}%
            </div>
          </div>

          {/* Progress */}
          <div className="text-center">
            <div className="text-[10px] font-mono text-white/40 mb-1">DIST</div>
            <div className="text-lg font-mono text-white">
              {currentProgress.toFixed(1)}%
            </div>
          </div>

          {/* Lateral indicator */}
          <div className="text-center">
            <div className="text-[10px] font-mono text-white/40 mb-1">LAT</div>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 h-full w-1 bg-cyan-500 transition-all duration-100 rounded-full"
                style={{
                  left: `${50 + lateralRef.current * 50}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Engine glow at bottom */}
        {thrust > 0.1 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${thrust > 0.7 ? 'rgba(255,0,255,0.3)' : 'rgba(0,255,245,0.2)'} 0%, transparent 100%)`,
              opacity: thrust,
            }}
          />
        )}
      </div>

      {/* Launch prompt */}
      {!hasLaunched && (
        <div className="fixed inset-0 flex items-end justify-center pb-32 pointer-events-none z-40">
          <div className="text-center animate-pulse">
            <div className="text-cyan-400 font-mono text-sm tracking-widest mb-2">
              PRESS SPACE OR TAP TO
            </div>
            <div
              className="text-2xl font-bold tracking-wider cursor-pointer pointer-events-auto"
              style={{
                background: 'linear-gradient(90deg, #00fff5, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              onClick={onLaunch}
            >
              INITIATE FLIGHT
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {hasLaunched && currentProgress < 20 && (
        <div className="fixed bottom-20 left-4 text-xs font-mono text-white/30 z-40">
          <div>W/↑ Accelerate</div>
          <div>A/D/←/→ Strafe</div>
          <div>SHIFT Boost</div>
        </div>
      )}
    </>
  );
}
