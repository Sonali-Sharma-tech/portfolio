"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { sceneRanges } from "@/lib/city-data";
import { useSceneProgress } from "../CityController";

// ==========================================
// DATA PORTAL SCENE - TRANSITION TUNNEL
// Flying through a hexagonal data stream
// Marks the shift from employee to creator
// ==========================================

interface DataPortalSceneProps {
  scrollProgress: number;
}

export function DataPortalScene({ scrollProgress }: DataPortalSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.portal.start,
    sceneRanges.portal.end
  );

  if (!isActive) return null;

  return (
    <>
      <DataTunnel progress={progress} />

      {/* Transition text overlay */}
      <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-center">
          {progress < 0.4 && (
            <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse mb-4">
              INITIATING DATA STREAM
            </div>
          )}
          {progress >= 0.4 && progress < 0.6 && (
            <div
              className="text-3xl font-bold tracking-wider mb-2"
              style={{
                background: 'linear-gradient(90deg, #00fff5, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CORPORATE → CREATOR
            </div>
          )}
          {progress >= 0.6 && (
            <div className="text-green-400 font-mono text-sm tracking-widest animate-pulse">
              ENTERING PROJECT ZONE
            </div>
          )}
        </div>
      </Html>
    </>
  );
}

// ==========================================
// DATA TUNNEL
// Hexagonal tunnel with flowing data
// ==========================================

function DataTunnel({ progress }: { progress: number }) {
  const { camera } = useThree();
  const tunnelRef = useRef<THREE.Group>(null);

  // Color transition based on progress
  const currentColor = useMemo(() => {
    if (progress < 0.33) {
      return new THREE.Color('#00fff5'); // Cyan
    } else if (progress < 0.66) {
      return new THREE.Color('#ff00ff'); // Magenta
    } else {
      return new THREE.Color('#00ff88'); // Green
    }
  }, [progress]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Camera moves through tunnel
    const cameraZ = 50 - progress * 150;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.03);
    camera.position.y = Math.sin(time * 0.5) * 2;
    camera.position.x = Math.cos(time * 0.3) * 2;

    camera.lookAt(0, 0, cameraZ - 30);

    // Rotate tunnel slightly
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={tunnelRef}>
      {/* Background */}
      <color attach="background" args={['#050510']} />

      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* Tunnel rings */}
      <TunnelRings progress={progress} color={currentColor} />

      {/* Flowing data particles */}
      <DataParticles progress={progress} color={currentColor} />

      {/* Central glow */}
      <pointLight position={[0, 0, -50]} color={currentColor} intensity={3} distance={100} />
    </group>
  );
}

// ==========================================
// TUNNEL RINGS
// Hexagonal ring shapes
// ==========================================

function TunnelRings({ progress, color }: { progress: number; color: THREE.Color }) {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      // Rotate rings
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      z: -i * 10 - 10,
      scale: 1 + (i * 0.05),
      opacity: 1 - (i * 0.04),
    }));
  }, []);

  return (
    <group ref={ringsRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} scale={ring.scale}>
          <torusGeometry args={[15, 0.2, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={ring.opacity * 0.5}
          />
        </mesh>
      ))}

      {/* Inner hexagon wireframes */}
      {rings.filter((_, i) => i % 3 === 0).map((ring, i) => (
        <mesh key={`inner-${i}`} position={[0, 0, ring.z]} scale={ring.scale * 0.7}>
          <torusGeometry args={[10, 0.1, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={ring.opacity * 0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// DATA PARTICLES
// Flowing through the tunnel
// ==========================================

function DataParticles({ progress, color }: { progress: number; color: THREE.Color }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities] = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = Math.random() * 200 - 100;

      velocities[i] = 0.5 + Math.random() * 2;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return [geom, velocities];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;

    for (let i = 0; i < array.length / 3; i++) {
      const i3 = i * 3;

      // Move particles forward
      array[i3 + 2] += velocities[i];

      // Reset when too far
      if (array[i3 + 2] > 50) {
        array[i3 + 2] = -150;
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 10;
        array[i3] = Math.cos(angle) * radius;
        array[i3 + 1] = Math.sin(angle) * radius;
      }
    }

    positions.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.3}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
