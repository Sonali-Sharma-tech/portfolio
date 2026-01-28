"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// STAR COMPONENT
// Natural-looking stars with soft radial glow
// Mimics how stars appear to the naked eye
// ==========================================

interface StarProps {
  position: [number, number, number];
  color: string;
  size?: number;
  isActive?: boolean;
  isIlluminated?: boolean;
  pulseSpeed?: number;
}

// Color mapping for company/project colors
const COLOR_MAP: Record<string, string> = {
  orange: "#ff8844",
  green: "#44ff88",
  magenta: "#ff44aa",
  cyan: "#44ffff",
  gold: "#ffd700",
  white: "#ffffff",
};

// Glow layers create a natural radial falloff (like real stars)
const GLOW_LAYERS = [
  { scale: 1.0, opacity: 1.0 },    // Core - solid
  { scale: 1.8, opacity: 0.5 },    // Inner glow
  { scale: 2.8, opacity: 0.25 },   // Mid glow
  { scale: 4.0, opacity: 0.1 },    // Outer glow
  { scale: 6.0, opacity: 0.04 },   // Faint halo
];

export function Star({
  position,
  color,
  size = 1,
  isActive = false,
  isIlluminated = false,
  pulseSpeed = 2,
}: StarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRefs = useRef<THREE.Mesh[]>([]);

  const resolvedColor = COLOR_MAP[color] || color;
  const threeColor = useMemo(() => new THREE.Color(resolvedColor), [resolvedColor]);

  // Unique twinkle offset based on position
  const twinkleOffset = useMemo(() =>
    position[0] * 3.7 + position[1] * 2.3 + position[2] * 1.9,
    [position]
  );

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Natural twinkle - varies in brightness like real stars
    if (isIlluminated && coreRef.current) {
      // Multiple sine waves for organic feel
      const twinkle = 0.85 +
        Math.sin(time * 3.2 + twinkleOffset) * 0.08 +
        Math.sin(time * 5.7 + twinkleOffset * 1.3) * 0.05 +
        Math.sin(time * 1.1 + twinkleOffset * 0.7) * 0.02;

      coreRef.current.scale.setScalar(twinkle);

      // Glow layers twinkle slightly out of phase
      glowRefs.current.forEach((mesh, i) => {
        if (mesh) {
          const layerTwinkle = 0.9 + Math.sin(time * 2.5 + twinkleOffset + i * 0.5) * 0.1;
          mesh.scale.setScalar(GLOW_LAYERS[i].scale * layerTwinkle);
        }
      });
    }

    // Active star pulse
    if (isActive && groupRef.current) {
      const pulse = 1 + Math.sin(time * pulseSpeed) * 0.12;
      groupRef.current.scale.setScalar(size * pulse);
    }
  });

  // Base sizes based on state
  const baseSize = isActive ? 0.12 : isIlluminated ? 0.08 : 0.05;
  const glowIntensity = isActive ? 1.2 : isIlluminated ? 0.8 : 0.3;
  const starColor = isIlluminated ? threeColor : new THREE.Color("#555555");

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Solid bright core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshBasicMaterial
          color={isIlluminated ? "#ffffff" : "#888888"}
          transparent
          opacity={isIlluminated ? 1 : 0.5}
        />
      </mesh>

      {/* Colored glow layers - create natural radial falloff */}
      {GLOW_LAYERS.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) glowRefs.current[i] = el; }}
          scale={layer.scale}
        >
          <sphereGeometry args={[baseSize, 12, 12]} />
          <meshBasicMaterial
            color={starColor}
            transparent
            opacity={layer.opacity * glowIntensity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Active star extras */}
      {isActive && (
        <>
          {/* Extra outer corona */}
          <mesh scale={8}>
            <sphereGeometry args={[baseSize, 12, 12]} />
            <meshBasicMaterial
              color={threeColor}
              transparent
              opacity={0.06}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Point light to illuminate nearby elements */}
          <pointLight color={threeColor} intensity={1.5} distance={4} />
        </>
      )}
    </group>
  );
}

// Smaller background star for field
export function BackgroundStar({
  position,
  size = 0.02,
}: {
  position: [number, number, number];
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && ref.current.material) {
      // Gentle twinkle
      const twinkle = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0] * 100) * 0.5;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = twinkle * 0.8;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
