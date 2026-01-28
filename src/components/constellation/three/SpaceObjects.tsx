"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// SPACE OBJECTS
// Diverse celestial bodies for journey waypoints
// Each object represents a different career milestone
// ==========================================

interface SpaceObjectProps {
  position: [number, number, number];
  color: string;
  size?: number;
  isActive?: boolean;
  isIlluminated?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  orange: "#ff8844",
  green: "#44ff88",
  magenta: "#ff44aa",
  cyan: "#44ffff",
  gold: "#ffd700",
  white: "#ffffff",
};

// ==========================================
// HOME PLANET - Origin point
// A small Earth-like world, the starting point
// ==========================================
export function HomePlanet({
  position,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate planet slowly
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.1;
    }

    // Clouds rotate slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.15;
    }

    // Atmosphere glow pulse
    if (atmosphereRef.current && isIlluminated) {
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      atmosphereRef.current.scale.setScalar(pulse);
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.08;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const baseSize = 0.4;
  const opacity = isIlluminated ? 1 : 0.4;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Planet core - blue/green like Earth */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial
          color={isIlluminated ? "#4488aa" : "#334455"}
          roughness={0.8}
          metalness={0.1}
          emissive={isIlluminated ? "#224466" : "#000000"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[baseSize * 1.02, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[baseSize * 1.15, 24, 24]} />
        <meshBasicMaterial
          color="#66aaff"
          transparent
          opacity={opacity * 0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow when active */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[baseSize * 1.5, 16, 16]} />
          <meshBasicMaterial
            color="#66aaff"
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Light source */}
      {isIlluminated && (
        <pointLight color="#66aaff" intensity={0.5} distance={3} />
      )}
    </group>
  );
}

// ==========================================
// SMALL MOON - First career step (EY)
// A rocky, cratered moon - humble beginnings
// ==========================================
export function SmallMoon({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const resolvedColor = COLOR_MAP[color] || color;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Slow rotation
    if (moonRef.current) {
      moonRef.current.rotation.y = time * 0.05;
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 2.5) * 0.1;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const baseSize = 0.25;
  const opacity = isIlluminated ? 1 : 0.3;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Moon surface */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[baseSize, 24, 24]} />
        <meshStandardMaterial
          color={isIlluminated ? "#aaaaaa" : "#555555"}
          roughness={0.9}
          metalness={0.0}
          emissive={isIlluminated ? resolvedColor : "#000000"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Soft glow */}
      {isIlluminated && (
        <mesh>
          <sphereGeometry args={[baseSize * 1.3, 16, 16]} />
          <meshBasicMaterial
            color={resolvedColor}
            transparent
            opacity={0.15}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Active ring */}
      {isActive && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[baseSize * 1.5, baseSize * 1.7, 32]} />
            <meshBasicMaterial
              color={resolvedColor}
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color={resolvedColor} intensity={1} distance={3} />
        </>
      )}
    </group>
  );
}

// ==========================================
// SPACE STATION - 6figr (satellite type)
// A rotating orbital station
// ==========================================
export function SpaceStation({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const resolvedColor = COLOR_MAP[color] || color;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.3;
    }

    // Gentle core spin
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.1;
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.08;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const opacity = isIlluminated ? 1 : 0.3;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Central hub */}
      <mesh ref={coreRef}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial
          color={isIlluminated ? "#cccccc" : "#555555"}
          emissive={isIlluminated ? resolvedColor : "#000000"}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Rotating ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 8, 32]} />
          <meshStandardMaterial
            color={isIlluminated ? "#888888" : "#444444"}
            emissive={isIlluminated ? resolvedColor : "#000000"}
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Station lights */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.35, 0, Math.sin(angle) * 0.35]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color={isIlluminated ? resolvedColor : "#333333"}
              transparent
              opacity={opacity}
            />
          </mesh>
        ))}
      </group>

      {/* Solar panels */}
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <meshStandardMaterial
          color={isIlluminated ? "#2244aa" : "#222244"}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <meshStandardMaterial
          color={isIlluminated ? "#2244aa" : "#222244"}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glow when active */}
      {isActive && (
        <>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial
              color={resolvedColor}
              transparent
              opacity={0.08}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color={resolvedColor} intensity={1.5} distance={4} />
        </>
      )}
    </group>
  );
}

// ==========================================
// OCEAN PLANET - Captain Fresh
// A water world with visible oceans
// ==========================================
export function OceanPlanet({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);

  const resolvedColor = COLOR_MAP[color] || color;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.08;
    }

    // Ring shimmer
    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.02;
      const material = ringsRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.08;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const baseSize = 0.35;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Water planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial
          color={isIlluminated ? "#3366aa" : "#223344"}
          roughness={0.3}
          metalness={0.6}
          emissive={isIlluminated ? resolvedColor : "#000000"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ice caps */}
      <mesh position={[0, baseSize * 0.85, 0]}>
        <sphereGeometry args={[baseSize * 0.3, 16, 16]} />
        <meshBasicMaterial
          color="#aaccff"
          transparent
          opacity={isIlluminated ? 0.6 : 0.2}
        />
      </mesh>
      <mesh position={[0, -baseSize * 0.85, 0]}>
        <sphereGeometry args={[baseSize * 0.25, 16, 16]} />
        <meshBasicMaterial
          color="#aaccff"
          transparent
          opacity={isIlluminated ? 0.5 : 0.2}
        />
      </mesh>

      {/* Planetary rings */}
      <mesh ref={ringsRef} rotation={[Math.PI / 3, 0.2, 0]}>
        <ringGeometry args={[baseSize * 1.4, baseSize * 1.8, 64]} />
        <meshBasicMaterial
          color={isIlluminated ? "#88aacc" : "#334455"}
          transparent
          opacity={0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.1, 24, 24]} />
        <meshBasicMaterial
          color={resolvedColor}
          transparent
          opacity={isIlluminated ? 0.15 : 0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {isActive && (
        <pointLight color={resolvedColor} intensity={1.5} distance={4} />
      )}
    </group>
  );
}

// ==========================================
// BLAZING SUN - Glance (current position)
// A bright star with corona and flares
// ==========================================
export function BlazingSun({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRefs = useRef<THREE.Mesh[]>([]);

  const resolvedColor = COLOR_MAP[color] || color;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Core pulsation
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 4) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }

    // Corona rotation
    if (coronaRef.current) {
      coronaRef.current.rotation.z = time * 0.1;
      const material = coronaRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
    }

    // Flare animation
    flareRefs.current.forEach((flare, i) => {
      if (flare) {
        const scale = 1 + Math.sin(time * 5 + i * 2) * 0.3;
        flare.scale.setScalar(scale);
      }
    });

    // Active mega-pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const baseSize = 0.5;
  const glowIntensity = isIlluminated ? 1 : 0.3;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Core - blindingly bright */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[baseSize * 0.4, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={glowIntensity}
        />
      </mesh>

      {/* Inner glow layers */}
      {[0.5, 0.7, 1.0, 1.4, 2.0].map((scale, i) => (
        <mesh key={i} scale={scale}>
          <sphereGeometry args={[baseSize * 0.4, 16, 16]} />
          <meshBasicMaterial
            color={i < 2 ? "#ffffff" : resolvedColor}
            transparent
            opacity={(0.4 - i * 0.07) * glowIntensity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Corona - outer atmosphere */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[baseSize * 1.2, 16, 16]} />
        <meshBasicMaterial
          color={resolvedColor}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Solar flares */}
      {isIlluminated && [0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) flareRefs.current[i] = el; }}
          position={[
            Math.cos(angle) * baseSize * 0.6,
            Math.sin(angle) * baseSize * 0.6,
            0,
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial
            color={resolvedColor}
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Light source */}
      {isIlluminated && (
        <pointLight color={resolvedColor} intensity={3} distance={8} />
      )}

      {/* Active outer corona */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[baseSize * 2.5, 16, 16]} />
          <meshBasicMaterial
            color={resolvedColor}
            transparent
            opacity={0.05}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// ==========================================
// NEBULA CLOUD - For projects
// Colorful gas clouds with particles
// ==========================================
export function NebulaCloud({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const resolvedColor = COLOR_MAP[color] || color;
  const threeColor = useMemo(() => new THREE.Color(resolvedColor), [resolvedColor]);

  // Generate particle positions
  const particleData = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.2 + Math.random() * 0.4;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Vary colors slightly
      const colorVariation = 0.8 + Math.random() * 0.4;
      colors[i3] = threeColor.r * colorVariation;
      colors[i3 + 1] = threeColor.g * colorVariation;
      colors[i3 + 2] = threeColor.b * colorVariation;
    }

    return { positions, colors };
  }, [threeColor]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate cloud layers
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.05;
      cloudsRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
    }

    // Particle swirl
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.z = time * 0.05;
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.1;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const opacity = isIlluminated ? 1 : 0.3;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Gas cloud layers */}
      <group ref={cloudsRef}>
        {[0.5, 0.4, 0.3, 0.25].map((cloudSize, i) => (
          <mesh key={i} rotation={[i * 0.5, i * 0.3, 0]}>
            <sphereGeometry args={[cloudSize, 16, 16]} />
            <meshBasicMaterial
              color={resolvedColor}
              transparent
              opacity={(0.15 - i * 0.03) * opacity}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6 * opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core glow */}
      {isIlluminated && (
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {isActive && (
        <pointLight color={resolvedColor} intensity={1.5} distance={5} />
      )}
    </group>
  );
}

// ==========================================
// DARK NEBULA - Black Note project
// A mysterious dark cloud with subtle highlights
// ==========================================
export function DarkNebula({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const voidRef = useRef<THREE.Mesh>(null);

  const resolvedColor = COLOR_MAP[color] || color;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Slow mysterious rotation
    if (voidRef.current) {
      voidRef.current.rotation.y = time * 0.02;
      voidRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.08;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  const opacity = isIlluminated ? 1 : 0.4;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Dark void center */}
      <mesh ref={voidRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Event horizon glow */}
      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshBasicMaterial
          color={resolvedColor}
          transparent
          opacity={0.15 * opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer edge highlight */}
      <mesh>
        <ringGeometry args={[0.3, 0.5, 64]} />
        <meshBasicMaterial
          color={resolvedColor}
          transparent
          opacity={0.1 * opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Faint outer glow */}
      {isIlluminated && (
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial
            color={resolvedColor}
            transparent
            opacity={0.05}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {isActive && (
        <pointLight color={resolvedColor} intensity={0.8} distance={4} />
      )}
    </group>
  );
}

// ==========================================
// PRISMATIC NEBULA - Colorful Extension project
// A rainbow-colored nebula with shifting hues
// ==========================================
export function PrismaticNebula({
  position,
  size = 1,
  isActive = false,
  isIlluminated = false,
}: SpaceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layersRef = useRef<THREE.Mesh[]>([]);

  const rainbowColors = ["#ff4444", "#ff8844", "#ffff44", "#44ff44", "#44ffff", "#4444ff", "#ff44ff"];

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Animate each color layer
    layersRef.current.forEach((layer, i) => {
      if (layer) {
        layer.rotation.y = time * 0.1 + i * 0.5;
        layer.rotation.z = Math.sin(time * 0.2 + i) * 0.2;

        const material = layer.material as THREE.MeshBasicMaterial;
        material.opacity = (0.12 + Math.sin(time * 2 + i * 0.5) * 0.05) * (isIlluminated ? 1 : 0.3);
      }
    });

    // Active pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.1;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Rainbow color layers */}
      {rainbowColors.map((color, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) layersRef.current[i] = el; }}
          scale={0.5 - i * 0.03}
        >
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* White core */}
      {isIlluminated && (
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {isActive && (
        <pointLight color="#ffffff" intensity={1.5} distance={5} />
      )}
    </group>
  );
}
