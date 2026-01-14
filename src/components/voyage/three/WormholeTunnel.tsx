"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// WORMHOLE TUNNEL - INTERSTELLAR STYLE
// Inspired by the scientifically-accurate
// wormhole from Interstellar (Kip Thorne)
// Features: spherical entrance, gravitational
// lensing effect, swirling matter
// ==========================================

// Vertex shader for the spherical wormhole effect
const wormholeVertexShader = `
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDistortion;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 pos = position;

    // Subtle pulsing/breathing effect
    float pulse = sin(uTime * 0.5) * 0.02;
    pos *= 1.0 + pulse;

    // Gravitational distortion effect
    float distortion = sin(uv.x * 6.28318 * 3.0 + uTime * 2.0) * 0.05;
    distortion += sin(uv.y * 6.28318 * 2.0 - uTime * 1.5) * 0.03;
    pos += normal * distortion * uProgress;
    vDistortion = distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for the spherical wormhole
const wormholeFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIntensity;
  uniform sampler2D uNoiseTexture;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDistortion;

  #define PI 3.14159265359

  // Simplex noise for organic effects
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Create spherical distortion - like looking through a crystal ball
    // Center of the sphere appears to look "through" to the other side
    vec2 center = uv - 0.5;
    float dist = length(center);

    // Gravitational lensing - space bends around the wormhole
    float lens = 1.0 - smoothstep(0.0, 0.5, dist);
    float lensRing = smoothstep(0.35, 0.4, dist) * smoothstep(0.5, 0.45, dist);

    // Einstein ring effect - bright ring around the edge
    float einsteinRing = smoothstep(0.42, 0.44, dist) * smoothstep(0.48, 0.46, dist);
    einsteinRing *= 1.5;

    // Swirling accretion disk effect
    float angle = atan(center.y, center.x);
    float spiral = sin(angle * 4.0 - uTime * 2.0 + dist * 20.0);
    spiral = spiral * 0.5 + 0.5;
    spiral *= smoothstep(0.5, 0.3, dist) * smoothstep(0.1, 0.25, dist);

    // Flowing energy streams
    float flow1 = snoise(vec2(angle * 2.0 + uTime * 0.5, dist * 10.0 - uTime * 3.0));
    float flow2 = snoise(vec2(angle * 3.0 - uTime * 0.7, dist * 8.0 - uTime * 2.5));
    float flow = (flow1 * 0.5 + flow2 * 0.5) * 0.5 + 0.5;
    flow *= smoothstep(0.5, 0.2, dist);

    // Inner wormhole throat - the "tunnel" visible through the sphere
    float throat = smoothstep(0.25, 0.0, dist);
    float throatRings = sin(dist * 60.0 - uTime * 8.0) * 0.5 + 0.5;
    throatRings *= throat;

    // Color mixing
    vec3 color = uColorA;

    // Outer accretion glow
    color = mix(color, uColorB, spiral * 0.8);

    // Flowing energy
    color = mix(color, uColorC, flow * 0.6);

    // Einstein ring is bright white/cyan
    color = mix(color, vec3(1.0, 1.0, 1.0), einsteinRing * 0.8);

    // Throat interior - deeper colors
    vec3 throatColor = mix(uColorB, uColorC, throatRings);
    color = mix(color, throatColor, throat * 0.7);

    // Add brightness based on lensing
    color += lensRing * uColorA * 0.5;

    // Edge glow
    float edgeGlow = smoothstep(0.5, 0.35, dist);

    // Alpha - sphere visible with bright ring
    float alpha = 0.0;
    alpha += edgeGlow * 0.6;  // Main sphere visibility
    alpha += einsteinRing * 1.0;  // Bright ring
    alpha += spiral * 0.5;  // Accretion disk
    alpha += flow * 0.4;  // Energy flow
    alpha += throat * 0.8;  // Throat center
    alpha += throatRings * 0.3;  // Throat rings

    alpha *= uIntensity;
    alpha = clamp(alpha, 0.0, 1.0);

    // Chromatic aberration at edges
    float chromatic = smoothstep(0.3, 0.5, dist) * 0.2;
    color.r += chromatic * 0.3;
    color.b += chromatic * 0.2;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface WormholeTunnelProps {
  progress?: number;
  intensity?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export function WormholeTunnel({
  progress = 0,
  intensity = 1,
  colorA = "#374151",  // Dark gray
  colorB = "#1f2937",  // Darker gray
  colorC = "#d4a574",  // Warm golden
}: WormholeTunnelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: wormholeVertexShader,
      fragmentShader: wormholeFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: progress },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
        uColorC: { value: new THREE.Color(colorC) },
        uIntensity: { value: intensity },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [colorA, colorB, colorC]);

  // Animate the wormhole
  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uProgress.value = progress;
      material.uniforms.uIntensity.value = intensity;
    }
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (innerMeshRef.current) {
      // Counter-rotation for depth
      innerMeshRef.current.rotation.z = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group>
      {/* Main wormhole sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[8, 128, 128]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Inner sphere for depth */}
      <mesh ref={innerMeshRef} scale={0.7}>
        <sphereGeometry args={[8, 64, 64]} />
        <primitive
          object={material.clone()}
          attach="material"
        />
      </mesh>

      {/* Glow rings around the sphere */}
      <WormholeGlowRings progress={progress} />

      {/* Central light source */}
      <pointLight position={[0, 0, 0]} color={colorA} intensity={3 * intensity} distance={30} />
      <pointLight position={[0, 0, 5]} color={colorB} intensity={2 * intensity} distance={20} />
    </group>
  );
}

// ==========================================
// WORMHOLE GLOW RINGS
// Concentric rings that pulse and rotate
// ==========================================

function WormholeGlowRings({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Dark & golden ring colors
  const ringColors = ["#b8860b", "#d4a574", "#9ca3af", "#6b7280"];

  return (
    <group ref={groupRef}>
      {[1, 1.2, 1.4, 1.6].map((scale, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 4]} scale={scale}>
          <torusGeometry args={[9, 0.08, 8, 128]} />
          <meshBasicMaterial
            color={ringColors[i]}
            transparent
            opacity={0.4 - i * 0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// WORMHOLE PARTICLES
// Particles that spiral into the wormhole
// ==========================================

export function WormholeParticles({ count = 2000, progress = 0 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities, angles] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const angles = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Dark & golden particle colors
    const colorPalette = [
      new THREE.Color("#b8860b"),  // Dark golden
      new THREE.Color("#d4a574"),  // Warm golden
      new THREE.Color("#9ca3af"),  // Gray
      new THREE.Color("#e5e5e5"),  // Off-white
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute in a shell around the wormhole
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 10 + Math.random() * 25;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i] = 0.02 + Math.random() * 0.05;
      angles[i] = theta;

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return [geom, velocities, angles];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Calculate current radius from center
        const radius = Math.sqrt(x * x + y * y + z * z);

        // Pull particles toward center (gravitational attraction)
        const pullStrength = velocities[i] * (1 + progress * 2);

        if (radius > 3) {
          // Normalize and pull toward center
          const nx = x / radius;
          const ny = y / radius;
          const nz = z / radius;

          positions[i3] -= nx * pullStrength;
          positions[i3 + 1] -= ny * pullStrength;
          positions[i3 + 2] -= nz * pullStrength;

          // Add spiral motion
          const angle = state.clock.elapsedTime * 0.5 + angles[i];
          const spiralStrength = 0.02;
          positions[i3] += Math.cos(angle) * spiralStrength * (1 - radius / 35);
          positions[i3 + 1] += Math.sin(angle) * spiralStrength * (1 - radius / 35);
        } else {
          // Reset particle to outer edge
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const newRadius = 25 + Math.random() * 10;

          positions[i3] = newRadius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = newRadius * Math.cos(phi);
        }
      }

      positionAttribute.needsUpdate = true;

      // Rotate the whole particle system
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
