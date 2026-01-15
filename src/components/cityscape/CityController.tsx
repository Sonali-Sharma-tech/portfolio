"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { motion, MotionValue, useMotionValue } from "framer-motion";
import { getCurrentScene, getActiveCompany, getActiveProject, sceneRanges } from "@/lib/city-data";
import type { CityCompany, CityProject } from "@/lib/city-data";
import { DroneControls } from "./DroneControls";

// ==========================================
// CITY CONTROLLER
// Central state management for the journey
// Uses keyboard/touch controls to navigate
// ==========================================

export interface CityState {
  scrollProgress: number;
  currentScene: string;
  activeCompany: CityCompany | null;
  activeProject: CityProject | null;
  isInPortal: boolean;
  scrollYProgress: MotionValue<number>;
  startJourney: () => void;
  hasStarted: boolean;
  droneLateral: number;
  droneRoll: number;
}

interface CityControllerProps {
  children: (state: CityState) => ReactNode;
}

export function CityController({ children }: CityControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [droneLateral, setDroneLateral] = useState(0);
  const [droneRoll, setDroneRoll] = useState(0);

  // Motion value for compatibility with animations
  const scrollYProgress = useMotionValue(progress / 100);

  // Handle progress changes from drone controls
  const handleProgressChange = useCallback((delta: number) => {
    setProgress((prev) => {
      const newProgress = Math.min(100, Math.max(0, prev + delta));
      scrollYProgress.set(newProgress / 100);
      return newProgress;
    });
  }, [scrollYProgress]);

  // Handle lateral movement
  const handleLateralChange = useCallback((lateral: number, roll: number) => {
    setDroneLateral(lateral);
    setDroneRoll(roll);
  }, []);

  // Start the journey with a smooth launch
  const startJourney = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      // Smooth launch animation
      const launchDuration = 1500;
      const startTime = performance.now();
      const targetProgress = 14;

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

  // Compute current state
  const currentScene = getCurrentScene(progress);
  const activeCompany = getActiveCompany(progress);
  const activeProject = getActiveProject(progress);
  const isInPortal = progress >= sceneRanges.portal.start && progress < sceneRanges.portal.end;

  const state: CityState = {
    scrollProgress: progress,
    currentScene,
    activeCompany,
    activeProject,
    isInPortal,
    scrollYProgress,
    startJourney,
    hasStarted,
    droneLateral,
    droneRoll,
  };

  return (
    <div
      ref={containerRef}
      className="city-container fixed inset-0 overflow-hidden bg-[#0a0a12]"
      tabIndex={0}
    >
      {/* Main viewport - shifts with drone movement */}
      <motion.div
        className="city-viewport absolute inset-0"
        style={{
          x: droneLateral * -60,
          rotateZ: droneRoll * 2,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {children(state)}
      </motion.div>

      {/* Drone/vehicle controls */}
      <DroneControls
        onProgressChange={handleProgressChange}
        onLateralChange={handleLateralChange}
        currentProgress={progress}
        hasLaunched={hasStarted}
        onLaunch={startJourney}
      />
    </div>
  );
}

// ==========================================
// SCENE WRAPPER WITH FRAMER MOTION
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
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        visibility: isActive ? "visible" : "hidden",
        pointerEvents: isActive ? "auto" : "none",
      }}
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
