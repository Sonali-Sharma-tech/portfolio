"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { cityData, sceneRanges } from "@/lib/city-data";
import type { CityProject } from "@/lib/city-data";
import { useSceneProgress } from "../CityController";

// ==========================================
// DISTRICT SCENE - FLOATING TERMINALS
// Clean, glowing terminal panels floating in 3D space
// Hacker aesthetic with typing animations
// ==========================================

// Code snippets for each project
const CODE_SNIPPETS = {
  matrix: {
    filename: "toolkit.ts",
    language: "typescript",
    lines: [
      { text: "import { DevToolkit } from '@/core'", type: "import" },
      { text: "import { createPlugin } from './plugin'", type: "import" },
      { text: "", type: "empty" },
      { text: "export function initialize() {", type: "keyword" },
      { text: "  const toolkit = new DevToolkit({", type: "code" },
      { text: "    plugins: [", type: "code" },
      { text: "      createPlugin('typescript'),", type: "string" },
      { text: "      createPlugin('eslint'),", type: "string" },
      { text: "      createPlugin('prettier')", type: "string" },
      { text: "    ],", type: "code" },
      { text: "    config: { strict: true }", type: "code" },
      { text: "  })", type: "code" },
      { text: "  return toolkit.run()", type: "keyword" },
      { text: "}", type: "keyword" },
    ],
  },
  neon: {
    filename: "theme.js",
    language: "javascript",
    lines: [
      { text: "// Colorful Extension", type: "comment" },
      { text: "const palette = {", type: "keyword" },
      { text: "  primary: '#ff00ff',", type: "string" },
      { text: "  accent: '#00fff5',", type: "string" },
      { text: "  warm: '#ff6600'", type: "string" },
      { text: "}", type: "code" },
      { text: "", type: "empty" },
      { text: "function applyTheme(editor) {", type: "keyword" },
      { text: "  const tokens = parseTokens(editor)", type: "code" },
      { text: "  tokens.forEach(token => {", type: "keyword" },
      { text: "    token.style = {", type: "code" },
      { text: "      color: palette[token.type],", type: "code" },
      { text: "      glow: true", type: "code" },
      { text: "    }", type: "code" },
      { text: "  })", type: "code" },
      { text: "}", type: "keyword" },
    ],
  },
  dark: {
    filename: "note.py",
    language: "python",
    lines: [
      { text: "# Black Note", type: "comment" },
      { text: "class Note:", type: "keyword" },
      { text: "    def __init__(self, content):", type: "keyword" },
      { text: "        self.content = content", type: "code" },
      { text: "        self.created = time.now()", type: "code" },
      { text: "        self.tags = []", type: "code" },
      { text: "", type: "empty" },
      { text: "    def add_tag(self, tag):", type: "keyword" },
      { text: "        self.tags.append(tag)", type: "code" },
      { text: "        return self", type: "keyword" },
      { text: "", type: "empty" },
      { text: "    def render(self):", type: "keyword" },
      { text: "        return self.content", type: "keyword" },
    ],
  },
};

interface DistrictSceneProps {
  scrollProgress: number;
}

export function DistrictScene({ scrollProgress }: DistrictSceneProps) {
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.districts.start,
    sceneRanges.districts.end
  );

  const currentProject = cityData.projects.find(
    (p) => scrollProgress >= p.scrollStart && scrollProgress < p.scrollEnd
  );

  if (!isActive) return null;

  return <FloatingTerminals progress={progress} currentProject={currentProject} />;
}

export function DistrictOverlay({ scrollProgress }: { scrollProgress: number }) {
  const currentProject = cityData.projects.find(
    (p) => scrollProgress >= p.scrollStart && scrollProgress < p.scrollEnd
  );

  return (
    <AnimatePresence>
      {currentProject && (
        <ProjectInfoPanel project={currentProject} scrollProgress={scrollProgress} />
      )}
    </AnimatePresence>
  );
}

// ==========================================
// FLOATING TERMINALS
// 3D positioned terminal windows
// ==========================================

function FloatingTerminals({
  progress,
  currentProject,
}: {
  progress: number;
  currentProject: CityProject | null | undefined;
}) {
  const { camera } = useThree();
  const currentDistrict = currentProject?.district || "matrix";

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Smooth camera glide through terminals
    const cameraZ = 12 - progress * 100;
    const cameraX = Math.sin(progress * Math.PI * 1.2) * 3;
    const cameraY = 2 + Math.sin(time * 0.1) * 0.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraY, 0.02);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.02);

    camera.lookAt(cameraX * 0.3, 2, cameraZ - 15);
  });

  return (
    <group>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 10, 50]} />

      {/* Ambient particles */}
      <FloatingParticles
        color={
          currentDistrict === "matrix"
            ? "#00ff88"
            : currentDistrict === "neon"
            ? "#ff00ff"
            : "#00fff5"
        }
      />

      {/* Main floating terminals */}
      <FloatingTerminal
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        snippet={CODE_SNIPPETS.matrix}
        color="#00ff88"
        isActive={currentDistrict === "matrix"}
        projectName="DevToolkit"
      />
      <FloatingTerminal
        position={[2, 2.5, -35]}
        rotation={[0, -0.1, 0]}
        snippet={CODE_SNIPPETS.neon}
        color="#ff00ff"
        isActive={currentDistrict === "neon"}
        projectName="Colorful"
      />
      <FloatingTerminal
        position={[-1, 1.8, -70]}
        rotation={[0, 0.1, 0]}
        snippet={CODE_SNIPPETS.dark}
        color="#00fff5"
        isActive={currentDistrict === "dark"}
        projectName="Black Note"
      />

      {/* Secondary floating code fragments */}
      <CodeGhost position={[-8, 4, -15]} color="#00ff88" scale={0.6} />
      <CodeGhost position={[10, 1, -25]} color="#00ff88" scale={0.5} />
      <CodeGhost position={[-10, 3, -50]} color="#ff00ff" scale={0.7} />
      <CodeGhost position={[12, 5, -60]} color="#ff00ff" scale={0.5} />
      <CodeGhost position={[-9, 2, -85]} color="#00fff5" scale={0.6} />
      <CodeGhost position={[11, 4, -75]} color="#00fff5" scale={0.4} />
    </group>
  );
}

// ==========================================
// FLOATING TERMINAL
// Single terminal with HTML content
// ==========================================

interface CodeSnippet {
  filename: string;
  language: string;
  lines: { text: string; type: string }[];
}

function FloatingTerminal({
  position,
  rotation,
  snippet,
  color,
  isActive,
  projectName,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  snippet: CodeSnippet;
  color: string;
  isActive: boolean;
  projectName: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  // Typing animation - reveal lines one by one when active
  useEffect(() => {
    if (isActive) {
      setVisibleLines(0);
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= snippet.lines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 80);
      return () => clearInterval(interval);
    } else {
      setVisibleLines(snippet.lines.length); // Show all when not active
    }
  }, [isActive, snippet.lines.length]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle floating motion
    const time = state.clock.elapsedTime;
    groupRef.current.position.y =
      position[1] + Math.sin(time * 0.3 + position[0]) * 0.15;
    groupRef.current.rotation.y =
      rotation[1] + Math.sin(time * 0.2) * 0.02;
  });

  const opacity = isActive ? 1 : 0.25;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Glow plane behind terminal */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.08 : 0.02}
        />
      </mesh>

      {/* HTML Terminal */}
      <Html
        transform
        occlude={false}
        style={{
          width: "320px",
          opacity,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        <div
          className="terminal-window"
          style={{
            background: "rgba(10, 10, 15, 0.95)",
            border: `1px solid ${color}40`,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: isActive
              ? `0 0 30px ${color}30, 0 0 60px ${color}15, inset 0 0 20px ${color}05`
              : `0 0 10px ${color}10`,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              background: "rgba(0, 0, 0, 0.5)",
              borderBottom: `1px solid ${color}20`,
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: "6px", marginRight: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ffbd2e",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
            </div>
            {/* Filename */}
            <span
              style={{
                fontSize: "11px",
                color: `${color}90`,
                letterSpacing: "0.5px",
              }}
            >
              {snippet.filename}
            </span>
            {/* Project badge */}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "9px",
                color: color,
                padding: "2px 6px",
                background: `${color}15`,
                borderRadius: "4px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {projectName}
            </span>
          </div>

          {/* Code content */}
          <div
            style={{
              padding: "12px 16px",
              fontSize: "11px",
              lineHeight: "1.6",
              minHeight: "200px",
            }}
          >
            {snippet.lines.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  opacity: line.type === "empty" ? 0 : 1,
                  height: line.type === "empty" ? "8px" : "auto",
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    color: `${color}40`,
                    marginRight: "16px",
                    minWidth: "20px",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
                {/* Code */}
                <span
                  style={{
                    color: getLineColor(line.type, color),
                    textShadow:
                      line.type === "keyword" || line.type === "string"
                        ? `0 0 8px ${color}50`
                        : "none",
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
            {/* Blinking cursor */}
            {isActive && visibleLines < snippet.lines.length && (
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "14px",
                  background: color,
                  marginLeft: "36px",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </div>

          {/* Terminal footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 12px",
              background: "rgba(0, 0, 0, 0.3)",
              borderTop: `1px solid ${color}15`,
              fontSize: "9px",
              color: `${color}60`,
            }}
          >
            <span>{snippet.language}</span>
            <span style={{ marginLeft: "auto" }}>
              {snippet.lines.length} lines
            </span>
          </div>
        </div>

        {/* CSS for cursor blink */}
        <style>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}</style>
      </Html>

      {/* Point light for glow */}
      {isActive && (
        <pointLight position={[0, 0, 2]} color={color} intensity={1.5} distance={15} />
      )}
    </group>
  );
}

// Get color based on code type
function getLineColor(type: string, baseColor: string): string {
  switch (type) {
    case "comment":
      return "#6a6a7a";
    case "keyword":
      return baseColor;
    case "import":
      return "#ff79c6";
    case "string":
      return "#f1fa8c";
    case "empty":
      return "transparent";
    default:
      return "#e0e0e8";
  }
}

// ==========================================
// CODE GHOST
// Distant floating code representation
// ==========================================

function CodeGhost({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const lineWidths = useMemo(
    () => Array.from({ length: 6 }, () => 1 + Math.random() * 3),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.15 + position[0]) * 0.3;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {lineWidths.map((width, i) => (
        <mesh key={i} position={[width / 2 - 2, -i * 0.35, 0]}>
          <planeGeometry args={[width, 0.1]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// FLOATING PARTICLES
// Ambient atmosphere
// ==========================================

function FloatingParticles({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.3} />
    </points>
  );
}

// ==========================================
// PROJECT INFO PANEL
// ==========================================

function ProjectInfoPanel({
  project,
  scrollProgress,
}: {
  project: CityProject;
  scrollProgress: number;
}) {
  const projectProgress =
    (scrollProgress - project.scrollStart) / (project.scrollEnd - project.scrollStart);

  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 w-[280px] z-30 pointer-events-none"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative"
        style={{
          background: "rgba(10, 10, 15, 0.9)",
          borderLeft: `2px solid ${project.neonColor}`,
          boxShadow: `0 0 20px ${project.neonColor}20`,
        }}
      >
        <div className="p-5">
          {/* Project name */}
          <h3
            className="text-lg font-mono font-bold mb-2"
            style={{
              color: project.neonColor,
              textShadow: `0 0 10px ${project.neonColor}50`,
            }}
          >
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-white/50 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[9px] font-mono rounded"
                style={{
                  color: project.neonColor,
                  background: `${project.neonColor}15`,
                  border: `1px solid ${project.neonColor}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* GitHub link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono pointer-events-auto hover:opacity-70 transition-opacity"
            style={{ color: project.neonColor }}
          >
            → View Source
          </a>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${projectProgress * 100}%` }}
              style={{ backgroundColor: project.neonColor }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
