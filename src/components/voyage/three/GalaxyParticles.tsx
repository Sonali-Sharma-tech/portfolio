"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// GALAXY PARTICLES
// Shader-based spiral galaxy with animated rotation
// Each arm rotates at different speeds based on distance
// ==========================================

// Vertex shader for galaxy particles
const vertexShader = `
  uniform float uTime;
  uniform float uSize;

  attribute float aScale;
  attribute float aRandomness;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vDistance;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Calculate distance from center
    float distanceFromCenter = length(modelPosition.xz);
    vDistance = distanceFromCenter;

    // Rotate based on distance (inner stars rotate faster)
    float rotationSpeed = 0.1 / (distanceFromCenter + 0.1);
    float angle = uTime * rotationSpeed;

    // Apply rotation
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    float x = modelPosition.x * cosAngle - modelPosition.z * sinAngle;
    float z = modelPosition.x * sinAngle + modelPosition.z * cosAngle;

    // Add subtle oscillation
    float oscillation = sin(uTime * 0.5 + distanceFromCenter) * aRandomness * 0.5;

    modelPosition.x = x + oscillation;
    modelPosition.z = z;
    modelPosition.y += sin(uTime * 0.3 + distanceFromCenter * 2.0) * aRandomness * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Size attenuation
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    vColor = aColor;
  }
`;

// Fragment shader for galaxy particles
const fragmentShader = `
  varying vec3 vColor;
  varying float vDistance;

  void main() {
    // Create circular point with soft edge
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));

    // Soft circle falloff
    float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    strength = pow(strength, 1.5);

    // Add glow
    float glow = exp(-distanceToCenter * 4.0) * 0.5;
    strength += glow;

    // Final color with transparency
    vec3 finalColor = vColor;

    gl_FragColor = vec4(finalColor, strength);
  }
`;

interface GalaxyParticlesProps {
  count?: number;
  radius?: number;
  branches?: number;
  spin?: number;
  randomness?: number;
  innerColor?: string;
  outerColor?: string;
  rotationSpeed?: number;
}

export function GalaxyParticles({
  count = 50000,
  radius = 15,
  branches = 4,
  spin = 1.5,
  randomness = 0.3,
  innerColor = "#ff6600",
  outerColor = "#1b3984",
  rotationSpeed = 0.05,
}: GalaxyParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate galaxy geometry
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomnessArr = new Float32Array(count);

    const colorInner = new THREE.Color(innerColor);
    const colorOuter = new THREE.Color(outerColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position on spiral arm
      const radiusValue = Math.random() * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = radiusValue * spin;

      // Randomness that increases with distance
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue * 0.3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radiusValue + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radiusValue + randomZ;

      // Color gradient from center to edge
      const mixedColor = colorInner.clone();
      mixedColor.lerp(colorOuter, radiusValue / radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Random scale for variation
      scales[i] = 0.5 + Math.random() * 1.5;
      randomnessArr[i] = Math.random();
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geom.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geom.setAttribute("aRandomness", new THREE.BufferAttribute(randomnessArr, 1));

    return geom;
  }, [count, radius, branches, spin, randomness, innerColor, outerColor]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }, []);

  // Animate the galaxy
  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime * rotationSpeed;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
