"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneRanges } from "@/lib/city-data";
import { useSceneProgress } from "../CityController";

// ==========================================
// HOME WORKSPACE SCENE
// You at your laptop, working from home
// Coffee, books, and a window view ahead
// The journey begins here
// ==========================================

interface RooftopSceneProps {
  scrollProgress: number;
  onJourneyStart?: () => void;
}

export function RooftopScene({ scrollProgress, onJourneyStart }: RooftopSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.rooftop.start,
    sceneRanges.rooftop.end
  );

  if (!isActive) return null;

  return (
    <group>
      {/* Camera controller */}
      <WorkspaceCamera progress={progress} />

      {/* The room */}
      <Room progress={progress} />

      {/* Your desk with laptop setup */}
      <WorkDesk progress={progress} />

      {/* You sitting at the desk */}
      <Developer progress={progress} />

      {/* The window in front - portal to the world */}
      <FrontWindow progress={progress} />

      {/* City view through window */}
      <CityView progress={progress} />

      {/* Atmospheric lighting */}
      <SceneLighting progress={progress} />
    </group>
  );
}

// ==========================================
// CAMERA - Behind you, looking at your back
// as you work, then moves out the window
// ==========================================

function WorkspaceCamera({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Start behind the developer, looking at their back as they work
    // Then camera moves forward, past them, toward the window, and out into the city
    const startZ = 8;    // Behind you
    const endZ = -60;    // Out in the city
    const startY = 4;    // Sitting height view
    const endY = 15;     // Rise up as we go out

    const targetZ = THREE.MathUtils.lerp(startZ, endZ, Math.pow(progress, 0.8));
    const targetY = THREE.MathUtils.lerp(startY, endY, Math.pow(progress, 0.5));

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.x = Math.sin(time * 0.15) * (0.5 + progress * 2);

    // Look at the window/desk initially, then at the city
    const lookZ = THREE.MathUtils.lerp(-5, -80, progress);
    const lookY = THREE.MathUtils.lerp(3, 10, progress);
    camera.lookAt(0, lookY, lookZ);
  });

  return null;
}

// ==========================================
// THE ROOM - Cozy workspace
// ==========================================

function Room({ progress }: { progress: number }) {
  const roomOpacity = Math.max(0, 1 - progress * 1.2);

  return (
    <group>
      {/* Floor - warm wood color */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#2a1f18" roughness={0.8} transparent opacity={roomOpacity} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-8, 4, 0]}>
        <boxGeometry args={[0.2, 8, 16]} />
        <meshStandardMaterial color="#1a1520" transparent opacity={roomOpacity} />
      </mesh>

      {/* Right wall */}
      <mesh position={[8, 4, 0]}>
        <boxGeometry args={[0.2, 8, 16]} />
        <meshStandardMaterial color="#1a1520" transparent opacity={roomOpacity} />
      </mesh>

      {/* Back wall (behind you) */}
      <mesh position={[0, 4, 8]}>
        <boxGeometry args={[16, 8, 0.2]} />
        <meshStandardMaterial color="#15121a" transparent opacity={roomOpacity} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[16, 0.2, 16]} />
        <meshStandardMaterial color="#0a0810" transparent opacity={roomOpacity * 0.7} />
      </mesh>

      {/* Rug under desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#3d2d4a" roughness={0.95} transparent opacity={roomOpacity} />
      </mesh>

      {/* Bookshelf on left wall */}
      <Bookshelf position={[-7.5, 0, 3]} progress={progress} />

      {/* Wall art / poster */}
      <WallArt position={[7.8, 4.5, 0]} progress={progress} />
    </group>
  );
}

// ==========================================
// BOOKSHELF
// ==========================================

function Bookshelf({ position, progress }: { position: [number, number, number]; progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  const books = useMemo(() => {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12", "#1abc9c", "#e91e63"];
    return Array.from({ length: 12 }, (_, i) => ({
      color: colors[i % colors.length],
      height: 0.8 + Math.random() * 0.4,
      width: 0.15 + Math.random() * 0.1,
      x: (i % 4) * 0.35 - 0.5,
      shelf: Math.floor(i / 4),
    }));
  }, []);

  return (
    <group position={position}>
      {/* Shelf frame */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.8, 5, 0.4]} />
        <meshStandardMaterial color="#2a1f15" transparent opacity={opacity} />
      </mesh>

      {/* Shelves */}
      {[1, 2.5, 4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <boxGeometry args={[1.6, 0.08, 0.35]} />
          <meshStandardMaterial color="#3a2a1f" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Books */}
      {books.map((book, i) => (
        <mesh key={i} position={[book.x, 1.2 + book.shelf * 1.5 + book.height / 2, 0.05]}>
          <boxGeometry args={[book.width, book.height, 0.25]} />
          <meshStandardMaterial color={book.color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// WALL ART
// ==========================================

function WallArt({ position, progress }: { position: [number, number, number]; progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={opacity} />
      </mesh>
      {/* Art (abstract city silhouette) */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshBasicMaterial color="#0a0a15" transparent opacity={opacity} />
      </mesh>
      {/* City silhouette shapes */}
      {[-0.6, -0.2, 0.1, 0.4, 0.7].map((x, i) => (
        <mesh key={i} position={[x, -0.3 + (0.2 + i * 0.1), 0.07]}>
          <boxGeometry args={[0.25, 0.4 + i * 0.2, 0.01]} />
          <meshBasicMaterial color="#00fff5" transparent opacity={opacity * 0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// WORK DESK - Laptop, coffee, books
// ==========================================

function WorkDesk({ progress }: { progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <group position={[0, 0, 0]}>
      {/* Desk surface */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[5, 0.12, 2.2]} />
        <meshStandardMaterial color="#3d2a1f" roughness={0.6} transparent opacity={opacity} />
      </mesh>

      {/* Desk legs */}
      {[
        [-2.2, 1.4, 0.8],
        [2.2, 1.4, 0.8],
        [-2.2, 1.4, -0.8],
        [2.2, 1.4, -0.8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 2.8, 0.15]} />
          <meshStandardMaterial color="#2a1a10" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Laptop */}
      <Laptop position={[0, 2.9, 0.2]} progress={progress} />

      {/* Coffee mug - to the right */}
      <CoffeeMug position={[1.8, 2.9, 0.5]} progress={progress} />

      {/* Books stack - to the left */}
      <BooksOnDesk position={[-1.8, 2.9, 0.3]} progress={progress} />

      {/* Small plant */}
      <SmallPlant position={[-2, 2.9, -0.6]} progress={progress} />

      {/* Notepad with pen */}
      <Notepad position={[1.5, 2.87, -0.4]} progress={progress} />
    </group>
  );
}

// ==========================================
// LAPTOP - The main tool
// ==========================================

function Laptop({ position, progress }: { position: [number, number, number]; progress: number }) {
  const screenRef = useRef<THREE.Mesh>(null);
  const opacity = Math.max(0, 1 - progress * 1.2);

  useFrame((state) => {
    if (screenRef.current) {
      // Screen glow pulse
      const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      (screenRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * pulse;
    }
  });

  return (
    <group position={position}>
      {/* Laptop base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.3} transparent opacity={opacity} />
      </mesh>

      {/* Keyboard area */}
      <mesh position={[0, 0.1, 0.1]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={opacity} />
      </mesh>

      {/* Keyboard keys (simplified) */}
      <KeyboardKeys progress={progress} />

      {/* Trackpad */}
      <mesh position={[0, 0.1, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshStandardMaterial color="#252525" transparent opacity={opacity} />
      </mesh>

      {/* Screen (tilted up) */}
      <group position={[0, 0.5, -0.45]} rotation={[-0.35, 0, 0]}>
        {/* Screen frame */}
        <mesh>
          <boxGeometry args={[1.4, 0.9, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} transparent opacity={opacity} />
        </mesh>

        {/* Display */}
        <mesh ref={screenRef} position={[0, 0, 0.025]}>
          <planeGeometry args={[1.25, 0.78]} />
          <meshBasicMaterial color="#1a1a2e" transparent opacity={opacity} />
        </mesh>

        {/* Code on screen */}
        <CodeLines progress={progress} />

        {/* Screen glow */}
        <pointLight position={[0, 0, 0.5]} color="#4488ff" intensity={1.5 * opacity} distance={4} />
      </group>
    </group>
  );
}

// ==========================================
// KEYBOARD KEYS
// ==========================================

function KeyboardKeys({ progress }: { progress: number }) {
  const keysRef = useRef<THREE.Group>(null);
  const opacity = Math.max(0, 1 - progress * 1.2);

  useFrame((state) => {
    if (keysRef.current) {
      // Simulate typing - random keys light up
      keysRef.current.children.forEach((key, i) => {
        if (key instanceof THREE.Mesh) {
          const isTyping = Math.sin(state.clock.elapsedTime * 15 + i * 2.5) > 0.85;
          (key.material as THREE.MeshBasicMaterial).color.setHex(isTyping ? 0x00fff5 : 0x333333);
        }
      });
    }
  });

  const keys = useMemo(() => {
    const result: [number, number][] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        result.push([col * 0.09 - 0.5, row * 0.12 - 0.15]);
      }
    }
    return result;
  }, []);

  return (
    <group ref={keysRef} position={[0, 0.11, 0.05]}>
      {keys.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 0.08]} />
          <meshBasicMaterial color="#333333" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// CODE LINES ON SCREEN
// ==========================================

function CodeLines({ progress }: { progress: number }) {
  const linesRef = useRef<THREE.Group>(null);
  const opacity = Math.max(0, 1 - progress * 1.2);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        if (line instanceof THREE.Mesh) {
          // Typing animation
          const typeProgress = (state.clock.elapsedTime * 0.5 + i * 0.3) % 3;
          const scale = Math.min(1, typeProgress);
          line.scale.x = scale;
        }
      });
    }
  });

  const lines = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      y: 0.28 - i * 0.065,
      width: 0.15 + Math.random() * 0.6,
      indent: Math.floor(Math.random() * 3) * 0.08,
      color: ["#61dafb", "#f7df1e", "#ff6b9d", "#98c379", "#c678dd"][i % 5],
    }));
  }, []);

  return (
    <group ref={linesRef} position={[-0.5, 0, 0.03]}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.indent + line.width / 2, line.y, 0]}>
          <planeGeometry args={[line.width, 0.04]} />
          <meshBasicMaterial color={line.color} transparent opacity={opacity * 0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// COFFEE MUG - Essential
// ==========================================

function CoffeeMug({ position, progress }: { position: [number, number, number]; progress: number }) {
  const steamRef = useRef<THREE.Points>(null);
  const opacity = Math.max(0, 1 - progress * 1.2);

  useFrame((state) => {
    if (steamRef.current) {
      const positions = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = positions.array as Float32Array;

      for (let i = 0; i < array.length / 3; i++) {
        const i3 = i * 3;
        array[i3 + 1] += 0.015; // Rise
        array[i3] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002; // Sway

        if (array[i3 + 1] > 0.8) {
          array[i3 + 1] = 0;
          array[i3] = (Math.random() - 0.5) * 0.15;
          array[i3 + 2] = (Math.random() - 0.5) * 0.15;
        }
      }
      positions.needsUpdate = true;
    }
  });

  const steamGeometry = useMemo(() => {
    const positions = new Float32Array(15 * 3);
    for (let i = 0; i < 15; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 1] = Math.random() * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  return (
    <group position={position}>
      {/* Mug body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.28, 16]} />
        <meshStandardMaterial color="#e8e0d5" roughness={0.4} transparent opacity={opacity} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.16, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#e8e0d5" transparent opacity={opacity} />
      </mesh>

      {/* Coffee inside */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshBasicMaterial color="#3d2515" transparent opacity={opacity} />
      </mesh>

      {/* Steam */}
      <points ref={steamRef} geometry={steamGeometry} position={[0, 0.28, 0]}>
        <pointsMaterial size={0.04} color="#ffffff" transparent opacity={opacity * 0.4} />
      </points>
    </group>
  );
}

// ==========================================
// BOOKS ON DESK
// ==========================================

function BooksOnDesk({ position, progress }: { position: [number, number, number]; progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  const books = [
    { color: "#e74c3c", h: 0.12, title: "JS" },
    { color: "#3498db", h: 0.15, title: "React" },
    { color: "#2ecc71", h: 0.1, title: "Node" },
  ];

  let yOffset = 0;

  return (
    <group position={position}>
      {books.map((book, i) => {
        const y = yOffset + book.h / 2;
        yOffset += book.h;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0.1 * i, 0]}>
            <boxGeometry args={[0.6, book.h, 0.4]} />
            <meshStandardMaterial color={book.color} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}

// ==========================================
// SMALL PLANT
// ==========================================

function SmallPlant({ position, progress }: { position: [number, number, number]; progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#d4a373" transparent opacity={opacity} />
      </mesh>

      {/* Plant stem and leaves */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 6]} />
        <meshStandardMaterial color="#2d5a27" transparent opacity={opacity} />
      </mesh>

      {/* Leaves */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.06,
            0.25 + i * 0.03,
            Math.sin((i / 4) * Math.PI * 2) * 0.06,
          ]}
          rotation={[0.4, (i / 4) * Math.PI * 2, 0.3]}
        >
          <sphereGeometry args={[0.05, 6, 4, 0, Math.PI]} />
          <meshStandardMaterial color="#3a8a32" transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// NOTEPAD
// ==========================================

function Notepad({ position, progress }: { position: [number, number, number]; progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <group position={position}>
      {/* Notepad */}
      <mesh rotation={[-Math.PI / 2, 0, 0.2]}>
        <boxGeometry args={[0.4, 0.5, 0.02]} />
        <meshStandardMaterial color="#fffef0" transparent opacity={opacity} />
      </mesh>

      {/* Lines on notepad */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.05, 0.012, -0.15 + i * 0.08]} rotation={[-Math.PI / 2, 0, 0.2]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshBasicMaterial color="#ccc" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Pen */}
      <mesh position={[0.25, 0.03, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        <meshStandardMaterial color="#1a1a4a" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// ==========================================
// DEVELOPER - You at work
// ==========================================

function Developer({ progress }: { progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.5);

  return (
    <group position={[0, 0, 3]}>
      {/* Chair */}
      <Chair progress={progress} />

      {/* Body (simplified sitting figure) */}
      <group position={[0, 2.5, 0]}>
        {/* Torso */}
        <mesh position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.3, 0.5, 4, 8]} />
          <meshStandardMaterial color="#2c3e50" transparent opacity={opacity} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#deb887" transparent opacity={opacity} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2c1810" transparent opacity={opacity} />
        </mesh>

        {/* Arms reaching toward laptop */}
        {[-0.35, 0.35].map((x, i) => (
          <group key={i} position={[x, 0.15, 0]}>
            {/* Upper arm */}
            <mesh position={[0, -0.15, -0.15]} rotation={[0.8, 0, x > 0 ? 0.3 : -0.3]}>
              <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
              <meshStandardMaterial color="#2c3e50" transparent opacity={opacity} />
            </mesh>
            {/* Lower arm */}
            <mesh position={[x > 0 ? 0.1 : -0.1, -0.35, -0.45]} rotation={[1.2, 0, 0]}>
              <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
              <meshStandardMaterial color="#deb887" transparent opacity={opacity} />
            </mesh>
          </group>
        ))}

        {/* Legs (under desk) */}
        {[-0.15, 0.15].map((x, i) => (
          <mesh key={i} position={[x, -0.6, 0.2]} rotation={[1.5, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
            <meshStandardMaterial color="#34495e" transparent opacity={opacity} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==========================================
// CHAIR
// ==========================================

function Chair({ progress }: { progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.5);

  return (
    <group position={[0, 0, 0]}>
      {/* Seat */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={opacity} />
      </mesh>

      {/* Back */}
      <mesh position={[0, 2.6, 0.28]}>
        <boxGeometry args={[0.55, 0.8, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={opacity} />
      </mesh>

      {/* Chair base */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
        <meshStandardMaterial color="#333" transparent opacity={opacity} />
      </mesh>

      {/* Wheels base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.3, 0.1, Math.sin(angle) * 0.3]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#222" transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}

// ==========================================
// FRONT WINDOW - The portal to the world
// ==========================================

function FrontWindow({ progress }: { progress: number }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const frameOpacity = Math.max(0, 1 - progress * 1.5);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse + progress * 0.5;
    }
  });

  return (
    <group position={[0, 4, -8]}>
      {/* Window wall (with window cut out represented as dark) */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[16, 8, 0.2]} />
        <meshStandardMaterial color="#12101a" transparent opacity={frameOpacity} />
      </mesh>

      {/* Window frame */}
      <mesh>
        <boxGeometry args={[6, 5, 0.3]} />
        <meshStandardMaterial color="#2a2a3a" transparent opacity={frameOpacity} />
      </mesh>

      {/* Window glass - becomes transparent as we go through */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[5.5, 4.5]} />
        <meshBasicMaterial
          color="#0a0a18"
          transparent
          opacity={Math.max(0, 0.7 - progress * 1.2)}
        />
      </mesh>

      {/* City glow through window */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[5.5, 4.5]} />
        <meshBasicMaterial color="#00fff5" transparent opacity={0.2} />
      </mesh>

      {/* Window frame dividers */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.08, 4.5, 0.1]} />
        <meshStandardMaterial color="#3a3a4a" transparent opacity={frameOpacity} />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[5.5, 0.08, 0.1]} />
        <meshStandardMaterial color="#3a3a4a" transparent opacity={frameOpacity} />
      </mesh>

      {/* Curtains on sides */}
      {[-3.2, 3.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.15]}>
          <boxGeometry args={[0.8, 5.5, 0.05]} />
          <meshStandardMaterial color="#4a3a5a" transparent opacity={frameOpacity} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// CITY VIEW - The world beyond
// ==========================================

function CityView({ progress }: { progress: number }) {
  const cityOpacity = Math.min(1, progress * 1.5);

  const buildings = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      x: (Math.random() - 0.5) * 200,
      z: -30 - Math.random() * 150,
      height: 15 + Math.random() * 60,
      width: 8 + Math.random() * 15,
    }));
  }, []);

  if (cityOpacity <= 0.05) return null;

  return (
    <group position={[0, 0, -20]}>
      {/* Sky gradient */}
      <mesh position={[0, 30, -100]}>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial
          color="#0a0515"
          transparent
          opacity={cityOpacity * 0.8}
        />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.width]} />
          <meshBasicMaterial
            color={["#0c0c18", "#0a0a14", "#080812"][i % 3]}
            transparent
            opacity={cityOpacity}
          />
        </mesh>
      ))}

      {/* Building windows/lights */}
      <CityLights buildings={buildings} progress={progress} />

      {/* Neon signs */}
      <NeonSigns progress={progress} />

      {/* Distant glow */}
      <pointLight position={[0, 20, -80]} color="#ff00ff" intensity={5 * cityOpacity} distance={100} />
      <pointLight position={[-40, 30, -60]} color="#00fff5" intensity={3 * cityOpacity} distance={80} />
    </group>
  );
}

// ==========================================
// CITY LIGHTS
// ==========================================

function CityLights({
  buildings,
  progress,
}: {
  buildings: Array<{ x: number; z: number; height: number; width: number }>;
  progress: number;
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    buildings.forEach((b) => {
      const windowCount = Math.floor(b.height / 6);
      for (let w = 0; w < windowCount; w++) {
        if (Math.random() > 0.5) continue;
        positions.push(
          b.x + (Math.random() - 0.5) * b.width * 0.8,
          w * 5 + 4,
          b.z + b.width / 2 + 0.1
        );

        const c = Math.random();
        if (c > 0.7) colors.push(0, 1, 0.96);
        else if (c > 0.4) colors.push(1, 0.8, 0.3);
        else colors.push(1, 0, 1);
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, [buildings]);

  const opacity = Math.min(1, progress * 1.5);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={2.5} vertexColors transparent opacity={opacity} sizeAttenuation />
    </points>
  );
}

// ==========================================
// NEON SIGNS
// ==========================================

function NeonSigns({ progress }: { progress: number }) {
  const signsRef = useRef<THREE.Group>(null);
  const opacity = Math.min(1, progress * 1.5);

  useFrame((state) => {
    if (signsRef.current) {
      signsRef.current.children.forEach((sign, i) => {
        // Neon flicker
        const flicker = Math.sin(state.clock.elapsedTime * 5 + i * 3) > 0.9 ? 0.5 : 1;
        sign.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = opacity * flicker;
          }
        });
      });
    }
  });

  const signs = [
    { pos: [-50, 35, -70], color: "#ff00ff", size: [12, 4] },
    { pos: [60, 40, -90], color: "#00fff5", size: [15, 5] },
    { pos: [-30, 50, -110], color: "#ff6600", size: [10, 3] },
    { pos: [40, 30, -50], color: "#00ff88", size: [8, 3] },
  ];

  return (
    <group ref={signsRef}>
      {signs.map((sign, i) => (
        <group key={i} position={sign.pos as [number, number, number]}>
          <mesh>
            <planeGeometry args={sign.size as [number, number]} />
            <meshBasicMaterial color={sign.color} transparent opacity={opacity * 0.7} />
          </mesh>
          <pointLight color={sign.color} intensity={8 * opacity} distance={40} />
        </group>
      ))}
    </group>
  );
}

// ==========================================
// SCENE LIGHTING
// ==========================================

function SceneLighting({ progress }: { progress: number }) {
  const roomLight = Math.max(0, 1 - progress * 1.2);
  const cityLight = Math.min(1, progress * 1.5);

  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.08} />

      {/* Room lamp (warm) */}
      <pointLight
        position={[-6, 6, 4]}
        color="#ffcc88"
        intensity={0.8 * roomLight}
        distance={12}
      />

      {/* Laptop screen glow */}
      <pointLight
        position={[0, 3.5, 0]}
        color="#4488ff"
        intensity={1.2 * roomLight}
        distance={5}
      />

      {/* Window light from outside */}
      <pointLight
        position={[0, 4, -6]}
        color="#00fff5"
        intensity={2 * cityLight}
        distance={15}
      />

      {/* City ambient glow */}
      <pointLight
        position={[0, 15, -40]}
        color="#ff00ff"
        intensity={3 * cityLight}
        distance={60}
      />
    </>
  );
}
