"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { sceneRanges } from "@/lib/voyage-data";
import { useSceneProgress } from "../VoyageController";
import { WormholeTunnel, WormholeParticles } from "../three/WormholeTunnel";

// ==========================================
// WORMHOLE SCENE - 3D TUNNEL
// Full R3F-powered wormhole experience
// Einstein-Rosen bridge visualization
// Dark & golden color palette
// ==========================================

// Dark & golden color palette - elegant and mysterious
const WORMHOLE_COLORS = {
  entry: "#9ca3af",     // Light gray - entering (for text visibility)
  inside: "#b8860b",    // Dark golden - inside transition
  exit: "#d4a574",      // Warm golden - exiting to projects
  accent: "#6b7280",    // Gray accent
  tunnelDark: "#1f2937", // Dark gray for 3D tunnel
  tunnelBlack: "#0a0a0a", // Near black for 3D depth
};

interface WormholeSceneProps {
  scrollProgress: number;
}

export function WormholeScene({ scrollProgress }: WormholeSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.wormhole.start,
    sceneRanges.wormhole.end
  );

  // Phase detection
  const isEntering = progress < 0.25;
  const isInside = progress >= 0.25 && progress < 0.75;
  const isExiting = progress >= 0.75;

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 3D Wormhole Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 35],
          fov: 60,
          near: 0.1,
          far: 300,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <WormholeSceneContent progress={progress} />
        </Suspense>
      </Canvas>

      {/* HTML Overlays */}
      <WormholeOverlay
        progress={progress}
        isEntering={isEntering}
        isInside={isInside}
        isExiting={isExiting}
      />

      {/* Exit flash */}
      {isExiting && progress > 0.9 && (
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(1, (progress - 0.9) * 10) }}
        />
      )}
    </div>
  );
}

// ==========================================
// 3D WORMHOLE CONTENT
// Rendered within R3F Canvas
// ==========================================

interface WormholeSceneContentProps {
  progress: number;
}

function WormholeSceneContent({ progress }: WormholeSceneContentProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Animate camera approaching and entering the wormhole sphere
  useFrame((state) => {
    // Camera approaches the wormhole sphere, enters it, then exits
    // Phase 1 (0-0.4): Approach from far away
    // Phase 2 (0.4-0.6): Pass through the center
    // Phase 3 (0.6-1): Exit to the other side
    let zPosition;
    if (progress < 0.4) {
      // Approach: 35 -> 12 (approaching the sphere surface at radius 8)
      zPosition = THREE.MathUtils.lerp(35, 12, progress / 0.4);
    } else if (progress < 0.6) {
      // Pass through: 12 -> -12 (through the sphere)
      const throughProgress = (progress - 0.4) / 0.2;
      zPosition = THREE.MathUtils.lerp(12, -12, throughProgress);
    } else {
      // Exit: -12 -> -35 (moving away on the other side)
      zPosition = THREE.MathUtils.lerp(-12, -35, (progress - 0.6) / 0.4);
    }
    camera.position.z = zPosition;

    // Subtle camera shake when passing through the center
    if (progress > 0.35 && progress < 0.65) {
      const intensity = 1 - Math.abs(progress - 0.5) * 5;
      const shake = intensity * 0.15 * Math.sin(state.clock.elapsedTime * 25);
      camera.position.x = shake;
      camera.position.y = shake * 0.7;
    } else {
      camera.position.x = 0;
      camera.position.y = 0;
    }

    // Look at center of wormhole
    camera.lookAt(0, 0, 0);

    // Rotate the wormhole effect
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  // Color transition based on progress - refined palette
  const colorA = progress < 0.5 ? WORMHOLE_COLORS.entry : WORMHOLE_COLORS.inside;
  const colorB = WORMHOLE_COLORS.inside;
  const colorC = progress > 0.7 ? WORMHOLE_COLORS.exit : WORMHOLE_COLORS.entry;

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.05} />

      {/* Background stars (visible at entry/exit) */}
      <Stars
        radius={150}
        depth={100}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={3}
      />

      {/* Main wormhole tunnel */}
      <WormholeTunnel
        progress={progress}
        intensity={0.8 + progress * 0.4}
        colorA={colorA}
        colorB={colorB}
        colorC={colorC}
      />

      {/* Streaming particles */}
      <WormholeParticles count={3000} progress={progress} />

      {/* Entry/exit portals - positioned beyond the sphere, refined colors */}
      <WormholePortal position={[0, 0, 45]} color={WORMHOLE_COLORS.entry} progress={1 - progress} />
      <WormholePortal position={[0, 0, -45]} color={WORMHOLE_COLORS.exit} progress={progress} />
    </group>
  );
}

// ==========================================
// WORMHOLE PORTAL
// Glowing ring at tunnel ends
// ==========================================

interface WormholePortalProps {
  position: [number, number, number];
  color: string;
  progress: number;
}

function WormholePortal({ position, color, progress }: WormholePortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const intensity = Math.max(0, Math.min(1, progress * 2));

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <ringGeometry args={[8, 16, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2 * intensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main ring */}
      <mesh ref={meshRef}>
        <torusGeometry args={[10, 0.3, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={intensity * 0.8} />
      </mesh>

      {/* Inner rings */}
      {[0.85, 0.7, 0.55].map((scale, i) => (
        <mesh key={i} scale={scale}>
          <torusGeometry args={[10, 0.15, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity * 0.4 * (1 - i * 0.25)}
          />
        </mesh>
      ))}

      {/* Center light */}
      <pointLight color={color} intensity={4 * intensity} distance={40} />
    </group>
  );
}

// ==========================================
// HTML OVERLAY
// Text and status displays
// ==========================================

interface WormholeOverlayProps {
  progress: number;
  isEntering: boolean;
  isInside: boolean;
  isExiting: boolean;
}

function WormholeOverlay({ progress, isEntering, isInside, isExiting }: WormholeOverlayProps) {
  return (
    <>
      {/* Mode transition text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="text-center" style={{ transform: "translateY(180px)" }}>
          {isEntering && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div
                className="text-xs font-mono tracking-[0.5em] mb-2"
                style={{ color: `${WORMHOLE_COLORS.entry}99` }}
              >
                INITIATING
              </div>
              <div
                className="text-2xl md:text-4xl font-display"
                style={{ color: WORMHOLE_COLORS.entry }}
              >
                DIMENSIONAL SHIFT
              </div>
            </motion.div>
          )}

          {isInside && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <motion.div
                className="text-3xl md:text-5xl font-display mb-4"
                style={{ color: WORMHOLE_COLORS.inside }}
                animate={{
                  textShadow: [
                    `0 0 20px ${WORMHOLE_COLORS.inside}80`,
                    `0 0 40px ${WORMHOLE_COLORS.inside}cc`,
                    `0 0 20px ${WORMHOLE_COLORS.inside}80`,
                  ],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                EMPLOYEE → CREATOR
              </motion.div>
              <motion.div
                className="text-sm font-mono text-white/60 tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                CROSSING DIMENSIONAL BARRIER
              </motion.div>
            </motion.div>
          )}

          {isExiting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div
                className="text-xs font-mono tracking-[0.5em] mb-2"
                style={{ color: `${WORMHOLE_COLORS.exit}99` }}
              >
                ENTERING
              </div>
              <div
                className="text-2xl md:text-4xl font-display"
                style={{ color: WORMHOLE_COLORS.exit }}
              >
                PROJECT DIMENSION
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chromatic aberration overlay */}
      {isInside && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen z-10"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 0.1, repeat: Infinity }}
          style={{
            background: `
              linear-gradient(90deg,
                rgba(255,0,0,0.15) 0%,
                transparent 20%,
                transparent 80%,
                rgba(0,0,255,0.15) 100%
              )
            `,
          }}
        />
      )}

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)",
        }}
      />

      {/* Status HUD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="border border-white/20 bg-black/80 backdrop-blur-sm px-6 py-3 font-mono text-sm">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: isEntering ? WORMHOLE_COLORS.entry : isInside ? WORMHOLE_COLORS.inside : WORMHOLE_COLORS.exit,
                boxShadow: [
                  "0 0 5px currentColor",
                  "0 0 15px currentColor",
                  "0 0 5px currentColor",
                ],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-white/60 tracking-widest text-xs">
              {isEntering ? "ENTERING WORMHOLE" : isInside ? "IN TRANSIT" : "EXITING WORMHOLE"}
            </span>
            <span style={{ color: isEntering ? WORMHOLE_COLORS.entry : isInside ? WORMHOLE_COLORS.inside : WORMHOLE_COLORS.exit }}>
              {Math.floor(progress * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at center, transparent 30%, rgba(0,0,0,0.6) 100%)`,
        }}
      />
    </>
  );
}
