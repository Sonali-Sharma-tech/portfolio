"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { motion, MotionValue, useMotionValue } from "framer-motion";
import { getCurrentScene, getActiveCompany, getActiveProject, sceneRanges } from "@/lib/voyage-data";
import type { VoyageCompany, VoyageProject } from "@/lib/voyage-data";
import { SpaceshipPilot } from "./SpaceshipPilot";

// ==========================================
// VOYAGE CONTROLLER
// Now uses keyboard-based spaceship controls!
// - UP ARROW / W: Thrust forward through the journey
// - LEFT/RIGHT / A/D: Strafe the spaceship
// - SHIFT: Boost for faster travel
// ==========================================

interface VoyageState {
  scrollProgress: number;
  currentScene: string;
  activeCompany: VoyageCompany | null;
  activeProject: VoyageProject | null;
  isLaunching: boolean;
  isInWormhole: boolean;
  scrollYProgress: MotionValue<number>;
  startVoyage: () => void;
  hasStarted: boolean;
  shipLateralPosition: number;
  shipRoll: number;
}

interface VoyageControllerProps {
  children: (state: VoyageState) => ReactNode;
}

export function VoyageController({ children }: VoyageControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [shipLateralPosition, setShipLateralPosition] = useState(0);
  const [shipRoll, setShipRoll] = useState(0);

  // Create a motion value for compatibility with existing code
  const scrollYProgress = useMotionValue(progress / 100);

  // Handle progress changes from spaceship controls
  const handleProgressChange = useCallback((delta: number) => {
    setProgress((prev) => {
      const newProgress = Math.min(100, Math.max(0, prev + delta));
      scrollYProgress.set(newProgress / 100);
      return newProgress;
    });
  }, [scrollYProgress]);

  // Handle lateral movement for environment shift
  const handleLateralChange = useCallback((lateral: number, roll: number) => {
    setShipLateralPosition(lateral);
    setShipRoll(roll);
  }, []);

  // Function to start the voyage (triggered by spaceship controls)
  const startVoyage = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      // Initial launch boost - move to 15% quickly
      const launchDuration = 2000;
      const startTime = performance.now();
      const targetProgress = 15;

      const animateLaunch = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / launchDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        const newProgress = targetProgress * eased;
        setProgress(newProgress);
        scrollYProgress.set(newProgress / 100);

        if (t < 1) {
          requestAnimationFrame(animateLaunch);
        }
      };

      requestAnimationFrame(animateLaunch);
    }
  }, [hasStarted, scrollYProgress]);

  // Compute current state based on keyboard-controlled progress
  const currentScene = getCurrentScene(progress);
  const activeCompany = getActiveCompany(progress);
  const activeProject = getActiveProject(progress);
  const isLaunching = progress >= sceneRanges.launch.start && progress < sceneRanges.launch.end;
  const isInWormhole = progress >= sceneRanges.wormhole.start && progress < sceneRanges.wormhole.end;

  const state: VoyageState = {
    scrollProgress: progress,
    currentScene,
    activeCompany,
    activeProject,
    isLaunching,
    isInWormhole,
    scrollYProgress,
    startVoyage,
    hasStarted,
    shipLateralPosition,
    shipRoll,
  };

  return (
    <div
      ref={containerRef}
      className="voyage-container fixed inset-0 overflow-hidden bg-black"
      tabIndex={0}
    >
      {/* Main scene viewport - shifts opposite to ship movement */}
      <div
        className="voyage-viewport absolute inset-0"
        style={{
          transform: `
            translateX(${shipLateralPosition * -80}px)
            rotateZ(${shipRoll * 3}deg)
          `,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {children(state)}
      </div>

      {/* Spaceship pilot controls */}
      <SpaceshipPilot
        onProgressChange={handleProgressChange}
        onLateralChange={handleLateralChange}
        currentProgress={progress}
        hasLaunched={hasStarted}
        onLaunch={startVoyage}
      />

      {/* HUD elements handled by VoyageHUD and SpaceshipPilot */}
    </div>
  );
}

// ==========================================
// SCENE WRAPPER WITH FRAMER MOTION
// Animated visibility based on scroll progress
// ==========================================

interface SceneWrapperProps {
  children: ReactNode;
  sceneStart: number;
  sceneEnd: number;
  scrollProgress: number;
  className?: string;
}

export function SceneWrapper({
  children,
  sceneStart,
  sceneEnd,
  scrollProgress,
  className = "",
}: SceneWrapperProps) {
  const isActive = scrollProgress >= sceneStart && scrollProgress < sceneEnd;
  const sceneProgress = isActive
    ? (scrollProgress - sceneStart) / (sceneEnd - sceneStart)
    : scrollProgress < sceneStart
    ? 0
    : 1;

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        visibility: isActive ? "visible" : "hidden",
        "--scene-progress": sceneProgress,
      } as React.CSSProperties}
      data-scene-active={isActive}
      data-scene-progress={sceneProgress}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// UTILITY HOOKS
// ==========================================

export function useSceneProgress(
  scrollProgress: number,
  sceneStart: number,
  sceneEnd: number
): { isActive: boolean; progress: number } {
  const isActive = scrollProgress >= sceneStart && scrollProgress < sceneEnd;
  const progress = isActive
    ? (scrollProgress - sceneStart) / (sceneEnd - sceneStart)
    : scrollProgress < sceneStart
    ? 0
    : 1;

  return { isActive, progress };
}
