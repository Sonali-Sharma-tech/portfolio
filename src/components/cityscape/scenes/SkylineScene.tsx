"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import { cityData, sceneRanges } from "@/lib/city-data";
import { useSceneProgress } from "../CityController";

// ==========================================
// SKYLINE SCENE - DESTINATION
// Panoramic city view with holographic elements
// Epic journey completion celebration
// ==========================================

interface SkylineSceneProps {
  scrollProgress: number;
}

export function SkylineScene({ scrollProgress }: SkylineSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.skyline.start,
    sceneRanges.skyline.end
  );

  if (!isActive) return null;

  return <SkylineEnvironment progress={progress} />;
}

// Separate export for HTML overlay - used outside Canvas
export function SkylineOverlay({ scrollProgress }: { scrollProgress: number }) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.skyline.start,
    sceneRanges.skyline.end
  );

  if (!isActive) return null;

  return <CompletionOverlay progress={progress} />;
}

// ==========================================
// SKYLINE ENVIRONMENT - Enhanced 3D Scene
// ==========================================

function SkylineEnvironment({ progress }: { progress: number }) {
  const { camera } = useThree();
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Cinematic camera movement
    const targetY = 60 + progress * 20;
    const targetZ = 80 - progress * 30;

    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.015);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.015);
    camera.position.x = Math.sin(time * 0.08) * 15;

    camera.lookAt(0, 30, -60);

    // Slow majestic rotation
    if (sceneRef.current) {
      sceneRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* Deep space gradient background */}
      <color attach="background" args={["#030308"]} />

      {/* Ambient and dramatic lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[100, 100, 50]} intensity={0.3} color="#e0e0ff" />

      {/* Enhanced city panorama */}
      <CityPanorama progress={progress} />

      {/* Holographic rings */}
      <HolographicRings progress={progress} />

      {/* Celebration particles */}
      <CelebrationParticles />

      {/* Floating data streams */}
      <DataStreams />

      {/* Dramatic neon lighting */}
      <pointLight position={[-80, 50, -50]} color="#ff00ff" intensity={3} distance={150} />
      <pointLight position={[80, 50, -50]} color="#00fff5" intensity={3} distance={150} />
      <pointLight position={[0, 100, 0]} color="#ff6600" intensity={2} distance={120} />
      <pointLight position={[0, 30, 50]} color="#00ff88" intensity={1.5} distance={80} />
    </group>
  );
}

// ==========================================
// ENHANCED CITY PANORAMA
// ==========================================

function CityPanorama({ progress }: { progress: number }) {
  const buildings = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      const height = 30 + Math.random() * 100;
      const isTall = height > 80;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius - 40,
        height,
        width: isTall ? 8 + Math.random() * 6 : 5 + Math.random() * 10,
        color: ["#1a1a2e", "#0f0f18", "#151525", "#12121f"][Math.floor(Math.random() * 4)],
        isTall,
        neonColor: ["#00fff5", "#ff00ff", "#ff6600", "#00ff88"][Math.floor(Math.random() * 4)],
      };
    });
  }, []);

  return (
    <group>
      {/* Reflective ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#050510" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Grid lines on ground */}
      <GridFloor />

      {/* Buildings with neon accents */}
      {buildings.map((b, i) => (
        <group key={i}>
          <mesh position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[b.width, b.height, b.width]} />
            <meshStandardMaterial color={b.color} roughness={0.7} metalness={0.3} />
          </mesh>

          {/* Neon top accent for tall buildings */}
          {b.isTall && (
            <mesh position={[b.x, b.height + 0.5, b.z]}>
              <boxGeometry args={[b.width + 0.5, 1, b.width + 0.5]} />
              <meshBasicMaterial color={b.neonColor} transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}

      {/* Window lights */}
      <PanoramaLights buildings={buildings} />

      {/* Central tower beacon */}
      <CentralBeacon />
    </group>
  );
}

// ==========================================
// GRID FLOOR - Cyberpunk ground effect
// ==========================================

function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Pulse effect
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      gridRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={gridRef} position={[0, 0.1, -40]}>
      {/* Radial lines */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 100, 0, Math.sin(angle) * 100]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.5, 200]} />
            <meshBasicMaterial color="#00fff5" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Concentric circles */}
      {[50, 100, 150].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.5, radius, 64]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// CENTRAL BEACON - Holographic tower
// ==========================================

function CentralBeacon() {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={beaconRef} position={[0, 0, -40]}>
      {/* Central spire */}
      <mesh position={[0, 75, 0]}>
        <coneGeometry args={[8, 150, 6]} />
        <meshBasicMaterial color="#0a0a12" />
      </mesh>

      {/* Neon rings around spire */}
      {[30, 60, 90, 120].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[10 - i * 1.5, 0.3, 6, 32]} />
          <meshBasicMaterial
            color={["#00fff5", "#ff00ff", "#ff6600", "#00ff88"][i]}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Top beacon light */}
      <pointLight position={[0, 150, 0]} color="#ffffff" intensity={5} distance={200} />
      <mesh position={[0, 150, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ==========================================
// HOLOGRAPHIC RINGS
// ==========================================

function HolographicRings({ progress }: { progress: number }) {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const ringOpacity = Math.min(progress * 2, 0.6);

  return (
    <group ref={ringsRef} position={[0, 60, -40]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, i * 0.3]}>
          <torusGeometry args={[40 + i * 15, 0.5, 6, 64]} />
          <meshBasicMaterial
            color={["#00fff5", "#ff00ff", "#00ff88"][i]}
            transparent
            opacity={ringOpacity * (1 - i * 0.2)}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// DATA STREAMS - Vertical light beams
// ==========================================

function DataStreams() {
  const streamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (streamsRef.current) {
      streamsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const offset = i * 0.5;
          child.position.y = 50 + Math.sin(state.clock.elapsedTime * 2 + offset) * 20;
          (child.material as THREE.MeshBasicMaterial).opacity =
            0.3 + Math.sin(state.clock.elapsedTime * 3 + offset) * 0.2;
        }
      });
    }
  });

  const positions = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 200,
      z: (Math.random() - 0.5) * 200 - 40,
      color: ["#00fff5", "#ff00ff", "#ff6600", "#00ff88"][Math.floor(Math.random() * 4)],
    }));
  }, []);

  return (
    <group ref={streamsRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos.x, 50, pos.z]}>
          <cylinderGeometry args={[0.5, 0.5, 100, 8]} />
          <meshBasicMaterial color={pos.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// PANORAMA LIGHTS
// ==========================================

function PanoramaLights({
  buildings,
}: {
  buildings: Array<{ x: number; z: number; height: number; width: number; neonColor: string }>;
}) {
  const positions: number[] = [];
  const colors: number[] = [];

  buildings.forEach((b) => {
    const windowCount = Math.floor(b.height / 8);
    for (let w = 0; w < windowCount; w++) {
      if (Math.random() > 0.6) continue;
      positions.push(
        b.x + (Math.random() - 0.5) * b.width * 0.8,
        w * 6 + 5,
        b.z + (Math.random() - 0.5) * b.width * 0.8
      );

      const colorChoice = Math.random();
      if (colorChoice > 0.8) {
        const neon = new THREE.Color(b.neonColor);
        colors.push(neon.r, neon.g, neon.b);
      } else if (colorChoice > 0.5) {
        colors.push(1, 0.9, 0.4);
      } else {
        colors.push(1, 0.95, 0.85);
      }
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={2.5} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

// ==========================================
// CELEBRATION PARTICLES
// ==========================================

function CelebrationParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities] = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    const colorOptions = [
      new THREE.Color("#00fff5"),
      new THREE.Color("#ff00ff"),
      new THREE.Color("#ff6600"),
      new THREE.Color("#00ff88"),
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 150;
      positions[i3 + 1] = Math.random() * 120;
      positions[i3 + 2] = (Math.random() - 0.5) * 150 - 40;
      velocities[i] = 0.1 + Math.random() * 0.3;

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return [geom, velocities];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;

      const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = positions.array as Float32Array;

      for (let i = 0; i < array.length / 3; i++) {
        const i3 = i * 3;
        array[i3 + 1] += velocities[i];
        if (array[i3 + 1] > 120) {
          array[i3 + 1] = 0;
          array[i3] = (Math.random() - 0.5) * 150;
          array[i3 + 2] = (Math.random() - 0.5) * 150 - 40;
        }
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={1.5} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ==========================================
// COMPLETION OVERLAY - Professional Card Layout
// ==========================================

function CompletionOverlay({ progress }: { progress: number }) {
  const show = progress > 0.15;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: show ? 1 : 0.9, y: show ? 0 : 30 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative max-w-2xl w-full"
      >
        {/* Glassmorphism card */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(10,10,18,0.9) 0%, rgba(20,20,35,0.85) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,255,245,0.2)",
            boxShadow: "0 0 60px rgba(0,255,245,0.1), 0 0 120px rgba(255,0,255,0.05)",
          }}
        >
          {/* Top gradient accent */}
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, #00fff5, #ff00ff, #ff6600, #00ff88)",
            }}
          />

          <div className="p-8 md:p-10">
            {/* Header section */}
            <div className="text-center mb-8">
              {/* Success badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: show ? 1 : 0, rotate: show ? 0 : -180 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,245,0.2), rgba(255,0,255,0.2))",
                  border: "2px solid rgba(0,255,245,0.5)",
                }}
              >
                <span className="text-2xl">🚀</span>
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    border: "2px solid rgba(0,255,245,0.3)",
                    animationDuration: "2s",
                  }}
                />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: show ? 0 : 20, opacity: show ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold mb-2 tracking-wide"
                style={{
                  background: "linear-gradient(90deg, #00fff5, #ff00ff, #00ff88)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MISSION COMPLETE
              </motion.h1>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: show ? 0 : 15, opacity: show ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/50 font-mono text-sm tracking-wider"
              >
                You&apos;ve explored my journey through Night City
              </motion.p>
            </div>

            {/* Stats grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: show ? 0 : 20, opacity: show ? 1 : 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <StatCard label="YEARS EXP" value={cityData.stats.years} color="#00fff5" delay={0.6} show={show} />
              <StatCard
                label="COMPANIES"
                value={cityData.stats.companies.toString()}
                color="#ff00ff"
                delay={0.7}
                show={show}
              />
              <StatCard
                label="PROJECTS"
                value={cityData.stats.projects.toString()}
                color="#00ff88"
                delay={0.8}
                show={show}
              />
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

            {/* Skills highlight */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: show ? 0 : 20, opacity: show ? 1 : 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <div className="text-[10px] font-mono text-white/40 tracking-widest mb-3 text-center">
                CORE TECHNOLOGIES
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["React", "TypeScript", "Svelte", "Next.js", "Three.js", "Node.js"].map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: show ? 1 : 0 }}
                    transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                    className="px-3 py-1.5 text-xs font-mono rounded-full"
                    style={{
                      background: "rgba(0,255,245,0.1)",
                      border: "1px solid rgba(0,255,245,0.3)",
                      color: "#00fff5",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: show ? 0 : 20, opacity: show ? 1 : 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
            >
              <a
                href="https://linkedin.com/in/sonali-sharma-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 rounded-lg font-mono text-sm tracking-wider text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, rgba(0,255,245,0.2), rgba(255,0,255,0.2))",
                  border: "1px solid rgba(0,255,245,0.5)",
                  color: "#00fff5",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <LinkedInIcon />
                  CONNECT ON LINKEDIN
                </span>
              </a>

              <button
                onClick={() => window.location.href = "mailto:sonalisharma.tech123@gmail.com"}
                className="px-6 py-3 rounded-lg font-mono text-sm tracking-wider text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <EmailIcon />
                  SEND MESSAGE
                </span>
              </button>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: show ? 0 : 20, opacity: show ? 1 : 0 }}
              transition={{ delay: 1 }}
              className="flex gap-4 justify-center"
            >
              <Link
                href="/"
                className="px-5 py-2 text-xs font-mono tracking-wider text-white/50 hover:text-cyan-400 transition-colors"
              >
                ← HOME BASE
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 text-xs font-mono tracking-wider text-white/50 hover:text-magenta-400 transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                ↻ REPLAY JOURNEY
              </button>
              <a
                href="https://github.com/sonali-sharma-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-xs font-mono tracking-wider text-white/50 hover:text-green-400 transition-colors"
              >
                GITHUB →
              </a>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <CornerAccents />
        </div>

        {/* Floating particles around card */}
        <FloatingParticles />
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// STAT CARD COMPONENT
// ==========================================

function StatCard({
  label,
  value,
  color,
  delay,
  show,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
  show: boolean;
}) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!show) return;

    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    const suffix = value.replace(/[0-9]/g, "");
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericValue * eased);

      setDisplayValue(current + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, (delay - 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [show, value, delay]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: show ? 1 : 0.8, opacity: show ? 1 : 0 }}
      transition={{ delay }}
      className="text-center p-4 rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color }}>
        {displayValue}
      </div>
      <div className="text-[9px] font-mono text-white/40 tracking-widest">{label}</div>
    </motion.div>
  );
}

// ==========================================
// ICONS
// ==========================================

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// ==========================================
// CORNER ACCENTS
// ==========================================

function CornerAccents() {
  return (
    <>
      {/* Top-left */}
      <div className="absolute top-4 left-4 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-cyan-500/60 to-transparent" />
      </div>
      {/* Top-right */}
      <div className="absolute top-4 right-4 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-500/60 to-transparent" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-cyan-500/60 to-transparent" />
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-4 left-4 w-8 h-8 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{ background: "linear-gradient(to right, rgba(255,0,255,0.6), transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-0.5 h-full"
          style={{ background: "linear-gradient(to top, rgba(255,0,255,0.6), transparent)" }}
        />
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-4 right-4 w-8 h-8 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-full h-0.5"
          style={{ background: "linear-gradient(to left, rgba(255,0,255,0.6), transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-0.5 h-full"
          style={{ background: "linear-gradient(to top, rgba(255,0,255,0.6), transparent)" }}
        />
      </div>
    </>
  );
}

// ==========================================
// FLOATING PARTICLES
// ==========================================

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: ["#00fff5", "#ff00ff", "#ff6600", "#00ff88"][i % 4],
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
