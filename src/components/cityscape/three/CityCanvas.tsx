"use client";

import { Suspense, createContext, useContext, useState, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

// ==========================================
// CITY CANVAS - UNIFIED 3D RENDERING CONTEXT
// Single canvas for all scenes - eliminates
// WebGL context switching overhead
// ==========================================

type QualityLevel = 'low' | 'medium' | 'high';

interface QualityContextType {
  quality: QualityLevel;
  isMobile: boolean;
  particleMultiplier: number;
  dpr: number;
}

const QualityContext = createContext<QualityContextType>({
  quality: 'high',
  isMobile: false,
  particleMultiplier: 1,
  dpr: 1.5,
});

export function useQuality() {
  return useContext(QualityContext);
}

// Detect mobile once at module level
const detectMobile = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    window.innerWidth < 768;
};

interface CityCanvasProps {
  children: ReactNode;
  className?: string;
}

export function CityCanvas({ children, className = "" }: CityCanvasProps) {
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [isMobile] = useState(detectMobile);

  // Quality-based settings
  const qualitySettings: Record<QualityLevel, { particleMultiplier: number; dpr: number }> = {
    low: { particleMultiplier: 0.3, dpr: 1 },
    medium: { particleMultiplier: 0.6, dpr: 1.25 },
    high: { particleMultiplier: 1, dpr: 1.5 },
  };

  const settings = qualitySettings[isMobile ? 'medium' : quality];

  const contextValue: QualityContextType = {
    quality: isMobile ? 'medium' : quality,
    isMobile,
    ...settings,
  };

  return (
    <QualityContext.Provider value={contextValue}>
      <Canvas
        className={className}
        camera={{
          position: [0, 8, 5],
          fov: 70,
          near: 0.1,
          far: 500,
        }}
        gl={{
          antialias: quality !== 'low',
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, settings.dpr]}
        style={{ background: '#0a0a12' }}
        performance={{ min: 0.5 }}
      >
        {/* Performance monitoring - auto-adjusts quality */}
        <PerformanceMonitor
          onDecline={() => {
            setQuality(prev => prev === 'high' ? 'medium' : 'low');
          }}
          onIncline={() => {
            setQuality(prev => prev === 'low' ? 'medium' : 'high');
          }}
          flipflops={3}
          onFallback={() => setQuality('low')}
        />

        {/* Base lighting setup */}
        <ambientLight intensity={0.1} />

        {/* Main content with suspense */}
        <Suspense fallback={<LoadingCity />}>
          {children}
        </Suspense>
      </Canvas>
    </QualityContext.Provider>
  );
}

// ==========================================
// LOADING FALLBACK
// Simple loading state while scenes load
// ==========================================

function LoadingCity() {
  return (
    <group>
      {/* Dark background */}
      <color attach="background" args={['#0a0a12']} />

      {/* Simple loading indicator */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#00fff5" wireframe />
      </mesh>
    </group>
  );
}
