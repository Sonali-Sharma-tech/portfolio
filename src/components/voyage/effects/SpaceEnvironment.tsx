"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ==========================================
// SPACE ENVIRONMENT
// Creates an immersive "you are in space" feeling
// - Mouse controls camera/view direction
// - Parallax depth on all elements
// - 3D star field with depth
// ==========================================

interface SpaceEnvironmentProps {
  scrollProgress: number;
  shipLateral?: number;  // -1 to 1, ship's lateral position
  shipRoll?: number;     // -1 to 1, ship's roll angle
  children: React.ReactNode;
}

interface Star {
  id: string;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  parallaxSpeed: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
}

// Generate stars once at module level - never regenerates
function generateStars(): Star[] {
  const starArray: Star[] = [];
  const layerConfigs = [
    { count: 200, depth: 0.1, size: [0.5, 1.5], opacity: 0.3, speed: 0.02 },
    { count: 150, depth: 0.3, size: [1, 2], opacity: 0.5, speed: 0.05 },
    { count: 100, depth: 0.5, size: [1.5, 3], opacity: 0.7, speed: 0.1 },
    { count: 50, depth: 0.8, size: [2, 4], opacity: 0.9, speed: 0.2 },
    { count: 20, depth: 1.0, size: [3, 5], opacity: 1, speed: 0.3 },
  ];
  // Realistic space star colors - mostly white with subtle warm/cool tints
  const colors = ["#ffffff", "#fff8f0", "#f0f8ff", "#ffe4c4", "#e0e0e0"];

  layerConfigs.forEach((config, layerIndex) => {
    for (let i = 0; i < config.count; i++) {
      const isColoredStar = Math.random() > 0.85;
      starArray.push({
        id: `${layerIndex}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: config.depth,
        size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
        opacity: config.opacity * (0.5 + Math.random() * 0.5),
        parallaxSpeed: config.speed,
        color: isColoredStar ? colors[Math.floor(Math.random() * colors.length)] : "#ffffff",
        twinkleSpeed: 2 + Math.random() * 4,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  });

  return starArray;
}

export function SpaceEnvironment({
  scrollProgress,
  shipLateral = 0,
  shipRoll = 0,
  children,
}: SpaceEnvironmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use ref for stars - generates once and never changes
  const starsRef = useRef<Star[] | null>(null);
  if (!starsRef.current) {
    starsRef.current = generateStars();
  }
  const stars = starsRef.current;

  // Mouse position - updated on mouse move, CSS handles smooth transitions
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse movement for parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 2, // -1 to 1
      y: (clientY / innerHeight - 0.5) * 2, // -1 to 1
    });
  }, []);

  // Add mouse listener
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Calculate camera rotation based on mouse AND ship movement
  // Ship lateral movement shifts the view opposite direction (space moves when you strafe)
  const cameraRotateX = mousePos.y * 5;
  const cameraRotateY = mousePos.x * 8 + shipLateral * 15; // Add ship strafe
  const cameraRoll = shipRoll * 8; // Ship banking rolls the view

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* Deep space background - pure black like real space */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at ${50 + mousePos.x * 10 - shipLateral * 20}% ${40 + mousePos.y * 10}%,
              rgba(20, 20, 25, 0.3) 0%,
              transparent 50%),
            radial-gradient(ellipse 100% 60% at ${30 - mousePos.x * 5 - shipLateral * 15}% ${70 + mousePos.y * 5}%,
              rgba(15, 15, 20, 0.2) 0%,
              transparent 40%),
            linear-gradient(180deg, #000000 0%, #050508 50%, #000000 100%)
          `,
          transform: `
            rotateX(${cameraRotateX * 0.1}deg)
            rotateY(${cameraRotateY * 0.1}deg)
            rotateZ(${cameraRoll * 0.2}deg)
            translateX(${mousePos.x * -5 + shipLateral * -30}px)
            translateY(${mousePos.y * -5}px)
          `,
          transition: "transform 0.15s ease-out, background 0.3s ease-out",
        }}
      />

      {/* 3D Star field with parallax - ship movement creates diving effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `
            rotateX(${cameraRotateX}deg)
            rotateY(${cameraRotateY}deg)
            rotateZ(${cameraRoll}deg)
            translateX(${shipLateral * -50}px)
          `,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
      >
        {stars.map((star) => {
          // Calculate parallax offset based on depth, mouse, AND ship movement
          // Stars shift MORE when deeper in the field (greater z) for enhanced depth perception
          const shipOffset = shipLateral * star.parallaxSpeed * 80 * star.z;
          const parallaxX = mousePos.x * star.parallaxSpeed * 100 + shipOffset;
          const parallaxY = mousePos.y * star.parallaxSpeed * 100;

          // Scroll-based vertical movement (diving through space)
          const scrollY = (scrollProgress * star.z * 50) % 100;

          // Calculate 3D position - ship lateral creates parallax shift
          const x = ((star.x + parallaxX) % 100 + 100) % 100;
          const y = ((star.y + scrollY + parallaxY) % 100 + 100) % 100;

          return (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: star.size > 2
                  ? `0 0 ${star.size * 3}px ${star.color}, 0 0 ${star.size}px white`
                  : `0 0 ${star.size * 2}px ${star.color}`,
                transform: `translateZ(${star.z * 200}px)`,
                animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                animationDelay: `${star.twinkleOffset}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated Spiral Galaxy - sparse stars with smooth rotation */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute galaxy-spin"
          style={{
            top: `${10 + mousePos.y * 5}%`,
            right: `${-5 + mousePos.x * -3}%`,
            width: "280px",
            height: "280px",
          }}
        >
          {/* Galaxy core - soft glowing center */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "30px",
              height: "30px",
              background: `radial-gradient(circle at center,
                rgba(255, 250, 220, 0.9) 0%,
                rgba(255, 220, 150, 0.5) 40%,
                transparent 100%)`,
              borderRadius: "50%",
              filter: "blur(2px)",
              boxShadow: "0 0 20px rgba(255, 220, 150, 0.4)",
            }}
          />

          {/* Sparse spiral arm stars - only 60 stars */}
          {Array.from({ length: 60 }, (_, i) => {
            const armIndex = i % 3;
            const posInArm = Math.floor(i / 3);
            const baseAngle = (armIndex / 3) * Math.PI * 2;
            const radius = 20 + posInArm * 6;
            const spiralOffset = (radius / 140) * Math.PI * 2.5;
            const angle = baseAngle + spiralOffset;
            const spread = (Math.sin(i * 0.7) * 5) * (radius / 140);
            const x = 50 + Math.cos(angle) * (radius / 2.8) + spread * 0.2;
            const y = 50 + Math.sin(angle) * (radius / 2.8) + spread * 0.15;
            const size = radius < 50 ? 2 : 1.5;
            const opacity = radius < 40 ? 0.8 : radius < 80 ? 0.5 : 0.3;
            const isGolden = i % 8 === 0;

            return (
              <div
                key={`galaxy-star-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  backgroundColor: isGolden ? "#ffd700" : "#ffffff",
                  opacity,
                  boxShadow: isGolden ? "0 0 3px #ffd700" : "none",
                }}
              />
            );
          })}

          {/* Subtle outer glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(255, 245, 230, 0.08) 0%,
                rgba(200, 195, 190, 0.04) 40%,
                transparent 70%)`,
              borderRadius: "50%",
              filter: "blur(8px)",
            }}
          />
        </div>
      </div>

      {/* Dust particles removed - cleaner space view */}

      {/* Speed lines when scrolling fast - warp effect */}
      {scrollProgress > 12 && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            opacity: Math.min(0.6, (scrollProgress - 12) / 50),
            transform: `
              rotateX(${cameraRotateX * 0.5}deg)
              rotateY(${cameraRotateY * 0.5}deg)
            `,
          }}
        >
          {Array.from({ length: 40 }, (_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            const distance = 45 + Math.sin(i) * 5;
            return (
              <div
                key={`warp-${i}`}
                className="absolute bg-gradient-to-b from-white/50 via-white/30 to-transparent"
                style={{
                  left: `${50 + Math.cos(angle) * distance}%`,
                  top: `${50 + Math.sin(angle) * distance}%`,
                  width: "2px",
                  height: `${20 + scrollProgress * 0.5}px`,
                  transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                  transformOrigin: "center top",
                  animation: `speed-line-pulse 0.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at ${50 + mousePos.x * 5}% ${50 + mousePos.y * 5}%,
              transparent 30%,
              rgba(0,0,0,0.4) 70%,
              rgba(0,0,0,0.8) 100%)
          `,
        }}
      />

      {/* Main content with parallax */}
      <div
        className="relative z-40 w-full h-full"
        style={{
          transform: `
            translateX(${mousePos.x * -15}px)
            translateY(${mousePos.y * -10}px)
            rotateX(${cameraRotateX * 0.3}deg)
            rotateY(${cameraRotateY * 0.3}deg)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>

      {/* Helmet/cockpit frame overlay for immersion */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />
        {/* Corner brackets - like a cockpit window */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: inherit; transform: translateZ(inherit) scale(1); }
          50% { opacity: 1; transform: translateZ(inherit) scale(1.3); }
        }
        @keyframes speed-line-pulse {
          0%, 100% { opacity: 0.3; height: inherit; }
          50% { opacity: 1; }
        }
        .galaxy-spin {
          animation: galaxy-rotate 90s linear infinite;
        }
        @keyframes galaxy-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
