"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// STAR COMPONENT
// A glowing 3D star with customizable color
// Pulses when active, shows glow halo
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
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);

  const resolvedColor = COLOR_MAP[color] || color;
  const threeColor = useMemo(() => new THREE.Color(resolvedColor), [resolvedColor]);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current && isIlluminated) {
      // Twinkle effect
      const twinkle = 0.8 + Math.sin(time * 3 + position[0] * 10) * 0.2;
      coreRef.current.scale.setScalar(twinkle);
    }

    if (isActive) {
      // Pulse when active
      const pulse = 1 + Math.sin(time * pulseSpeed) * 0.15;
      if (groupRef.current) {
        groupRef.current.scale.setScalar(size * pulse);
      }

      // Rotate glow
      if (glowRef.current) {
        glowRef.current.rotation.z = time * 0.3;
      }

      // Outer glow pulses slower
      if (outerGlowRef.current) {
        const outerPulse = 1 + Math.sin(time * 1.5) * 0.1;
        outerGlowRef.current.scale.setScalar(outerPulse);
      }
    }
  });

  // Determine star brightness based on state
  const coreOpacity = isIlluminated ? 1 : 0.3;
  const glowOpacity = isActive ? 0.6 : isIlluminated ? 0.3 : 0.1;
  const coreSize = isActive ? 0.15 : 0.1;

  return (
    <group ref={groupRef} position={position} scale={size}>
      {/* Core - bright center of the star */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[coreSize, 16, 16]} />
        <meshBasicMaterial
          color={isIlluminated ? threeColor : "#888888"}
          transparent
          opacity={coreOpacity}
        />
      </mesh>

      {/* Inner glow */}
      {isIlluminated && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial
            color={threeColor}
            transparent
            opacity={glowOpacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Outer glow - only for active stars */}
      {isActive && (
        <>
          <mesh ref={outerGlowRef}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial
              color={threeColor}
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Point light for active stars */}
          <pointLight color={threeColor} intensity={2} distance={5} />

          {/* Lens flare effect - diamond shape */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial
              color={threeColor}
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial
              color={threeColor}
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
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
