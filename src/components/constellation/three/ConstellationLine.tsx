"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getStarById } from "@/lib/voyage-data";

// ==========================================
// CONSTELLATION LINE
// Animated line connecting two stars
// Draws progressively as journey advances
// ==========================================

interface ConstellationLineProps {
  fromId: string;
  toId: string;
  isIlluminated: boolean;
  illuminationProgress?: number; // 0-1 for partial draw
  color?: string;
}

// Scale factor for positioning (constellation coordinates are -1 to 1)
const SCALE = 30;

export function ConstellationLine({
  fromId,
  toId,
  isIlluminated,
  illuminationProgress = 1,
  color = "#4488ff",
}: ConstellationLineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const fromStar = getStarById(fromId);
  const toStar = getStarById(toId);

  // Create line geometry and material
  const { line, glowLine } = useMemo(() => {
    if (!fromStar || !toStar) {
      return { line: null, glowLine: null };
    }

    const from = new THREE.Vector3(
      fromStar.x * SCALE,
      fromStar.y * SCALE,
      fromStar.z * SCALE
    );
    const to = new THREE.Vector3(
      toStar.x * SCALE,
      toStar.y * SCALE,
      toStar.z * SCALE
    );

    // Create points along the line for smooth rendering
    const linePoints: THREE.Vector3[] = [];
    const segments = 20;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      linePoints.push(new THREE.Vector3().lerpVectors(from, to, t));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
    });

    const lineObj = new THREE.Line(geometry, material);

    // Glow line
    const glowGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const glowMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const glowLineObj = new THREE.Line(glowGeometry, glowMaterial);

    return { line: lineObj, glowLine: glowLineObj };
  }, [fromStar, toStar, color]);

  // Update material opacity based on illumination state
  useEffect(() => {
    if (line) {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = isIlluminated ? 0.8 : 0.15;
      mat.color.set(isIlluminated ? color : "#333344");
    }
    if (glowLine) {
      glowLine.visible = isIlluminated;
    }
  }, [isIlluminated, line, glowLine, color]);

  // Animate line drawing
  useFrame(() => {
    if (!line || !isIlluminated) return;

    const geometry = line.geometry;
    const positions = geometry.attributes.position.array;
    const totalPoints = positions.length / 3;

    // Calculate how many points should be visible
    const visiblePoints = Math.floor(totalPoints * illuminationProgress);

    // Update draw range to create drawing effect
    geometry.setDrawRange(0, visiblePoints);

    if (glowLine) {
      glowLine.geometry.setDrawRange(0, visiblePoints);
    }
  });

  if (!fromStar || !toStar || !line) return null;

  return (
    <group ref={groupRef}>
      <primitive object={line} />
      {isIlluminated && glowLine && <primitive object={glowLine} />}
    </group>
  );
}

// Render all constellation connections
interface AllConstellationLinesProps {
  illuminatedStars: string[];
  progress: number;
}

export function AllConstellationLines({
  illuminatedStars,
}: AllConstellationLinesProps) {
  // Define connections and their colors based on path
  const connections: { from: string; to: string; color: string }[] = [
    { from: "origin", to: "ey", color: "#ffd700" }, // gold from origin
    { from: "ey", to: "6figr", color: "#ff8844" }, // orange
    { from: "6figr", to: "captain-fresh", color: "#44ff88" }, // green
    { from: "captain-fresh", to: "glance", color: "#ff44aa" }, // magenta
    { from: "glance", to: "devtoolkit", color: "#44ffff" }, // cyan
    { from: "glance", to: "colorful-extension", color: "#44ffff" },
    { from: "glance", to: "black-note", color: "#44ffff" },
    { from: "devtoolkit", to: "colorful-extension", color: "#88ff88" },
    { from: "colorful-extension", to: "black-note", color: "#88ff88" },
  ];

  return (
    <group>
      {connections.map(({ from, to, color }) => {
        // A line is illuminated if both endpoints are illuminated
        const isIlluminated =
          illuminatedStars.includes(from) && illuminatedStars.includes(to);

        return (
          <ConstellationLine
            key={`${from}-${to}`}
            fromId={from}
            toId={to}
            isIlluminated={isIlluminated}
            color={color}
          />
        );
      })}
    </group>
  );
}
