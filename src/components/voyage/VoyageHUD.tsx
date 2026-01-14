"use client";

import Link from "next/link";
import { getCurrentScene, voyageData, sceneRanges } from "@/lib/voyage-data";
import type { VoyageCompany, VoyageProject } from "@/lib/voyage-data";

// ==========================================
// VOYAGE HUD
// Persistent overlay with journey information
// ==========================================

interface VoyageHUDProps {
  scrollProgress: number;
  currentScene: string;
  activeCompany: VoyageCompany | null;
  activeProject: VoyageProject | null;
}

export function VoyageHUD({
  scrollProgress,
  currentScene,
  activeCompany,
  activeProject,
}: VoyageHUDProps) {
  // Hide HUD during destination scene
  if (currentScene === "destination") return null;

  // Scene labels
  const sceneLabels: Record<string, string> = {
    earth: "ORIGIN",
    launch: "LAUNCH",
    career: "CAREER",
    wormhole: "TRANSIT",
    projects: "PROJECTS",
    destination: "COMPLETE",
  };

  // Current waypoint name
  const waypointName =
    activeCompany?.name ||
    activeProject?.name ||
    (currentScene === "earth" ? voyageData.origin.city : sceneLabels[currentScene]);

  return (
    <>
      {/* Top HUD bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          {/* Left - Mission info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span className="text-xs font-mono text-cyan/80 tracking-widest">
                {sceneLabels[currentScene]}
              </span>
            </div>
            {waypointName && (
              <span className="text-sm font-mono text-white/60 hidden sm:block">
                → {waypointName.toUpperCase()}
              </span>
            )}
          </div>

          {/* Center - Progress */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center hidden md:block">
            <div className="text-xs font-mono text-white/40 tracking-widest">VOYAGE PROGRESS</div>
            <div className="text-lg font-mono text-cyan">{scrollProgress.toFixed(0)}%</div>
          </div>

          {/* Right - Exit */}
          <Link
            href="/"
            className="text-xs font-mono text-orange/60 hover:text-orange transition-colors pointer-events-auto"
          >
            ← EXIT
          </Link>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Scene markers */}
          <div className="relative h-8 mb-2">
            {Object.entries(sceneRanges).map(([scene, range]) => {
              const isActive = currentScene === scene;
              const isPassed = scrollProgress >= range.end;

              return (
                <div
                  key={scene}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${range.start}%` }}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-cyan scale-150"
                        : isPassed
                        ? "bg-green/50"
                        : "bg-white/20"
                    }`}
                    style={isActive ? { boxShadow: "0 0 10px rgba(0,255,245,0.8)" } : {}}
                  />
                  <span
                    className={`text-[8px] font-mono mt-1 transition-colors ${
                      isActive ? "text-cyan" : "text-white/30"
                    }`}
                  >
                    {scene.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan via-magenta to-green transition-all duration-100"
              style={{ width: `${scrollProgress}%` }}
            />
            {/* Current position indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-100"
              style={{
                left: `${scrollProgress}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner frames - handled by SpaceshipPilot cockpit */}
    </>
  );
}
