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
  activeStar,
  lateralOffset,
  isMoving,
  isBoosting,
}: {
  progress: number;
  activeStar: StarPosition | null;
  lateralOffset: number;
  isMoving: boolean;
  isBoosting: boolean;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 60));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const { intro, origin, career, warp, projects, reveal } = constellationSceneRanges;

    // Calculate camera position based on scene
    let newPos = new THREE.Vector3(0, 0, 60);
    let newLookAt = new THREE.Vector3(0, 0, 0);

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

    camera.position.copy(targetPos.current);
    camera.lookAt(targetLookAt.current);

    // Add subtle movement when boosting
    if (isBoosting && isMoving) {
      camera.position.x += Math.sin(time * 20) * 0.1;
      camera.position.y += Math.cos(time * 15) * 0.05;
    }
  });

  return null;
}

// Cosmic dust particles
function CosmicDust({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread throughout the scene
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;
      sizes[i] = Math.random() * 0.1 + 0.02;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, [count]);

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
        activeStar={activeStar}
        lateralOffset={lateralOffset}
        isMoving={isMoving}
        isBoosting={isBoosting}
      />

      {/* Lighting */}
      <ambientLight intensity={0.15} />

      {/* Background stars */}
      <Stars
        radius={150}
        depth={100}
        count={3000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.2}
      />

      {/* Cosmic dust */}
      <CosmicDust count={400} />

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
