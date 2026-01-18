"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Star } from "./three/Star";
import { AllConstellationLines } from "./three/ConstellationLine";
import {
  constellationLayout,
  voyageData,
  constellationSceneRanges,
} from "@/lib/voyage-data";
import type { StarPosition } from "@/lib/voyage-data";

// ==========================================
// CONSTELLATION CANVAS
// Main 3D rendering context for the star chart
// ==========================================

interface ConstellationCanvasProps {
  progress: number;
  currentScene: string;
  activeStar: StarPosition | null;
  illuminatedStars: string[];
  lateralOffset: number;
  cameraRoll: number;
  isMoving: boolean;
  isBoosting: boolean;
}

// Scale factor for star positions
const POSITION_SCALE = 30;

// Seeded random number generator for deterministic "random" values
// This avoids the React purity issue with Math.random()
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Pre-generate distant star field geometry (outside of React render cycle)
function createDistantStarGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const starColors = [
    { r: 1, g: 1, b: 1 },           // white
    { r: 0.67, g: 0.8, b: 1 },      // light blue
    { r: 0.53, g: 0.67, b: 1 },     // blue
    { r: 1, g: 0.87, b: 0.67 },     // warm
    { r: 1, g: 0.8, b: 0.8 },       // pink
  ];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const seed = i * 1.618033988749; // Golden ratio for better distribution

    const theta = seededRandom(seed) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(seed + 1) - 1);
    const radius = 50 + seededRandom(seed + 2) * 150;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const color = starColors[Math.floor(seededRandom(seed + 3) * starColors.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = seededRandom(seed + 4) * 0.15 + 0.05;
  }

  return { positions, colors, sizes };
}

// Pre-generate cosmic dust geometry (outside of React render cycle)
function createCosmicDustGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const seed = i * 2.718281828; // Euler's number for distribution

    positions[i3] = (seededRandom(seed) - 0.5) * 100;
    positions[i3 + 1] = (seededRandom(seed + 1) - 0.5) * 80;
    positions[i3 + 2] = (seededRandom(seed + 2) - 0.5) * 60;
    sizes[i] = seededRandom(seed + 3) * 0.1 + 0.02;
  }

  return { positions, sizes };
}

// Pre-computed geometries (generated once at module load, not during render)
const DISTANT_STAR_DATA = createDistantStarGeometry(1500);
const COSMIC_DUST_DATA = createCosmicDustGeometry(600);

// Get color for a star based on its data
function getStarColor(starId: string): string {
  if (starId === "origin") return "gold";
  const company = voyageData.companies.find(c => c.id === starId);
  if (company) return company.color;
  const project = voyageData.projects.find(p => p.id === starId);
  if (project) return project.color;
  return "white";
}

// Camera controller that follows progress
function CameraController({
  progress,
  lateralOffset,
  isMoving,
  isBoosting,
}: {
  progress: number;
  lateralOffset: number;
  isMoving: boolean;
  isBoosting: boolean;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 60));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  // Store boost offset separately to avoid mutating camera directly
  const boostOffset = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const { intro, origin, career, warp, projects, reveal } = constellationSceneRanges;

    // Calculate camera position based on scene
    const newPos = new THREE.Vector3(0, 0, 60);
    const newLookAt = new THREE.Vector3(0, 0, 0);

    if (progress < intro.end) {
      // Intro: High above, looking down at full star field
      newPos.set(lateralOffset * 5, 25 + progress * 0.5, 55);
      newLookAt.set(0, -5, 0);
    } else if (progress < origin.end) {
      // Origin: Zoom toward origin star
      const t = (progress - origin.start) / (origin.end - origin.start);
      const originStar = constellationLayout.find(s => s.id === "origin");
      if (originStar) {
        newPos.set(
          originStar.x * POSITION_SCALE + lateralOffset * 8,
          originStar.y * POSITION_SCALE + 8 - t * 3,
          35 - t * 10
        );
        newLookAt.set(
          originStar.x * POSITION_SCALE,
          originStar.y * POSITION_SCALE,
          originStar.z * POSITION_SCALE
        );
      }
    } else if (progress < career.end) {
      // Career: Follow along the career path
      const t = (progress - career.start) / (career.end - career.start);

      // Interpolate camera through career stars
      const careerPath = [
        constellationLayout.find(s => s.id === "origin")!,
        constellationLayout.find(s => s.id === "ey")!,
        constellationLayout.find(s => s.id === "6figr")!,
        constellationLayout.find(s => s.id === "captain-fresh")!,
        constellationLayout.find(s => s.id === "glance")!,
      ];

      const pathProgress = t * (careerPath.length - 1);
      const pathIndex = Math.floor(pathProgress);
      const pathT = pathProgress - pathIndex;

      const currentStar = careerPath[Math.min(pathIndex, careerPath.length - 1)];
      const nextStar = careerPath[Math.min(pathIndex + 1, careerPath.length - 1)];

      const x = THREE.MathUtils.lerp(currentStar.x, nextStar.x, pathT) * POSITION_SCALE;
      const y = THREE.MathUtils.lerp(currentStar.y, nextStar.y, pathT) * POSITION_SCALE;
      const z = THREE.MathUtils.lerp(currentStar.z, nextStar.z, pathT) * POSITION_SCALE;

      newPos.set(x + lateralOffset * 8, y + 5, z + 25);
      newLookAt.set(x, y, z);
    } else if (progress < warp.end) {
      // Warp: Transition effect - camera speeds forward
      const t = (progress - warp.start) / (warp.end - warp.start);
      const glanceStar = constellationLayout.find(s => s.id === "glance")!;

      newPos.set(
        glanceStar.x * POSITION_SCALE + lateralOffset * 5,
        glanceStar.y * POSITION_SCALE + 10 + t * 15,
        glanceStar.z * POSITION_SCALE + 30 - t * 20
      );
      newLookAt.set(0, glanceStar.y * POSITION_SCALE + 20, 0);
    } else if (progress < projects.end) {
      // Projects: Navigate through project nebulae
      const t = (progress - projects.start) / (projects.end - projects.start);

      const projectPath = [
        constellationLayout.find(s => s.id === "devtoolkit")!,
        constellationLayout.find(s => s.id === "colorful-extension")!,
        constellationLayout.find(s => s.id === "black-note")!,
      ];

      const pathProgress = t * (projectPath.length - 1);
      const pathIndex = Math.floor(pathProgress);
      const pathT = pathProgress - pathIndex;

      const currentStar = projectPath[Math.min(pathIndex, projectPath.length - 1)];
      const nextStar = projectPath[Math.min(pathIndex + 1, projectPath.length - 1)];

      const x = THREE.MathUtils.lerp(currentStar.x, nextStar.x, pathT) * POSITION_SCALE;
      const y = THREE.MathUtils.lerp(currentStar.y, nextStar.y, pathT) * POSITION_SCALE;
      const z = THREE.MathUtils.lerp(currentStar.z, nextStar.z, pathT) * POSITION_SCALE;

      newPos.set(x + lateralOffset * 8, y + 6, z + 20);
      newLookAt.set(x, y, z);
    } else {
      // Reveal: Pull back to see full constellation
      const t = (progress - reveal.start) / (reveal.end - reveal.start);

      newPos.set(lateralOffset * 3, 0 + t * 5, 60 + t * 20);
      newLookAt.set(0, 5, 0);
    }

    // Smooth camera movement
    const lerpSpeed = isMoving ? 0.03 : 0.02;
    targetPos.current.lerp(newPos, lerpSpeed);
    targetLookAt.current.lerp(newLookAt, lerpSpeed);

    // Calculate boost offset (decays when not boosting)
    if (isBoosting && isMoving) {
      boostOffset.current.x = Math.sin(time * 20) * 0.1;
      boostOffset.current.y = Math.cos(time * 15) * 0.05;
    } else {
      boostOffset.current.x *= 0.9;
      boostOffset.current.y *= 0.9;
    }

    // Apply position including boost offset
    camera.position.set(
      targetPos.current.x + boostOffset.current.x,
      targetPos.current.y + boostOffset.current.y,
      targetPos.current.z
    );
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// Distant star field - additional twinkling stars
// Uses pre-computed geometry to avoid Math.random() in render
function DistantStarField() {
  const pointsRef = useRef<THREE.Points>(null);

  // Use pre-computed geometry data (generated at module load, not during render)
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(DISTANT_STAR_DATA.positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(DISTANT_STAR_DATA.colors, 3));
    geom.setAttribute("size", new THREE.BufferAttribute(DISTANT_STAR_DATA.sizes, 1));
    return geom;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.002;

      // Twinkle effect by modifying opacity
      const material = pointsRef.current.material as THREE.PointsMaterial;
      const time = state.clock.elapsedTime;
      material.opacity = 0.5 + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cosmic dust particles
// Uses pre-computed geometry to avoid Math.random() in render
function CosmicDust() {
  const pointsRef = useRef<THREE.Points>(null);

  // Use pre-computed geometry data (generated at module load, not during render)
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(COSMIC_DUST_DATA.positions, 3));
    geom.setAttribute("size", new THREE.BufferAttribute(COSMIC_DUST_DATA.sizes, 1));
    return geom;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.1}
        color="#6688aa"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main scene content
function SceneContent({
  progress,
  currentScene,
  activeStar,
  illuminatedStars,
  lateralOffset,
  isMoving,
  isBoosting,
}: ConstellationCanvasProps) {
  return (
    <>
      {/* Camera control */}
      <CameraController
        progress={progress}
        lateralOffset={lateralOffset}
        isMoving={isMoving}
        isBoosting={isBoosting}
      />

      {/* Lighting */}
      <ambientLight intensity={0.15} />

      {/* Background stars - multiple layers for depth */}
      {/* Far layer - tiny distant stars */}
      <Stars
        radius={300}
        depth={200}
        count={8000}
        factor={2}
        saturation={0.1}
        fade
        speed={0.1}
      />
      {/* Mid layer - medium stars */}
      <Stars
        radius={150}
        depth={100}
        count={5000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.2}
      />
      {/* Near layer - brighter, larger stars */}
      <Stars
        radius={80}
        depth={50}
        count={2000}
        factor={6}
        saturation={0.5}
        fade
        speed={0.3}
      />

      {/* Cosmic dust - floating particles */}
      <CosmicDust />

      {/* Additional subtle star field for extra density */}
      <DistantStarField />

      {/* Constellation lines */}
      <AllConstellationLines
        illuminatedStars={illuminatedStars}
        progress={progress}
      />

      {/* Constellation stars */}
      {constellationLayout.map((star) => {
        const isActive = activeStar?.id === star.id;
        const isIlluminated = illuminatedStars.includes(star.id);
        const color = getStarColor(star.id);

        // Size based on type
        let size = 1;
        if (star.type === "origin") size = 1.5;
        if (star.type === "company") size = 1.2;
        if (star.type === "project") size = 1.3;

        return (
          <Star
            key={star.id}
            position={[
              star.x * POSITION_SCALE,
              star.y * POSITION_SCALE,
              star.z * POSITION_SCALE,
            ]}
            color={color}
            size={size}
            isActive={isActive}
            isIlluminated={isIlluminated}
          />
        );
      })}

      {/* Subtle grid for depth perception during intro */}
      {currentScene === "intro" && (
        <gridHelper
          args={[100, 50, "#222244", "#111122"]}
          position={[0, -30, 0]}
          rotation={[0, 0, 0]}
        />
      )}
    </>
  );
}

export function ConstellationCanvas(props: ConstellationCanvasProps) {
  return (
    <Canvas
      camera={{
        position: [0, 20, 60],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{ background: "#030318" }}
    >
      <PerformanceMonitor>
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
