"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { voyageData, sceneRanges } from "@/lib/voyage-data";
import type { VoyageCompany } from "@/lib/voyage-data";

// ==========================================
// SPACE CAREER SCENE - SPIRAL FLYTHROUGH
// Camera travels along a spiral path through space
// Planets appear one at a time as you approach
// Inspired by Galaxy Voyager and Space Journey demos
// ==========================================

interface SpaceStationSceneProps {
  scrollProgress: number;
}

export function SpaceStationScene({ scrollProgress }: SpaceStationSceneProps) {
  const isActive =
    scrollProgress >= sceneRanges.career.start &&
    scrollProgress < sceneRanges.career.end;

  const sceneProgress = isActive
    ? (scrollProgress - sceneRanges.career.start) /
      (sceneRanges.career.end - sceneRanges.career.start)
    : 0;

  const currentCompany = voyageData.companies.find(
    (c) => scrollProgress >= c.scrollStart && scrollProgress < c.scrollEnd
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 bg-black">
      {/* 3D Space Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SpiralGalaxyScene
            progress={sceneProgress}
            currentCompany={currentCompany}
            scrollProgress={scrollProgress}
          />
        </Suspense>
      </Canvas>

      {/* Company Info Panel - only shows when near a company */}
      <AnimatePresence>
        {currentCompany && (
          <CompanyInfoPanel company={currentCompany} scrollProgress={scrollProgress} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SPIRAL GALAXY SCENE
// Camera flies through spiral arm, encountering planets
// ==========================================

interface SpiralGalaxySceneProps {
  progress: number;
  currentCompany: VoyageCompany | null | undefined;
  scrollProgress: number;
}

function SpiralGalaxyScene({ progress, currentCompany, scrollProgress }: SpiralGalaxySceneProps) {
  const { camera } = useThree();
  const galaxyRef = useRef<THREE.Group>(null);

  // Camera stays further back for a wide view of the galaxy
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Gentle orbit around the galaxy - stay zoomed out
    const orbitAngle = progress * Math.PI * 0.8 + time * 0.02;
    const orbitRadius = 120; // Stay far from galaxy
    const orbitHeight = 60 + Math.sin(progress * Math.PI) * 20;

    // Camera orbits around the galaxy
    const camX = Math.cos(orbitAngle) * orbitRadius;
    const camZ = Math.sin(orbitAngle) * orbitRadius;
    const camY = orbitHeight;

    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.03);

    // Always look at galaxy center
    camera.lookAt(0, 0, 0);

    // Gentle galaxy rotation
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <group ref={galaxyRef}>
      {/* Deep space background */}
      <color attach="background" args={["#030318"]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.1} />

      {/* Multi-layer star field - MORE stars spread everywhere */}
      {/* Reduced star counts for better performance */}
      <Stars radius={400} depth={300} count={5000} factor={4} saturation={0.3} fade speed={0.3} />
      <Stars radius={200} depth={150} count={3000} factor={6} saturation={0.5} fade speed={0.5} />

      {/* Spiral galaxy */}
      <SpiralDustLanes />

      {/* Galaxy core glow */}
      <GalaxyCore />

      {/* Career waypoint planets - positioned along spiral */}
      {voyageData.companies.map((company, index) => {
        // Calculate visibility - only show when approaching
        const companyMidpoint = (company.scrollStart + company.scrollEnd) / 2;
        const distanceToCompany = Math.abs(scrollProgress - companyMidpoint);
        const isVisible = distanceToCompany < 15; // Only visible within 15% scroll distance
        const isApproaching = scrollProgress < company.scrollEnd;

        return (
          <CareerPlanet
            key={company.id}
            company={company}
            index={index}
            totalPlanets={voyageData.companies.length}
            isActive={currentCompany?.id === company.id}
            isVisible={isVisible}
            isApproaching={isApproaching}
            scrollProgress={scrollProgress}
          />
        );
      })}

      {/* Traveling particles around camera */}
      <TravelParticles progress={progress} />
    </group>
  );
}

// ==========================================
// SPIRAL DUST LANES
// Visual representation of galaxy arms
// Uses logarithmic spiral with smooth color gradients
// ==========================================

// Create a circular gradient texture for soft particles
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Radial gradient: bright center, soft falloff
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function SpiralDustLanes() {
  const pointsRef = useRef<THREE.Points>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Create texture once
  if (!textureRef.current) {
    textureRef.current = createParticleTexture();
  }

  const geometry = useMemo(() => {
    // Galaxy parameters - classic spiral galaxy style
    // Based on reference: multiple tight arms, dense core, scattered field stars
    // Reduced particle count for faster initialization (still looks great)
    const armParticleCount = 25000; // Particles in spiral arms (reduced from 50k)
    const fieldStarCount = 8000;    // Background scattered stars (reduced from 15k)
    const totalCount = armParticleCount + fieldStarCount;
    const galaxyRadius = 70;
    const arms = 5; // Multiple spiral arms like reference
    const armWidth = 0.15; // Thin arms
    const spiralTightness = 3.5; // How tight the spiral winds
    const coreRadius = 8; // Dense inner core

    const positions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const sizes = new Float32Array(totalCount);

    // Color - bright white/cream like the reference image
    const coreColor = new THREE.Color('#ffffff');
    const armColor = new THREE.Color('#e8e8f0');
    const outerColor = new THREE.Color('#aaaacc');

    // Generate spiral arm particles
    for (let i = 0; i < armParticleCount; i++) {
      const i3 = i * 3;

      // Which arm this particle belongs to
      const armIndex = i % arms;
      const armBaseAngle = (armIndex / arms) * Math.PI * 2;

      // Distance from center - weighted toward center for denser core
      // Use sqrt for more uniform radial distribution, then apply density weighting
      const rawRadius = Math.random();
      const radius = Math.pow(rawRadius, 0.7) * galaxyRadius;

      // Spiral angle - increases with distance (logarithmic spiral)
      const spiralAngle = armBaseAngle + (radius / galaxyRadius) * spiralTightness * Math.PI;

      // Perpendicular spread - tighter near core, wider at edges
      const spreadFactor = armWidth * (0.3 + radius / galaxyRadius * 0.7);
      const perpAngle = spiralAngle + Math.PI / 2;
      const spread = (Math.random() - 0.5) * 2;
      const spreadDistance = Math.pow(Math.abs(spread), 2) * Math.sign(spread) * radius * spreadFactor;

      // Height variation - disk is thin
      const heightSpread = (Math.random() - 0.5) * 2 * (1 + radius * 0.02);

      // Final position
      const x = Math.cos(spiralAngle) * radius + Math.cos(perpAngle) * spreadDistance;
      const z = Math.sin(spiralAngle) * radius + Math.sin(perpAngle) * spreadDistance;
      const y = heightSpread;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Color - brighter in core, slightly dimmer at edges
      const radiusRatio = radius / galaxyRadius;
      const mixedColor = coreColor.clone();
      if (radiusRatio < 0.3) {
        mixedColor.lerp(armColor, radiusRatio / 0.3);
      } else {
        mixedColor.copy(armColor).lerp(outerColor, (radiusRatio - 0.3) / 0.7);
      }

      // Add slight brightness variation
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = mixedColor.r * brightness;
      colors[i3 + 1] = mixedColor.g * brightness;
      colors[i3 + 2] = mixedColor.b * brightness;

      // Size - smaller particles for crisp look, larger in core
      sizes[i] = radius < coreRadius ? 1.2 + Math.random() * 0.8 : 0.6 + Math.random() * 0.6;
    }

    // Generate field stars (scattered everywhere like reference)
    for (let i = armParticleCount; i < totalCount; i++) {
      const i3 = i * 3;

      // Random position in a larger sphere around the galaxy
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = galaxyRadius * 0.5 + Math.random() * galaxyRadius * 1.2;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 20; // Flatten the field star distribution
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Field stars are dimmer
      const brightness = 0.4 + Math.random() * 0.4;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness * 1.1; // Slight blue tint

      sizes[i] = 0.4 + Math.random() * 0.5;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geom;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={1.0}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={textureRef.current}
      />
    </points>
  );
}

// ==========================================
// GALAXY CORE
// Bright central glow
// ==========================================

function GalaxyCore() {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Dark center - black hole effect like reference image */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Inner glow ring around dark center */}
      <mesh ref={glowRef}>
        <ringGeometry args={[2, 5, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow layers - subtle white/cream like reference */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#eeeeff" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#ddddee" transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* Subtle core light - not too bright */}
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={3} distance={50} />
    </group>
  );
}

// ==========================================
// CAREER PLANET
// Realistic planet that appears as you approach
// ==========================================

interface CareerPlanetProps {
  company: VoyageCompany;
  index: number;
  totalPlanets: number;
  isActive: boolean;
  isVisible: boolean;
  isApproaching: boolean;
  scrollProgress: number;
}

const PLANET_THEMES: Record<string, {
  primary: string;
  secondary: string;
  atmosphere: string;
  hasRing: boolean;
}> = {
  orange: { primary: "#e07020", secondary: "#802800", atmosphere: "#ff8844", hasRing: false },
  green: { primary: "#20a060", secondary: "#0a4020", atmosphere: "#40ff80", hasRing: true },
  magenta: { primary: "#c040a0", secondary: "#601050", atmosphere: "#ff60c0", hasRing: false },
  cyan: { primary: "#40a0c0", secondary: "#104060", atmosphere: "#60e0ff", hasRing: true },
};

function CareerPlanet({
  company,
  index,
  totalPlanets,
  isActive,
  isVisible,
}: CareerPlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const theme = PLANET_THEMES[company.color] || PLANET_THEMES.cyan;

  // Position along spiral path
  const position = useMemo((): [number, number, number] => {
    // Place planets at specific points along the spiral
    const t = (index + 0.5) / totalPlanets;
    const spiralAngle = t * Math.PI * 2.5;
    const spiralRadius = 80 - t * 55;

    // Offset to side of path so camera doesn't collide
    const offsetAngle = spiralAngle + Math.PI / 4;

    return [
      Math.cos(offsetAngle) * spiralRadius * 0.6,
      (index - 1.5) * 3 + Math.sin(index * 2) * 4,
      Math.sin(offsetAngle) * spiralRadius * 0.6,
    ];
  }, [index, totalPlanets]);

  // Size based on company importance (later = bigger)
  const baseSize = 2.5 + index * 0.8;
  const size = isActive ? baseSize * 1.3 : baseSize;

  useFrame((state) => {
    if (planetRef.current) {
      // Rotate planet
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.1;

      // Pulse when active
      if (isActive) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
        planetRef.current.scale.setScalar(size * pulse);
      } else {
        planetRef.current.scale.setScalar(size);
      }
    }
  });

  if (!isVisible) return null;

  return (
    <group position={position} ref={planetRef}>
      {/* Planet body - gradient sphere */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color={theme.primary}
          emissive={isActive ? theme.primary : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Surface detail layer */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={theme.secondary}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Atmosphere glow - outer */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={theme.atmosphere}
          transparent
          opacity={isActive ? 0.35 : 0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ring for ringed planets */}
      {theme.hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, Math.PI / 8]}>
          <ringGeometry args={[1.6, 2.3, 64]} />
          <meshBasicMaterial
            color={theme.atmosphere}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Active glow */}
      {isActive && (
        <pointLight color={theme.atmosphere} intensity={5} distance={20} />
      )}

      {/* Directional light to illuminate planet */}
      <directionalLight position={[5, 3, 5]} intensity={1} />
    </group>
  );
}

// ==========================================
// TRAVEL PARTICLES
// Particles that fly past the camera
// ==========================================

function TravelParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities] = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i] = 0.3 + Math.random() * 0.7;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return [geom, velocities];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const camPos = state.camera.position;

      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;

        // Move particles toward camera direction
        positions[i3 + 2] += velocities[i] * (1 + progress);

        // Reset particles that go too far
        const distX = positions[i3] - camPos.x;
        const distZ = positions[i3 + 2] - camPos.z;
        const dist = Math.sqrt(distX * distX + distZ * distZ);

        if (dist > 60) {
          // Respawn ahead of camera
          const angle = Math.random() * Math.PI * 2;
          const radius = 20 + Math.random() * 40;
          positions[i3] = camPos.x + Math.cos(angle) * radius;
          positions[i3 + 1] = camPos.y + (Math.random() - 0.5) * 30;
          positions[i3 + 2] = camPos.z + Math.sin(angle) * radius;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ==========================================
// COMPANY INFO PANEL
// ==========================================

interface CompanyInfoPanelProps {
  company: VoyageCompany;
  scrollProgress: number;
}

function CompanyInfoPanel({ company, scrollProgress }: CompanyInfoPanelProps) {
  const companyProgress =
    (scrollProgress - company.scrollStart) /
    (company.scrollEnd - company.scrollStart);

  const theme = PLANET_THEMES[company.color];
  const color = theme?.atmosphere || "#00fff5";

  return (
    <motion.div
      className="absolute right-6 top-1/2 -translate-y-1/2 w-[320px] z-30"
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="relative border bg-black/85 backdrop-blur-lg"
        style={{
          borderColor: `${color}50`,
          boxShadow: `0 0 40px ${color}25`,
        }}
      >
        {/* Corner accents */}
        <div className="absolute -top-px -left-px w-3 h-3 border-l-2 border-t-2" style={{ borderColor: color }} />
        <div className="absolute -top-px -right-px w-3 h-3 border-r-2 border-t-2" style={{ borderColor: color }} />
        <div className="absolute -bottom-px -left-px w-3 h-3 border-l-2 border-b-2" style={{ borderColor: color }} />
        <div className="absolute -bottom-px -right-px w-3 h-3 border-r-2 border-b-2" style={{ borderColor: color }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}, ${color}60)`,
                boxShadow: `0 0 20px ${color}40`,
              }}
            />
            <div>
              <div className="text-[9px] font-mono text-white/40 tracking-widest mb-0.5">
                WAYPOINT {voyageData.companies.indexOf(company) + 1}
              </div>
              <h3 className="text-lg font-display" style={{ color }}>
                {company.name}
              </h3>
            </div>
          </div>

          {/* Log */}
          <div className="mb-4 p-3 bg-white/5 border border-white/10">
            <div className="text-[9px] font-mono text-white/40 mb-1.5">
              {company.period}
            </div>
            <p className="text-sm font-mono text-white/75 leading-relaxed italic">
              &ldquo;{company.log}&rdquo;
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 bg-white/5 border border-white/10">
              <div className="text-[8px] font-mono text-white/40 mb-0.5">ROLE</div>
              <div className="text-xs font-mono" style={{ color }}>{company.role}</div>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10">
              <div className="text-[8px] font-mono text-white/40 mb-0.5">DURATION</div>
              <div className="text-xs font-mono text-white/80">{company.duration}</div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {company.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[9px] font-mono"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                  color,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1.5">
              <span>TRANSIT</span>
              <span style={{ color }}>{Math.floor(companyProgress * 100)}%</span>
            </div>
            <div className="h-1 bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: `${companyProgress * 100}%` }}
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
