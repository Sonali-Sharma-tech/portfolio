"use client";

import { useMemo } from "react";

// ==========================================
// HYPERSPACE STARS
// Scroll-linked parallax starfield that creates
// the sensation of moving through space
// ==========================================

interface HyperspaceStarsProps {
  scrollProgress: number;
  intensity?: number; // 0-1, controls how fast stars move
}

export function HyperspaceStars({
  scrollProgress,
  intensity = 1,
}: HyperspaceStarsProps) {
  // Generate star layers with different depths
  const starLayers = useMemo(() => {
    const layers = [];

    // Layer 1: Distant stars (slow parallax)
    layers.push({
      id: "distant",
      count: 150,
      speedMultiplier: 0.3,
      minSize: 1,
      maxSize: 2,
      opacity: 0.4,
      color: "white",
    });

    // Layer 2: Medium stars
    layers.push({
      id: "medium",
      count: 100,
      speedMultiplier: 0.6,
      minSize: 1,
      maxSize: 3,
      opacity: 0.6,
      color: "white",
    });

    // Layer 3: Close stars (fast parallax) - cyan tint
    layers.push({
      id: "close",
      count: 60,
      speedMultiplier: 1.0,
      minSize: 2,
      maxSize: 4,
      opacity: 0.8,
      color: "#00fff5",
    });

    // Layer 4: Streak stars (very fast) - appear during high scroll
    layers.push({
      id: "streak",
      count: 30,
      speedMultiplier: 2.0,
      minSize: 1,
      maxSize: 2,
      opacity: 0.9,
      color: "#ff00ff",
      isStreak: true,
    });

    return layers;
  }, []);

  // Generate stars for each layer
  const allStars = useMemo(() => {
    return starLayers.flatMap((layer) =>
      Array.from({ length: layer.count }, (_, i) => ({
        id: `${layer.id}-${i}`,
        layerId: layer.id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size:
          layer.minSize + Math.random() * (layer.maxSize - layer.minSize),
        opacity: layer.opacity * (0.5 + Math.random() * 0.5),
        speedMultiplier: layer.speedMultiplier,
        color: layer.color,
        isStreak: layer.isStreak || false,
        // Random twinkle offset
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 1 + Math.random() * 2,
      }))
    );
  }, [starLayers]);

  // Calculate scroll-based movement
  // Stars move DOWN as we "fly up" through space
  const baseOffset = scrollProgress * 50 * intensity;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Space gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0,100,150,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(100,0,150,0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 60%, rgba(0,150,100,0.06) 0%, transparent 40%),
            linear-gradient(to bottom, #000011 0%, #050520 100%)
          `,
        }}
      />

      {/* Star layers */}
      {allStars.map((star) => {
        // Calculate Y position based on scroll and layer speed
        const yOffset = (baseOffset * star.speedMultiplier) % 100;
        const adjustedY = (star.y + yOffset) % 100;

        // Streak effect for fast-moving stars when scrolling fast
        const isStreaking = star.isStreak && scrollProgress > 10;
        const streakLength = isStreaking
          ? Math.min(30, scrollProgress * 0.3)
          : 0;

        return (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${adjustedY}%`,
              width: star.size,
              height: isStreaking ? star.size + streakLength : star.size,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              borderRadius: isStreaking ? "50% 50% 50% 50%" : "50%",
              transform: isStreaking ? "scaleY(1)" : "none",
              transition: "height 0.1s ease-out",
            }}
          />
        );
      })}

      {/* Nebula clouds that drift with scroll */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translateY(${baseOffset * 0.1}%)`,
          background: `
            radial-gradient(ellipse 80% 40% at 20% ${30 + (scrollProgress * 0.2) % 40}%, rgba(0,255,245,0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% ${60 - (scrollProgress * 0.15) % 30}%, rgba(255,0,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% ${50 + (scrollProgress * 0.1) % 20}%, rgba(100,100,255,0.06) 0%, transparent 40%)
          `,
        }}
      />

      {/* Speed lines that intensify with scroll */}
      {scrollProgress > 15 && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: Math.min(1, (scrollProgress - 15) / 30) }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`speed-${i}`}
              className="absolute bg-gradient-to-b from-transparent via-cyan/40 to-transparent"
              style={{
                left: `${5 + (i * 4.5)}%`,
                top: `-${20 + (i * 7) % 40}%`,
                width: "1px",
                height: `${50 + (scrollProgress * 0.5)}px`,
                animation: `speed-line-fall ${0.4 + (i * 0.03)}s linear infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
