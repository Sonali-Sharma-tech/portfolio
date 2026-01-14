"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// CINEMATIC PLANET
// Realistic planet with atmosphere, glow,
// surface detail, and optional rings
// ==========================================

// Planet surface shader - creates procedural terrain
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uLightPosition;
  uniform float uRoughness;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // Simplex noise for surface detail
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
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

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
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
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Generate surface pattern
    vec3 noisePos = vPosition * 3.0;
    float noise1 = fbm(noisePos);
    float noise2 = fbm(noisePos * 2.0 + 10.0);

    // Color mixing based on noise
    vec3 surfaceColor = mix(uColor1, uColor2, noise1 * 0.5 + 0.5);
    surfaceColor = mix(surfaceColor, uColor3, noise2 * 0.3 + 0.35);

    // Lighting
    vec3 lightDir = normalize(uLightPosition - vWorldPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);

    // Soft terminator (day/night boundary)
    float terminator = smoothstep(-0.1, 0.3, diff);

    // Ambient and diffuse
    vec3 ambient = surfaceColor * 0.15;
    vec3 diffuse = surfaceColor * diff * 0.85;

    // Add subtle specular for wet/icy surfaces
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0) * (1.0 - uRoughness);

    vec3 finalColor = ambient + diffuse * terminator + vec3(spec * 0.2);

    // Add very subtle night side glow (city lights effect)
    float nightGlow = (1.0 - terminator) * 0.05;
    finalColor += uColor2 * nightGlow * noise2;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Atmosphere shader - fresnel glow around planet
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;
  uniform vec3 uLightPosition;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Fresnel effect for atmosphere rim
    vec3 viewDirection = normalize(-vPosition);
    float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    fresnel = pow(fresnel, 3.0);

    // Light influence on atmosphere
    vec3 lightDir = normalize(uLightPosition);
    float lightInfluence = max(dot(vNormal, lightDir), 0.0) * 0.5 + 0.5;

    // Glow intensity
    float glow = fresnel * uIntensity * lightInfluence;

    // Color with slight variation
    vec3 color = uAtmosphereColor;
    color += vec3(0.1, 0.2, 0.3) * (1.0 - fresnel);

    gl_FragColor = vec4(color, glow);
  }
`;

// Ring shader for Saturn-like planets
const ringVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    // Distance from center for ring pattern
    float dist = length(vPosition.xz);

    // Create ring bands
    float bands = sin(dist * 30.0) * 0.5 + 0.5;
    bands *= sin(dist * 50.0 + 1.0) * 0.3 + 0.7;
    bands *= sin(dist * 15.0 + 2.0) * 0.4 + 0.6;

    // Color variation
    vec3 color = mix(uColor1, uColor2, bands);

    // Fade at edges
    float innerFade = smoothstep(0.5, 0.7, dist / 2.0);
    float outerFade = 1.0 - smoothstep(0.85, 1.0, dist / 2.0);
    float alpha = bands * innerFade * outerFade * uOpacity;

    // Add gaps in rings
    float gaps = step(0.3, fract(dist * 8.0));
    alpha *= 0.5 + gaps * 0.5;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface CinematicPlanetProps {
  position?: [number, number, number];
  size?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  hasRings?: boolean;
  ringColor1?: string;
  ringColor2?: string;
  rotationSpeed?: number;
  isActive?: boolean;
}

export function CinematicPlanet({
  position = [0, 0, 0],
  size = 1,
  color1 = "#4a90d9",
  color2 = "#1a5a8a",
  color3 = "#0d3a5d",
  atmosphereColor = "#6eb5ff",
  atmosphereIntensity = 0.8,
  hasRings = false,
  ringColor1 = "#aa9977",
  ringColor2 = "#665544",
  rotationSpeed = 0.1,
  isActive = false,
}: CinematicPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Planet surface material
  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uColor3: { value: new THREE.Color(color3) },
        uLightPosition: { value: new THREE.Vector3(50, 30, 50) },
        uRoughness: { value: 0.7 },
      },
    });
  }, [color1, color2, color3]);

  // Atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uAtmosphereColor: { value: new THREE.Color(atmosphereColor) },
        uIntensity: { value: atmosphereIntensity },
        uLightPosition: { value: new THREE.Vector3(50, 30, 50) },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [atmosphereColor, atmosphereIntensity]);

  // Ring material
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      uniforms: {
        uColor1: { value: new THREE.Color(ringColor1) },
        uColor2: { value: new THREE.Color(ringColor2) },
        uOpacity: { value: 0.7 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [ringColor1, ringColor2]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (planetRef.current) {
      planetRef.current.rotation.y = time * rotationSpeed;
      planetMaterial.uniforms.uTime.value = time;
    }

    if (atmosphereRef.current) {
      // Pulse atmosphere when active
      const pulse = isActive ? Math.sin(time * 3) * 0.2 + 1 : 1;
      atmosphereMaterial.uniforms.uIntensity.value = atmosphereIntensity * pulse;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Planet surface */}
      <mesh ref={planetRef} scale={size}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={planetMaterial} attach="material" />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={size * 1.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Outer glow (larger, softer) */}
      <mesh scale={size * 1.4}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={isActive ? 0.15 : 0.05}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rings (optional) */}
      {hasRings && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2.5, 0, 0]}
          scale={size}
        >
          <ringGeometry args={[1.4, 2.2, 64]} />
          <primitive object={ringMaterial} attach="material" />
        </mesh>
      )}

      {/* Point light for active state */}
      {isActive && (
        <pointLight
          color={atmosphereColor}
          intensity={3}
          distance={size * 15}
        />
      )}
    </group>
  );
}

// ==========================================
// GALAXY CORE with Lens Flare
// Bright central core with volumetric glow
// ==========================================

const coreVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Central bright core
    float core = 1.0 - smoothstep(0.0, 0.1, dist);
    core = pow(core, 2.0);

    // Inner glow
    float innerGlow = 1.0 - smoothstep(0.0, 0.25, dist);
    innerGlow = pow(innerGlow, 1.5);

    // Outer halo
    float outerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
    outerGlow = pow(outerGlow, 2.0);

    // Rays (starburst)
    float angle = atan(center.y, center.x);
    float rays = sin(angle * 6.0 + uTime * 0.5) * 0.5 + 0.5;
    rays *= 1.0 - smoothstep(0.0, 0.4, dist);
    rays *= 0.3;

    float intensity = core + innerGlow * 0.6 + outerGlow * 0.2 + rays;

    vec3 color = mix(uColor2, uColor1, core);
    color += vec3(1.0, 0.9, 0.8) * core * 0.5;

    gl_FragColor = vec4(color, intensity);
  }
`;

interface GalaxyCoreProps {
  position?: [number, number, number];
  size?: number;
  color1?: string;
  color2?: string;
}

export function GalaxyCore({
  position = [0, 0, 0],
  size = 3,
  color1 = "#ffcc44",
  color2 = "#ff8800",
}: GalaxyCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, [color1, color2]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Billboard - always face camera
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
