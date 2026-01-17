"use client";

import { useRef, useState, useCallback, useEffect, ReactNode } from "react";
import { useMotionValue, MotionValue } from "framer-motion";
import {
  getConstellationScene,
  getActiveStar,
  getIlluminatedStars,
  constellationSceneRanges,
} from "@/lib/voyage-data";
import type { StarPosition } from "@/lib/voyage-data";

// ==========================================
// CONSTELLATION CONTROLLER
// Manages keyboard navigation through the star chart
// Arrow keys to navigate, Shift for boost
// ==========================================

interface ConstellationState {
  progress: number;
  currentScene: string;
  activeStar: StarPosition | null;
  illuminatedStars: string[];
  lateralOffset: number;
  cameraRoll: number;
  isMoving: boolean;
  isBoosting: boolean;
  progressMotion: MotionValue<number>;
}

interface ConstellationControllerProps {
  children: (state: ConstellationState) => ReactNode;
}

export function ConstellationController({ children }: ConstellationControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [lateralOffset, setLateralOffset] = useState(0);
  const [cameraRoll, setCameraRoll] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  // Motion value for smooth animations
  const progressMotion = useMotionValue(0);

  // Keyboard state tracking
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrame = useRef<number | null>(null);

  // Movement speeds
  const BASE_SPEED = 0.15;
  const BOOST_MULTIPLIER = 2.5;
  const LATERAL_SPEED = 0.08;
  const LATERAL_DECAY = 0.92;
  const ROLL_AMOUNT = 8;
  const ROLL_DECAY = 0.9;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'Shift'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current.add(e.key.toLowerCase());

      if (e.key === 'Shift') {
        setIsBoosting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());

      if (e.key === 'Shift') {
        setIsBoosting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main animation loop for movement
  useEffect(() => {
    let lastTime = performance.now();

    const updateMovement = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = currentTime;

      const keys = keysPressed.current;
      const boost = keys.has('shift') ? BOOST_MULTIPLIER : 1;

      let moving = false;
      let newLateral = lateralOffset;
      let newRoll = cameraRoll;

      // Forward/backward movement
      if (keys.has('arrowup') || keys.has('w')) {
        setProgress(prev => {
          const newProgress = Math.min(100, prev + BASE_SPEED * boost * delta);
          progressMotion.set(newProgress / 100);
          return newProgress;
        });
        moving = true;
      }

      if (keys.has('arrowdown') || keys.has('s')) {
        setProgress(prev => {
          const newProgress = Math.max(0, prev - BASE_SPEED * boost * delta * 0.5);
          progressMotion.set(newProgress / 100);
          return newProgress;
        });
        moving = true;
      }

      // Lateral movement (strafe)
      if (keys.has('arrowleft') || keys.has('a')) {
        newLateral = Math.max(-1, lateralOffset - LATERAL_SPEED * delta);
        newRoll = Math.min(ROLL_AMOUNT, cameraRoll + 0.5 * delta);
        moving = true;
      }

      if (keys.has('arrowright') || keys.has('d')) {
        newLateral = Math.min(1, lateralOffset + LATERAL_SPEED * delta);
        newRoll = Math.max(-ROLL_AMOUNT, cameraRoll - 0.5 * delta);
        moving = true;
      }

      // Apply decay when not pressing lateral keys
      if (!keys.has('arrowleft') && !keys.has('a') && !keys.has('arrowright') && !keys.has('d')) {
        newLateral *= LATERAL_DECAY;
        newRoll *= ROLL_DECAY;

        // Snap to zero when very small
        if (Math.abs(newLateral) < 0.01) newLateral = 0;
        if (Math.abs(newRoll) < 0.1) newRoll = 0;
      }

      setLateralOffset(newLateral);
      setCameraRoll(newRoll);
      setIsMoving(moving);

      animationFrame.current = requestAnimationFrame(updateMovement);
    };

    animationFrame.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [lateralOffset, cameraRoll, progressMotion]);

  // Focus container on mount for keyboard input
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Compute current state
  const currentScene = getConstellationScene(progress);
  const activeStar = getActiveStar(progress);
  const illuminatedStars = getIlluminatedStars(progress);

  const state: ConstellationState = {
    progress,
    currentScene,
    activeStar,
    illuminatedStars,
    lateralOffset,
    cameraRoll,
    isMoving,
    isBoosting,
    progressMotion,
  };

  return (
    <div
      ref={containerRef}
      className="constellation-container fixed inset-0 overflow-hidden bg-[#030318] outline-none"
      tabIndex={0}
    >
      {/* Viewport with camera transforms */}
      <div
        className="constellation-viewport absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `
            translateX(${lateralOffset * -60}px)
            rotateZ(${cameraRoll}deg)
          `,
        }}
      >
        {children(state)}
      </div>

      {/* Keyboard hints - fade out after first movement */}
      <KeyboardHints hasStarted={progress > 2} />
    </div>
  );
}

// Keyboard hints overlay
function KeyboardHints({ hasStarted }: { hasStarted: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-1000 ${
        hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-6 px-6 py-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <kbd className="w-8 h-6 flex items-center justify-center bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/70">
              W
            </kbd>
            <div className="flex gap-1">
              <kbd className="w-8 h-6 flex items-center justify-center bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/70">
                A
              </kbd>
              <kbd className="w-8 h-6 flex items-center justify-center bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/70">
                S
              </kbd>
              <kbd className="w-8 h-6 flex items-center justify-center bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/70">
                D
              </kbd>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/50 ml-2">Navigate</span>
        </div>

        <div className="w-px h-8 bg-white/10" />

        <div className="flex items-center gap-2">
          <kbd className="px-3 h-6 flex items-center justify-center bg-white/10 border border-white/20 rounded text-[10px] font-mono text-white/70">
            SHIFT
          </kbd>
          <span className="text-[10px] font-mono text-white/50">Boost</span>
        </div>
      </div>
    </div>
  );
}
