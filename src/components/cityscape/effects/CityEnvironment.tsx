"use client";

import { useRef, useMemo, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// CITY ENVIRONMENT
// Cyberpunk city backdrop with rain and fog
// Much lighter than space particles
// ==========================================

interface CityEnvironmentProps {
  scrollProgress: number;
  children?: ReactNode;
}

export function CityEnvironment({ scrollProgress, children }: CityEnvironmentProps) {
  return (
    <group>
      {/* Dark sky with subtle gradient */}
      <SkyGradient />

      {/* Distant city silhouette */}
      <CitySilhouette scrollProgress={scrollProgress} />

      {/* Rain particles */}
      <CyberpunkRain scrollProgress={scrollProgress} />

      {/* Fog layer */}
      <FogLayer scrollProgress={scrollProgress} />

      {/* Scene content */}
      {children}
    </group>
  );
}

// ==========================================
// SKY GRADIENT
// Dark cyberpunk sky with subtle color
// ==========================================

function SkyGradient() {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />

      {/* Large background sphere for gradient effect */}
      <mesh position={[0, 0, -200]}>
        <planeGeometry args={[1000, 500]} />
        <meshBasicMaterial
          color="#0a0a12"
          transparent
          opacity={1}
        />
      </mesh>

      {/* Subtle purple/magenta glow at horizon */}
      <mesh position={[0, -50, -150]}>
        <planeGeometry args={[800, 100]} />
        <meshBasicMaterial
          color="#2d1b4e"
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}

// ==========================================
// CITY SILHOUETTE
// Distant buildings as simple geometry
// ==========================================

function CitySilhouette({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate building silhouettes once
  const buildings = useMemo(() => {
    const buildingData: Array<{
      x: number;
      height: number;
      width: number;
      depth: number;
    }> = [];

    // Create a row of buildings
    for (let i = -15; i <= 15; i++) {
      const height = 20 + Math.random() * 60;
      buildingData.push({
        x: i * 12 + (Math.random() - 0.5) * 5,
        height,
        width: 5 + Math.random() * 8,
        depth: 5 + Math.random() * 8,
      });
    }

    return buildingData;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle parallax based on progress
      groupRef.current.position.z = -150 - scrollProgress * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -30, -150]}>
      {buildings.map((building, i) => (
        <mesh
          key={i}
          position={[building.x, building.height / 2, Math.random() * 20]}
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshBasicMaterial
            color="#0f0f18"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Some lit windows - just scattered points */}
      <WindowLights buildings={buildings} />
    </group>
  );
}

// ==========================================
// WINDOW LIGHTS
// Scattered lit windows on distant buildings
// ==========================================

function WindowLights({ buildings }: { buildings: Array<{ x: number; height: number; width: number; depth: number }> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    // Scatter some window lights
    buildings.forEach((building) => {
      const windowCount = Math.floor(building.height / 5);

      for (let w = 0; w < windowCount; w++) {
        if (Math.random() > 0.6) continue; // Only some windows lit

        const x = building.x + (Math.random() - 0.5) * building.width * 0.8;
        const y = w * 4 + Math.random() * 3;
        const z = Math.random() * 10;

        positions.push(x, y, z);

        // Warm yellow/orange window colors
        const warmth = Math.random();
        if (warmth > 0.7) {
          colors.push(1, 0.8, 0.4); // Orange
        } else {
          colors.push(1, 0.95, 0.8); // Warm white
        }
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geom;
  }, [buildings]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ==========================================
// CYBERPUNK RAIN
// Optimized rain particles - only 500
// ==========================================

function CyberpunkRain({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities] = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = Math.random() * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i] = 0.5 + Math.random() * 1;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return [geom, velocities];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;

    for (let i = 0; i < array.length / 3; i++) {
      const i3 = i * 3;

      // Move rain down
      array[i3 + 1] -= velocities[i];

      // Reset when below ground
      if (array[i3 + 1] < -10) {
        array[i3 + 1] = 100;
        array[i3] = (Math.random() - 0.5) * 200;
        array[i3 + 2] = (Math.random() - 0.5) * 100;
      }
    }

    positions.needsUpdate = true;
  });

  // Only show rain in certain scenes
  const rainOpacity = scrollProgress > 10 && scrollProgress < 90 ? 0.4 : 0.2;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        color="#4488ff"
        transparent
        opacity={rainOpacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ==========================================
// FOG LAYER
// Volumetric fog effect using planes
// ==========================================

function FogLayer({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle movement
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 5;
    }
  });

  // Fog intensity varies by scene
  const fogOpacity = scrollProgress > 62 && scrollProgress < 74 ? 0.4 : 0.15;

  return (
    <group ref={groupRef} position={[0, -20, 0]}>
      {/* Multiple fog planes at different depths */}
      {[0, 20, 40].map((z, i) => (
        <mesh key={i} position={[0, 0, -z]} rotation={[-Math.PI / 8, 0, 0]}>
          <planeGeometry args={[300, 50]} />
          <meshBasicMaterial
            color="#1a1030"
            transparent
            opacity={fogOpacity * (1 - i * 0.3)}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
