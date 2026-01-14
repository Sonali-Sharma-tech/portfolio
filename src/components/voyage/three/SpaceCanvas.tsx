"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Preload } from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// SPACE CANVAS
// R3F-powered 3D space environment
// Uses GPU-accelerated shaders for performance
// ==========================================

interface SpaceCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export function SpaceCanvas({ children, className = "" }: SpaceCanvasProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <DeepSpaceStars />
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ==========================================
// DEEP SPACE STARS
// Multi-layered starfield with twinkling effect
// ==========================================

function DeepSpaceStars() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (starsRef.current) {
      // Slow rotation for subtle movement
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.02;
    }
  });

  return (
    <group ref={starsRef}>
      {/* Far background stars - small and dense */}
      <Stars
        radius={300}
        depth={100}
        count={8000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />
      {/* Medium layer - slightly larger */}
      <Stars
        radius={200}
        depth={80}
        count={3000}
        factor={4}
        saturation={0.1}
        fade
        speed={1}
      />
      {/* Foreground stars - largest, colorful */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={6}
        saturation={0.3}
        fade
        speed={2}
      />
    </group>
  );
}

export { DeepSpaceStars };
