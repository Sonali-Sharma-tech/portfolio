"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// PROCEDURAL BUILDING
// Generate cyberpunk buildings with no textures
// Uses instanced meshes for windows = fast!
// ==========================================

interface ProceduralBuildingProps {
  position: [number, number, number];
  height: number;
  width?: number;
  depth?: number;
  neonColor: string;
  name?: string;
  isActive?: boolean;
  buildingType?: 'industrial' | 'startup' | 'warehouse' | 'headquarters';
}

export function ProceduralBuilding({
  position,
  height,
  width = 15,
  depth = 15,
  neonColor,
  isActive = false,
  buildingType = 'headquarters',
}: ProceduralBuildingProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Subtle pulse when active
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  // Building style based on type
  const style = useMemo(() => {
    switch (buildingType) {
      case 'industrial':
        return { hasAntenna: true, windowDensity: 0.4, hasSmoke: true };
      case 'startup':
        return { hasAntenna: false, windowDensity: 0.7, hasSmoke: false };
      case 'warehouse':
        return { hasAntenna: false, windowDensity: 0.3, hasSmoke: false };
      case 'headquarters':
      default:
        return { hasAntenna: true, windowDensity: 0.8, hasSmoke: false };
    }
  }, [buildingType]);

  return (
    <group ref={groupRef} position={position}>
      {/* Main building structure */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Building top */}
      <mesh position={[0, height + 0.5, 0]}>
        <boxGeometry args={[width - 1, 1, depth - 1]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>

      {/* Windows - using instanced rendering concept */}
      <BuildingWindows
        height={height}
        width={width}
        depth={depth}
        neonColor={neonColor}
        density={style.windowDensity}
        isActive={isActive}
      />

      {/* Neon trim lines */}
      <NeonTrim
        height={height}
        width={width}
        depth={depth}
        color={neonColor}
        isActive={isActive}
      />

      {/* Antenna for some buildings */}
      {style.hasAntenna && (
        <Antenna position={[0, height + 1, 0]} color={neonColor} />
      )}

      {/* Building sign */}
      <mesh position={[0, height * 0.7, depth / 2 + 0.1]}>
        <planeGeometry args={[width * 0.6, 3]} />
        <meshBasicMaterial color={neonColor} transparent opacity={isActive ? 0.8 : 0.3} />
      </mesh>

      {/* Active glow */}
      {isActive && (
        <pointLight
          position={[0, height / 2, depth]}
          color={neonColor}
          intensity={5}
          distance={50}
        />
      )}
    </group>
  );
}

// ==========================================
// BUILDING WINDOWS
// Uses points for efficient rendering
// ==========================================

interface BuildingWindowsProps {
  height: number;
  width: number;
  depth: number;
  neonColor: string;
  density: number;
  isActive: boolean;
}

function BuildingWindows({ height, width, depth, neonColor, density, isActive }: BuildingWindowsProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const rows = Math.floor(height / 3);
    const colsFront = Math.floor(width / 2);
    const colsSide = Math.floor(depth / 2);

    const neonColorObj = new THREE.Color(neonColor);
    const warmWhite = new THREE.Color('#fff8e0');
    const coolWhite = new THREE.Color('#e0f0ff');

    // Front face windows
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < colsFront; col++) {
        if (Math.random() > density) continue;

        const x = (col - colsFront / 2) * 2 + 1;
        const y = row * 3 + 2;
        const z = depth / 2 + 0.2;

        positions.push(x, y, z);

        // Color: mix of warm, cool, and neon
        const colorRoll = Math.random();
        let windowColor: THREE.Color;
        if (isActive && colorRoll > 0.7) {
          windowColor = neonColorObj;
        } else if (colorRoll > 0.5) {
          windowColor = warmWhite;
        } else {
          windowColor = coolWhite;
        }

        colors.push(windowColor.r, windowColor.g, windowColor.b);
      }
    }

    // Back face windows
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < colsFront; col++) {
        if (Math.random() > density) continue;

        const x = (col - colsFront / 2) * 2 + 1;
        const y = row * 3 + 2;
        const z = -depth / 2 - 0.2;

        positions.push(x, y, z);

        const colorRoll = Math.random();
        const windowColor = colorRoll > 0.5 ? warmWhite : coolWhite;
        colors.push(windowColor.r, windowColor.g, windowColor.b);
      }
    }

    // Side windows
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < colsSide; col++) {
        if (Math.random() > density * 0.7) continue;

        // Right side
        positions.push(width / 2 + 0.2, row * 3 + 2, (col - colsSide / 2) * 2 + 1);
        const rightColor = Math.random() > 0.5 ? warmWhite : coolWhite;
        colors.push(rightColor.r, rightColor.g, rightColor.b);

        // Left side
        if (Math.random() > 0.3) {
          positions.push(-width / 2 - 0.2, row * 3 + 2, (col - colsSide / 2) * 2 + 1);
          const leftColor = Math.random() > 0.5 ? warmWhite : coolWhite;
          colors.push(leftColor.r, leftColor.g, leftColor.b);
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geom;
  }, [height, width, depth, neonColor, density, isActive]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

// ==========================================
// NEON TRIM
// Glowing edge lines
// ==========================================

interface NeonTrimProps {
  height: number;
  width: number;
  depth: number;
  color: string;
  isActive: boolean;
}

function NeonTrim({ height, width, depth, color, isActive }: NeonTrimProps) {
  const opacity = isActive ? 0.9 : 0.4;

  return (
    <group>
      {/* Vertical corner lines */}
      {[
        [width / 2, 0, depth / 2],
        [-width / 2, 0, depth / 2],
        [width / 2, 0, -depth / 2],
        [-width / 2, 0, -depth / 2],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], height / 2, pos[2]]}>
          <boxGeometry args={[0.2, height, 0.2]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Horizontal top lines */}
      <mesh position={[0, height, depth / 2]}>
        <boxGeometry args={[width, 0.2, 0.2]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, height, -depth / 2]}>
        <boxGeometry args={[width, 0.2, 0.2]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>

      {/* Accent lines at mid-height */}
      <mesh position={[0, height * 0.5, depth / 2 + 0.1]}>
        <boxGeometry args={[width, 0.1, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
      </mesh>
    </group>
  );
}

// ==========================================
// ANTENNA
// Rooftop antenna with blinking light
// ==========================================

function Antenna({ position, color }: { position: [number, number, number]; color: string }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Blinking pattern
      const blink = Math.sin(state.clock.elapsedTime * 4) > 0.5;
      lightRef.current.intensity = blink ? 2 : 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Antenna pole */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.5} />
      </mesh>

      {/* Blinking light */}
      <mesh position={[0, 8.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 8.5, 0]}
        color={color}
        intensity={2}
        distance={20}
      />
    </group>
  );
}
