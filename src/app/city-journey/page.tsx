"use client";

import dynamic from "next/dynamic";
import { CityController } from "@/components/cityscape/CityController";
import { CityHUD } from "@/components/cityscape/CityHUD";
import { CityCanvas } from "@/components/cityscape/three/CityCanvas";
import { CityEnvironment } from "@/components/cityscape/effects/CityEnvironment";

// Cityscape-specific CSS
import "./cityscape.css";

// ==========================================
// DYNAMIC IMPORTS - Code Splitting
// Heavy 3D scenes loaded only when needed
// NOTE: No loading component for 3D scenes - they render inside Canvas
// ==========================================

// 3D Scene components (inside Canvas) - NO loading component (would render HTML inside Canvas!)
const RooftopScene = dynamic(
  () => import("@/components/cityscape/scenes/RooftopScene").then((m) => m.RooftopScene),
  { ssr: false }
);

const DowntownScene = dynamic(
  () => import("@/components/cityscape/scenes/DowntownScene").then((m) => m.DowntownScene),
  { ssr: false }
);

const DataPortalScene = dynamic(
  () => import("@/components/cityscape/scenes/DataPortalScene").then((m) => m.DataPortalScene),
  { ssr: false }
);

const DistrictScene = dynamic(
  () => import("@/components/cityscape/scenes/DistrictScene").then((m) => m.DistrictScene),
  { ssr: false }
);

const SkylineScene = dynamic(
  () => import("@/components/cityscape/scenes/SkylineScene").then((m) => m.SkylineScene),
  { ssr: false }
);

// HTML Overlays (outside Canvas) - imported directly since they're just HTML
import { DowntownOverlay } from "@/components/cityscape/scenes/DowntownScene";
import { DistrictOverlay } from "@/components/cityscape/scenes/DistrictScene";
import { SkylineOverlay } from "@/components/cityscape/scenes/SkylineScene";

// ==========================================
// CYBERPUNK CITY JOURNEY PAGE
// An immersive flight through Night City
// Use arrow keys to pilot your drone
// ==========================================

export default function CityJourneyPage() {
  return (
    <CityController>
      {(state) => {
        const progress = state.scrollProgress;

        // Preload scenes 5% before they're needed
        const shouldMountRooftop = progress < 15;
        const shouldMountDowntown = progress >= 8 && progress < 65;
        const shouldMountPortal = progress >= 58 && progress < 78;
        const shouldMountDistricts = progress >= 70 && progress < 96;
        const shouldMountSkyline = progress >= 90;

        return (
          <>
            {/* Single unified 3D canvas */}
            <CityCanvas className="absolute inset-0">
              {/* Shared environment (rain, fog, background) */}
              <CityEnvironment scrollProgress={progress}>
                {/* Scene 1: Rooftop Origin (0-12%) */}
                {shouldMountRooftop && (
                  <RooftopScene
                    scrollProgress={progress}
                    onJourneyStart={state.startJourney}
                  />
                )}

                {/* Scene 2: Downtown Career (12-62%) */}
                {shouldMountDowntown && (
                  <DowntownScene scrollProgress={progress} />
                )}

                {/* Scene 3: Data Portal Transition (62-74%) */}
                {shouldMountPortal && (
                  <DataPortalScene scrollProgress={progress} />
                )}

                {/* Scene 4: Project Districts (74-94%) */}
                {shouldMountDistricts && (
                  <DistrictScene scrollProgress={progress} />
                )}

                {/* Scene 5: Skyline Destination (94-100%) */}
                {shouldMountSkyline && (
                  <SkylineScene scrollProgress={progress} />
                )}
              </CityEnvironment>
            </CityCanvas>

            {/* Persistent HUD overlay */}
            <CityHUD
              scrollProgress={progress}
              currentScene={state.currentScene}
              activeCompany={state.activeCompany}
              activeProject={state.activeProject}
            />

            {/* HTML Overlays - rendered OUTSIDE the Canvas */}
            {shouldMountDowntown && <DowntownOverlay scrollProgress={progress} />}
            {shouldMountDistricts && <DistrictOverlay scrollProgress={progress} />}
            {shouldMountSkyline && <SkylineOverlay scrollProgress={progress} />}
          </>
        );
      }}
    </CityController>
  );
}
