"use client";

import dynamic from "next/dynamic";
import { VoyageController } from "@/components/voyage/VoyageController";
import { VoyageHUD } from "@/components/voyage/VoyageHUD";
import { EarthScene } from "@/components/voyage/scenes/EarthScene";
import { SpaceEnvironment } from "@/components/voyage/effects/SpaceEnvironment";
import { VoyageErrorBoundary, Static2DFallback } from "@/components/voyage/VoyageErrorBoundary";

// Voyage-specific CSS - only loaded on this route
import "./voyage.css";

// ==========================================
// DYNAMIC IMPORTS - Code Splitting
// Heavy 3D scenes loaded only when needed
// Reduces initial bundle size significantly
// ==========================================

// Loading component for heavy scenes
function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin mb-2 mx-auto" />
        <p className="text-cyan/60 font-mono text-xs">Loading scene...</p>
      </div>
    </div>
  );
}

// LaunchScene - DISABLED (removed the blue planet launch animation)

const SpaceStationScene = dynamic(
  () => import("@/components/voyage/scenes/SpaceStation").then((m) => m.SpaceStationScene),
  { ssr: false, loading: SceneLoader }
);

const WormholeScene = dynamic(
  () => import("@/components/voyage/scenes/WormholeScene").then((m) => m.WormholeScene),
  { ssr: false, loading: SceneLoader }
);

const ProjectPlanetScene = dynamic(
  () => import("@/components/voyage/scenes/ProjectPlanet").then((m) => m.ProjectPlanetScene),
  { ssr: false, loading: SceneLoader }
);

const DestinationScene = dynamic(
  () => import("@/components/voyage/scenes/DestinationScene").then((m) => m.DestinationScene),
  { ssr: false, loading: SceneLoader }
);

// ==========================================
// SPACE VOYAGE JOURNEY PAGE
// An immersive keyboard-controlled space flight!
// Use arrow keys to pilot through your career journey
// ==========================================

export default function JourneyPage() {
  return (
    <VoyageController>
      {(state) => {
        const progress = state.scrollProgress;

        // Only mount scenes when they're about to be visible (preload 5% early)
        // This prevents loading all 3D scenes upfront
        // Launch scene is DISABLED - skipping directly from Earth to Career
        const shouldMountCareer = progress >= 7;       // Preload before 12% (career starts at 12%)
        const shouldMountWormhole = progress >= 57;    // Preload before 62%
        const shouldMountProjects = progress >= 69;    // Preload before 74%
        const shouldMountDestination = progress >= 89; // Preload before 94%

        return (
          <SpaceEnvironment
            scrollProgress={progress}
            shipLateral={state.shipLateralPosition}
            shipRoll={state.shipRoll}
          >
            <div className="relative w-full h-full">
              {/* All scenes layered - only mount when approaching */}

              {/* Scene 1: Earth - Origin Story (0-12%) - always mounted */}
              <EarthScene
                scrollProgress={progress}
                onVoyageStart={state.startVoyage}
              />

              {/* Scene 2: Launch - DISABLED, skipping directly to career */}

              {/* Scene 3: Career Journey - Space Stations (22-62%) */}
              {shouldMountCareer && (
                <VoyageErrorBoundary fallback={<Static2DFallback />}>
                  <SpaceStationScene scrollProgress={progress} />
                </VoyageErrorBoundary>
              )}

              {/* Scene 4: Wormhole Transition (62-74%) */}
              {shouldMountWormhole && (
                <VoyageErrorBoundary fallback={<Static2DFallback />}>
                  <WormholeScene scrollProgress={progress} />
                </VoyageErrorBoundary>
              )}

              {/* Scene 5: Project Planets (74-94%) */}
              {shouldMountProjects && (
                <ProjectPlanetScene scrollProgress={progress} />
              )}

              {/* Scene 6: Destination - Complete (94-100%) */}
              {shouldMountDestination && (
                <DestinationScene scrollProgress={progress} />
              )}

              {/* Persistent HUD overlay */}
              <VoyageHUD
                scrollProgress={progress}
                currentScene={state.currentScene}
                activeCompany={state.activeCompany}
                activeProject={state.activeProject}
              />
            </div>
          </SpaceEnvironment>
        );
      }}
    </VoyageController>
  );
}
