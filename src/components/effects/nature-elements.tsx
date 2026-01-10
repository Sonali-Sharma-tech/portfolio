"use client";

import { useMemo } from "react";

// Warm, natural firefly colors - like real bioluminescence
const FIREFLY_COLORS = [
  { glow: "#fef08a", core: "#fde047" },  // Warm yellow (most common)
  { glow: "#bef264", core: "#a3e635" },  // Lime green
  { glow: "#fcd34d", core: "#fbbf24" },  // Amber/gold
  { glow: "#86efac", core: "#4ade80" },  // Soft green
  { glow: "#fca5a1", core: "#f87171" },  // Warm coral (rare)
];

interface Firefly {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  color: typeof FIREFLY_COLORS[number];
  driftX: number;
  driftY: number;
  pulseSpeed: number;
}

interface Vine {
  id: number;
  x: number;
  height: number;
  delay: number;
}

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

// Seeded random for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function Fireflies({ count = 20 }: { count?: number }) {
  const fireflies = useMemo<Firefly[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 1000;
      return {
        id: i,
        x: seededRandom(seed + 1) * 100,
        y: 20 + seededRandom(seed + 2) * 60, // Keep them in middle area, like real fireflies
        delay: seededRandom(seed + 3) * 8,
        duration: 4 + seededRandom(seed + 4) * 4, // Varied flash duration
        size: 3 + seededRandom(seed + 5) * 4, // Natural size variation
        color: FIREFLY_COLORS[Math.floor(seededRandom(seed + 6) * FIREFLY_COLORS.length)],
        driftX: -30 + seededRandom(seed + 7) * 60, // Horizontal drift range
        driftY: -40 + seededRandom(seed + 8) * 80, // Vertical drift range
        pulseSpeed: 1.5 + seededRandom(seed + 9) * 2, // Individual pulse speed
      };
    });
  }, [count]);

  return (
    <div className="fireflies">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="firefly-natural"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            "--firefly-glow": f.color.glow,
            "--firefly-core": f.color.core,
            "--drift-x": `${f.driftX}px`,
            "--drift-y": `${f.driftY}px`,
            "--pulse-speed": `${f.pulseSpeed}s`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          } as React.CSSProperties}
        >
          {/* Inner bright core */}
          <div className="firefly-core" />
          {/* Outer soft glow */}
          <div className="firefly-glow" />
        </div>
      ))}
    </div>
  );
}

export function HangingVines({ count = 8 }: { count?: number }) {
  const vines = useMemo<Vine[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 500;
      return {
        id: i,
        x: (i / count) * 100 + seededRandom(seed + 1) * 10,
        height: 60 + seededRandom(seed + 2) * 90,
        delay: seededRandom(seed + 3) * 2,
      };
    });
  }, [count]);

  return (
    <div className="vines">
      {vines.map((v) => (
        <div
          key={v.id}
          className="vine"
          style={{
            left: `${v.x}%`,
            height: `${v.height}px`,
            animationDelay: `${v.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingPetals({ count = 12 }: { count?: number }) {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 300;
      return {
        id: i,
        x: seededRandom(seed + 1) * 100,
        delay: seededRandom(seed + 2) * 15,
        duration: 12 + seededRandom(seed + 3) * 8,
        size: 6 + seededRandom(seed + 4) * 6,
      };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="flower-petal"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function TreeSilhouettes() {
  return (
    <>
      <div
        className="tree-silhouette hidden lg:block"
        style={{ left: "2%", bottom: "10%" }}
      />
      <div
        className="tree-silhouette hidden lg:block"
        style={{ right: "3%", bottom: "15%", transform: "scale(0.8)" }}
      />
    </>
  );
}

export function WaterfallCascade({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div
      className="waterfall-cascade hidden lg:block"
      style={{
        [side]: side === "left" ? "3%" : "3%",
      }}
    />
  );
}
