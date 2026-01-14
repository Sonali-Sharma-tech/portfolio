"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// CINEMATIC NEBULA BACKGROUND
// Volumetric space fog with color gradients
// Creates depth and atmosphere like real space photos
// ==========================================

const nebulaVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex 3D noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractal Brownian Motion
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec3 pos = vPosition * 0.015;
    pos.z += uTime * 0.02;

    // Multiple noise layers for depth
    float noise1 = fbm(pos);
    float noise2 = fbm(pos * 2.0 + vec3(100.0));
    float noise3 = fbm(pos * 0.5 + vec3(50.0, 0.0, uTime * 0.01));

    // Combine noises
    float nebula = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    nebula = smoothstep(-0.2, 0.8, nebula);

    // Color mixing based on position and noise
    vec3 color = mix(uColor1, uColor2, noise1 * 0.5 + 0.5);
    color = mix(color, uColor3, noise2 * 0.5 + 0.5);

    // Add bright spots (stars within nebula)
    float stars = pow(snoise(vPosition * 0.5), 8.0) * 2.0;
    color += vec3(stars);

    // Fade at edges for sphere
    float dist = length(vUv - 0.5) * 2.0;
    float fade = 1.0 - smoothstep(0.3, 1.0, dist);

    float alpha = nebula * uIntensity * fade * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface NebulaBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  intensity?: number;
  scale?: number;
}

export function NebulaBackground({
  color1 = "#1a0a2e",
  color2 = "#16213e",
  color3 = "#0f3460",
  intensity = 1,
  scale = 200,
}: NebulaBackgroundProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uColor3: { value: new THREE.Color(color3) },
        uIntensity: { value: intensity },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [color1, color2, color3, intensity]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ==========================================
// COSMIC DUST PARTICLES
// Floating particles that create depth
// ==========================================

const dustVertexShader = `
  uniform float uTime;
  uniform float uSize;

  attribute float aScale;
  attribute float aSpeed;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Slow drift
    pos.x += sin(uTime * aSpeed + position.z) * 0.5;
    pos.y += cos(uTime * aSpeed * 0.7 + position.x) * 0.3;
    pos.z += sin(uTime * aSpeed * 0.5) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = uSize * aScale * (100.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 10.0);

    gl_Position = projectionMatrix * mvPosition;

    // Fade based on depth
    vAlpha = smoothstep(200.0, 50.0, -mvPosition.z) * 0.6;
  }
`;

const dustFragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vAlpha;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface CosmicDustProps {
  count?: number;
  spread?: number;
  color?: string;
}

export function CosmicDust({
  count = 3000,
  spread = 100,
  color = "#8888ff",
}: CosmicDustProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, material] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;

      scales[i] = 0.3 + Math.random() * 1.5;
      speeds[i] = 0.1 + Math.random() * 0.3;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 3 },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return [geom, mat];
  }, [count, spread, color]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ==========================================
// BRIGHT STARS WITH GLOW
// Individual bright stars with lens-like glow
// ==========================================

const starGlowVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vIntensity;

  void main() {
    vColor = aColor;

    // Twinkle effect
    float twinkle = sin(uTime * 2.0 + aPhase) * 0.3 + 0.7;
    vIntensity = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (150.0 / -mvPosition.z) * twinkle;
    gl_PointSize = clamp(gl_PointSize, 1.0, 30.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starGlowFragmentShader = `
  varying vec3 vColor;
  varying float vIntensity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Core
    float core = 1.0 - smoothstep(0.0, 0.1, dist);

    // Inner glow
    float innerGlow = 1.0 - smoothstep(0.0, 0.3, dist);
    innerGlow = pow(innerGlow, 2.0);

    // Outer glow (softer, larger)
    float outerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
    outerGlow = pow(outerGlow, 3.0) * 0.5;

    // Spikes (cross pattern)
    float spike1 = 1.0 - smoothstep(0.0, 0.02, abs(center.x));
    float spike2 = 1.0 - smoothstep(0.0, 0.02, abs(center.y));
    float spikes = max(spike1, spike2) * (1.0 - dist * 2.0) * 0.3;
    spikes = max(0.0, spikes);

    float alpha = core + innerGlow * 0.6 + outerGlow * 0.3 + spikes;
    alpha *= vIntensity;

    vec3 finalColor = vColor * (core + 0.5) + vec3(1.0) * core * 0.5;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface BrightStarsProps {
  count?: number;
  spread?: number;
}

export function BrightStars({ count = 200, spread = 150 }: BrightStarsProps) {
  const [geometry, material] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#ffeedd"),
      new THREE.Color("#aaccff"),
      new THREE.Color("#ffddaa"),
      new THREE.Color("#ddddff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spread stars in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = spread * (0.5 + Math.random() * 0.5);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      sizes[i] = 1 + Math.random() * 4;
      phases[i] = Math.random() * Math.PI * 2;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: starGlowVertexShader,
      fragmentShader: starGlowFragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return [geom, mat];
  }, [count, spread]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <points geometry={geometry} material={material} />;
}
