"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { cityData, sceneRanges } from "@/lib/city-data";
import type { CityCompany } from "@/lib/city-data";
import { useSceneProgress } from "../CityController";
import { ProceduralBuilding } from "../three/ProceduralBuilding";

// ==========================================
// DOWNTOWN SCENE - CORPORATE DISTRICT
// Flying through 4 company tower buildings
// Each building represents a career milestone
// ==========================================

interface DowntownSceneProps {
  scrollProgress: number;
}

export function DowntownScene({ scrollProgress }: DowntownSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.downtown.start,
    sceneRanges.downtown.end
  );

  const currentCompany = cityData.companies.find(
    (c) => scrollProgress >= c.scrollStart && scrollProgress < c.scrollEnd
  );

  if (!isActive) return null;

  // Only return 3D elements - no HTML here!
  return (
    <DowntownEnvironment progress={progress} currentCompany={currentCompany} />
  );
}

// Separate export for HTML overlay - used outside Canvas
export function DowntownOverlay({ scrollProgress }: { scrollProgress: number }) {
  const currentCompany = cityData.companies.find(
    (c) => scrollProgress >= c.scrollStart && scrollProgress < c.scrollEnd
  );

  return (
    <AnimatePresence>
      {currentCompany && (
        <CompanyInfoPanel company={currentCompany} scrollProgress={scrollProgress} />
      )}
    </AnimatePresence>
  );
}

// ==========================================
// DOWNTOWN ENVIRONMENT
// Camera flies through the corporate district
// ==========================================

interface DowntownEnvironmentProps {
  progress: number;
  currentCompany: CityCompany | null | undefined;
}

function DowntownEnvironment({ progress, currentCompany }: DowntownEnvironmentProps) {
  const { camera } = useThree();
  const sceneRef = useRef<THREE.Group>(null);

  // Building positions - arranged in a corridor
  const buildingPositions = useMemo(() => {
    return cityData.companies.map((company, index) => {
      const z = -50 - index * 80; // Buildings spaced along z-axis
      const x = index % 2 === 0 ? -25 : 25; // Alternating left/right
      return {
        company,
        position: [x, 0, z] as [number, number, number],
        height: 40 + index * 15, // Buildings get taller
      };
    });
  }, []);

  // Camera animation - fly through the corridor
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Camera moves forward based on progress
    const cameraZ = 30 - progress * 350;
    const cameraY = 25 + Math.sin(time * 0.3) * 2;
    const cameraX = Math.sin(time * 0.2) * 3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraY, 0.02);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.02);

    // Look forward with slight variation
    camera.lookAt(cameraX * 0.5, 15, cameraZ - 50);
  });

  return (
    <group ref={sceneRef}>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[50, 100, 50]} intensity={0.3} color="#e0e0ff" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -150]}>
        <planeGeometry args={[200, 500]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.9} />
      </mesh>

      {/* Road */}
      <Road />

      {/* Company buildings */}
      {buildingPositions.map(({ company, position, height }) => (
        <ProceduralBuilding
          key={company.id}
          position={position}
          height={height}
          width={20}
          depth={20}
          neonColor={company.neonColor}
          name={company.name}
          isActive={currentCompany?.id === company.id}
          buildingType={company.buildingType}
        />
      ))}

      {/* Background buildings */}
      <BackgroundBuildings />

      {/* Holographic billboards */}
      <Billboards />
    </group>
  );
}

// ==========================================
// ROAD
// Neon-lit street
// ==========================================

function Road() {
  return (
    <group position={[0, 0, -150]}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[30, 500]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[0.5, 500]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
      </mesh>

      {/* Edge lights */}
      {[-14, 14].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.1, 0]}>
          <planeGeometry args={[0.3, 500]} />
          <meshBasicMaterial color="#00fff5" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// BACKGROUND BUILDINGS
// Distant filler buildings
// ==========================================

function BackgroundBuildings() {
  const buildings = useMemo(() => {
    const result: Array<{
      position: [number, number, number];
      height: number;
      width: number;
    }> = [];

    // Left side background
    for (let i = 0; i < 15; i++) {
      result.push({
        position: [-60 - Math.random() * 40, 0, -50 - i * 30],
        height: 30 + Math.random() * 50,
        width: 10 + Math.random() * 15,
      });
    }

    // Right side background
    for (let i = 0; i < 15; i++) {
      result.push({
        position: [60 + Math.random() * 40, 0, -50 - i * 30],
        height: 30 + Math.random() * 50,
        width: 10 + Math.random() * 15,
      });
    }

    return result;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.position[0], b.height / 2, b.position[2]]}>
          <boxGeometry args={[b.width, b.height, b.width]} />
          <meshBasicMaterial color="#0f0f18" />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// BILLBOARDS
// Holographic advertising
// ==========================================

function Billboards() {
  return (
    <group>
      {[
        { position: [-40, 30, -100], rotation: [0, 0.3, 0] },
        { position: [45, 25, -180], rotation: [0, -0.3, 0] },
        { position: [-35, 35, -280], rotation: [0, 0.2, 0] },
      ].map((b, i) => (
        <mesh
          key={i}
          position={b.position as [number, number, number]}
          rotation={b.rotation as [number, number, number]}
        >
          <planeGeometry args={[20, 10]} />
          <meshBasicMaterial
            color={['#00fff5', '#ff00ff', '#ff6600'][i]}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// COMPANY INFO PANEL
// Cyberpunk-styled overlay
// ==========================================

interface CompanyInfoPanelProps {
  company: CityCompany;
  scrollProgress: number;
}

function CompanyInfoPanel({ company, scrollProgress }: CompanyInfoPanelProps) {
  const companyProgress =
    (scrollProgress - company.scrollStart) /
    (company.scrollEnd - company.scrollStart);

  // Find company index to determine building side
  const companyIndex = cityData.companies.indexOf(company);
  // Buildings alternate: even index = left side (x=-25), odd index = right side (x=25)
  // Panel should be on OPPOSITE side of the building
  const isOnLeft = companyIndex % 2 === 0; // Building is on left
  const panelOnRight = isOnLeft; // If building left, panel goes right

  return (
    <motion.div
      className={`fixed top-1/2 -translate-y-1/2 w-[340px] z-30 pointer-events-none ${
        panelOnRight ? 'right-6' : 'left-6'
      }`}
      initial={{ opacity: 0, x: panelOnRight ? 60 : -60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: panelOnRight ? 60 : -60, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,18,0.95) 0%, rgba(26,26,46,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${company.neonColor}40`,
          boxShadow: `0 0 40px ${company.neonColor}20`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${company.neonColor}, transparent)` }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${company.neonColor}40, ${company.neonColor}20)`,
                border: `1px solid ${company.neonColor}60`,
              }}
            >
              <span className="text-xl font-bold" style={{ color: company.neonColor }}>
                {company.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">
                TOWER {cityData.companies.indexOf(company) + 1}
              </div>
              <h3 className="text-lg font-bold" style={{ color: company.neonColor }}>
                {company.name}
              </h3>
            </div>
          </div>

          {/* Period */}
          <div
            className="inline-block px-3 py-1 rounded text-[10px] font-mono tracking-wider mb-3"
            style={{
              background: `${company.neonColor}15`,
              border: `1px solid ${company.neonColor}30`,
              color: company.neonColor,
            }}
          >
            {company.period}
          </div>

          {/* Log message */}
          <div className="p-3 rounded bg-white/5 border border-white/10 mb-4">
            <p className="text-sm text-white/70 italic leading-relaxed">
              &ldquo;{company.log}&rdquo;
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] font-mono text-white/30 mb-1">ROLE</div>
              <div className="text-xs font-medium" style={{ color: company.neonColor }}>
                {company.role}
              </div>
            </div>
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] font-mono text-white/30 mb-1">DURATION</div>
              <div className="text-xs font-medium text-white/80">{company.duration}</div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {company.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[10px] font-mono rounded"
                style={{
                  background: `${company.neonColor}15`,
                  border: `1px solid ${company.neonColor}30`,
                  color: `${company.neonColor}cc`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-1">
              <span className="text-white/30">TRANSIT</span>
              <span style={{ color: company.neonColor }}>{Math.floor(companyProgress * 100)}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${companyProgress * 100}%` }}
                style={{ backgroundColor: company.neonColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
