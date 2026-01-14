// ═══════════════════════════════════════════════════════════════════════════
// 📄 FILE: EarthScene.tsx
// 🎯 PURPOSE: Renders an interactive 3D Earth globe with a clickable location
//    marker (Indore, India). When clicked, the camera zooms to the marker and
//    displays origin info, then triggers the voyage to begin.
// 🔗 USED BY: src/app/journey/page.tsx (Scene 1 of the space voyage)
// ═══════════════════════════════════════════════════════════════════════════
//
// 📑 TABLE OF CONTENTS:
// ─────────────────────────────────────────────────────────────────────────────
//   Line ~55   │ latLngToVector3()      - Converts GPS coordinates to 3D point
//   Line ~75   │ EarthSphere            - 3D Earth with textures and marker
//   Line ~295  │ CameraController       - Handles zoom animation to Indore
//   Line ~380  │ LoadingEarth           - Wireframe fallback during load
//   Line ~395  │ SceneContent           - Wrapper to share refs between components
//   Line ~425  │ EarthScene (EXPORTED)  - Main component with Canvas and UI
// ═══════════════════════════════════════════════════════════════════════════

"use client";

// ═══════════════════════════════════════════════════════════════════════════
// 📦 EXTERNAL DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════
// - react: Core hooks for state, refs, memoization, effects, and Suspense
// - @react-three/fiber: React renderer for Three.js (Canvas, useFrame, useThree)
// - @react-three/drei: Helper components (useTexture, OrbitControls, Html, Stars)
// - three: 3D graphics library for geometries, materials, vectors, math
// ═══════════════════════════════════════════════════════════════════════════
import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// 📦 INTERNAL IMPORTS
// ═══════════════════════════════════════════════════════════════════════════

// 👇 voyageData - Portfolio content data object
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ WHAT IT DOES:                                                           │
// │   Contains all journey content: origin location, companies, projects    │
// │                                                                         │
// │ STRUCTURE:                                                              │
// │   voyageData.origin     - { city, country, education, coordinates }    │
// │   voyageData.companies  - Array of career milestone objects            │
// │   voyageData.projects   - Array of personal project objects            │
// │   voyageData.stats      - Summary statistics { years, companies, etc } │
// └─────────────────────────────────────────────────────────────────────────┘

// 👇 sceneRanges - Defines scroll progress boundaries for each scene
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ VALUES: earth(0-12), launch(12-22), career(22-62), wormhole(62-74),    │
// │         projects(74-94), destination(94-100)                           │
// └─────────────────────────────────────────────────────────────────────────┘
import { voyageData, sceneRanges } from "@/lib/voyage-data";

// 👇 useSceneProgress(scrollProgress, start, end) → { isActive, progress }
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ WHAT IT DOES:                                                           │
// │   Custom hook that computes if a scene is active and its local progress│
// │                                                                         │
// │ RETURNS: { isActive: boolean, progress: number (0-1) }                 │
// └─────────────────────────────────────────────────────────────────────────┘
import { useSceneProgress } from "../VoyageController";

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 COMPONENT OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
// This scene displays an interactive 3D Earth where users can:
// 1. See the Earth slowly rotating with realistic textures
// 2. Hover over Indore (India) to see location info
// 3. Click the marker to trigger a cinematic zoom
// 4. After zoom, education info appears and voyage begins automatically
// ═══════════════════════════════════════════════════════════════════════════

// 👇 INTERFACE: Props for the main EarthScene component
interface EarthSceneProps {
  scrollProgress: number;      // 💡 Current journey progress (0-100%)
  onVoyageStart?: () => void;  // 💡 Callback when user initiates the voyage
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTION: latLngToVector3
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Converts geographic coordinates (latitude/longitude) to a 3D position
//    on the surface of a sphere. Uses spherical coordinate math.
//
// 📐 MATH BREAKDOWN:
//    phi   = polar angle from north pole (0° at pole, 90° at equator)
//    theta = azimuthal angle around the sphere (longitude)
//
//    Spherical → Cartesian conversion formulas
// ═══════════════════════════════════════════════════════════════════════════
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  // 👇 Convert latitude to phi (angle from north pole)
  // At lat=90° (north pole), phi=0. At lat=0° (equator), phi=90°
  const phi = (90 - lat) * (Math.PI / 180);

  // 👇 Convert longitude to theta (angle around equator)
  // +180 shifts so lng=0° is at front of sphere
  const theta = (lng + 180) * (Math.PI / 180);

  // 👇 Spherical to Cartesian conversion
  const x = -(radius * Math.sin(phi) * Math.cos(theta));  // Negated for orientation
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);  // Y-axis points up (to north pole)

  return new THREE.Vector3(x, y, z);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📍 CONSTANTS: Geographic and sizing data
// ═══════════════════════════════════════════════════════════════════════════
const INDORE_LAT = 22.7196;   // 💡 Indore, India latitude (degrees North)
const INDORE_LNG = 75.8577;   // 💡 Indore, India longitude (degrees East)
const EARTH_RADIUS = 0.55;    // 💡 Size of Earth sphere in 3D units

// ═══════════════════════════════════════════════════════════════════════════
// 🌍 COMPONENT: EarthSphere
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Renders the 3D Earth globe with:
//    - Realistic day texture and cloud layer
//    - Interactive marker beacon at Indore location
//    - HTML labels that float in 3D space
//    - Continuous rotation animation (when not zooming)
// ═══════════════════════════════════════════════════════════════════════════
interface EarthSphereProps {
  onIndoreClick: () => void;                          // 💡 Called when marker clicked
  onIndoreHover: (hovered: boolean) => void;          // 💡 Called on hover state change
  isZooming: boolean;                                 // 💡 True during zoom animation
  showEducation: boolean;                             // 💡 True to show education popup
  earthGroupRef: React.RefObject<THREE.Group | null>; // 💡 Ref to Earth group for rotation
}

function EarthSphere({ onIndoreClick, onIndoreHover, isZooming, showEducation, earthGroupRef }: EarthSphereProps) {
  // 👇 Refs for animating specific mesh elements
  const cloudsRef = useRef<THREE.Mesh>(null);   // Cloud layer (rotates slower)
  const markerRef = useRef<THREE.Group>(null);  // Beacon marker (pulses)

  // 👇 Local state for hover visual feedback
  const [hovered, setHovered] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // 🖼️ TEXTURE LOADING
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 useTexture is a @react-three/drei hook that loads image textures
  //    Returns textures that can be applied to material's `map` property
  //    💡 Suspense boundary in parent shows LoadingEarth while loading
  const [earthMap, cloudsMap] = useTexture([
    "/textures/planets/earth_day.jpg",    // Daylight surface with continents
    "/textures/planets/earth_clouds.png", // Transparent cloud layer
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // 📍 MARKER POSITION CALCULATION
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 Convert Indore's GPS coordinates to 3D position
  //    +0.01 to radius lifts the marker slightly above surface
  const indorePosition = useMemo(
    () => latLngToVector3(INDORE_LAT, INDORE_LNG, EARTH_RADIUS + 0.01),
    [] // 💡 Empty deps = calculate once (coordinates never change)
  );

  // 👇 Calculate rotation to orient the marker "pin" outward from sphere center
  //    Without this, the marker would point in a fixed direction regardless of
  //    where on the sphere it's placed
  const pinRotation = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);          // Default "up" direction
    const direction = indorePosition.clone().normalize(); // Direction from center to marker

    // 👇 Create quaternion that rotates "up" to point toward marker direction
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    return [euler.x, euler.y, euler.z] as [number, number, number];
  }, [indorePosition]);

  // ─────────────────────────────────────────────────────────────────────────
  // 🎬 ANIMATION LOOP (runs every frame ~60fps)
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 useFrame runs every frame. Used for continuous animations.
  //    - state.clock.elapsedTime: Total time since scene started
  //    - delta: Time since last frame (for frame-rate independent animation)
  useFrame((state, delta) => {
    // 👇 Rotate Earth slowly when not in zoom mode
    if (!isZooming && !showEducation && earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.05;
    }

    // 👇 Clouds rotate slightly slower than Earth (differential rotation)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }

    // 👇 Pulsing scale animation for the beacon marker
    // Math.sin() creates smooth oscillation between -1 and 1
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      // 💡 When hovered, increase pulse amplitude by 50%
      markerRef.current.scale.setScalar(hovered ? scale * 1.5 : scale);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 🖱️ EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 Handle click on the marker - stopPropagation prevents click from
  //    bubbling to the Canvas (which might trigger OrbitControls)
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onIndoreClick();
  };

  // 👇 Handle hover state - updates local state AND notifies parent
  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    onIndoreHover(isHovered);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 🎨 RENDER: 3D JSX (React Three Fiber)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <group>
      {/* 👇 Outer group with ref - CameraController rotates this during zoom */}
      <group ref={earthGroupRef}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 🌍 EARTH SPHERE - Main planet mesh                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <mesh>
          {/* 👇 sphereGeometry(radius, widthSegments, heightSegments) */}
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          {/* 👇 meshStandardMaterial reacts to lights (PBR material)
              - map: The texture image
              - roughness: 0=mirror, 1=diffuse
              - emissive: Color the material self-emits (subtle blue glow) */}
          <meshStandardMaterial
            map={earthMap}
            roughness={0.5}
            metalness={0.1}
            emissive="#112244"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ☁️ CLOUD LAYER - Transparent overlay sphere                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <mesh ref={cloudsRef}>
          {/* 👇 Slightly larger radius so clouds float above surface */}
          <sphereGeometry args={[EARTH_RADIUS + 0.015, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent          // 💡 Enable alpha channel
            opacity={0.3}        // 💡 Partial transparency
            depthWrite={false}   // 💡 Prevents z-fighting with Earth below
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 📍 INDORE BEACON MARKER - Futuristic holographic style          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 👇 Marker group positioned at Indore, rotated to face outward */}
        <group ref={markerRef} position={indorePosition} rotation={pinRotation}>

          {/* 🔦 Vertical beam of light (thin cylinder) */}
          {/* Using refined colors: indigo (#6366f1) default, emerald (#10b981) on hover */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />
            <meshBasicMaterial
              color={hovered ? 0x10b981 : 0x6366f1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 🎯 INVISIBLE HIT AREA - Large clickable sphere for easy clicking when zoomed out */}
          <mesh
            position={[0, 0.1, 0]}
            onClick={handleClick}
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* 💎 Diamond crystal at top (visual only) */}
          <mesh position={[0, 0.13, 0]}>
            <octahedronGeometry args={[0.025, 0]} />
            <meshBasicMaterial color={hovered ? 0x10b981 : 0x6366f1} />
          </mesh>

          {/* ✨ Inner glow sphere around diamond */}
          <mesh position={[0, 0.13, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial
              color={hovered ? 0x10b981 : 0x6366f1}
              transparent
              opacity={0.35}
            />
          </mesh>

          {/* ⭕ Base ring on Earth's surface */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.02, 0.028, 32]} />
            <meshBasicMaterial
              color={hovered ? 0x10b981 : 0x6366f1}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* ⭕ Outer scanning ring (larger, more transparent) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.04, 0.048, 32]} />
            <meshBasicMaterial
              color={hovered ? 0x10b981 : 0x6366f1}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 🏷️ HTML Label - "INDORE" text floating in 3D space */}
          {/* 👇 Html component from @react-three/drei renders DOM elements in 3D */}
          <Html
            position={[0.12, 0.15, 0]}
            distanceFactor={1.5}
            occlude={false}
            zIndexRange={[100, 0]}
            style={{
              pointerEvents: "auto",
              transform: "translateX(10px)",
            }}
          >
            <div
              style={{
                color: hovered ? "#10b981" : "#6366f1",
                fontSize: "11px",
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                textShadow: `0 0 10px ${hovered ? "#10b981" : "#6366f1"}`,
                cursor: "pointer",
                userSelect: "none",
                padding: "6px 12px",
                background: "rgba(0,0,0,0.95)",
                border: `1px solid ${hovered ? "#10b981" : "#6366f1"}`,
                borderRadius: "4px",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)",
                boxShadow: `0 0 20px ${hovered ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.3)"}`,
                opacity: 1,
              }}
              onClick={() => onIndoreClick()}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >
              ◈ INDORE, INDIA
            </div>
          </Html>

          {/* 🎓 Education info popup - appears after zoom completes */}
          {showEducation && (
            <Html position={[0, 0.35, 0]} center>
              <div
                style={{
                  background: "rgba(0,0,0,0.95)",
                  border: "1px solid #6366f1",
                  padding: "20px 28px",
                  fontFamily: "monospace",
                  textAlign: "center",
                  animation: "fadeIn 0.5s ease-out",
                  boxShadow: "0 0 40px rgba(99,102,241,0.4)",
                  borderRadius: "4px",
                }}
              >
                <div style={{ color: "#6366f1", fontSize: "9px", letterSpacing: "3px", marginBottom: "10px" }}>
                  ORIGIN LOCKED
                </div>
                <div style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "6px" }}>
                  {voyageData.origin.city}, {voyageData.origin.country}
                </div>
                <div style={{ color: "#10b981", fontSize: "13px", marginBottom: "14px" }}>
                  🎓 {voyageData.origin.education}
                </div>
                <div style={{ display: "flex", gap: "20px", justifyContent: "center", fontSize: "10px" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>LAT </span>
                    <span style={{ color: "#6366f1" }}>{INDORE_LAT.toFixed(4)}°N</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>LNG </span>
                    <span style={{ color: "#6366f1" }}>{INDORE_LNG.toFixed(4)}°E</span>
                  </div>
                </div>
                <div style={{ color: "#f59e0b", fontSize: "11px", marginTop: "14px", animation: "pulse 1s infinite" }}>
                  LAUNCHING VOYAGE...
                </div>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎥 COMPONENT: CameraController
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Handles the cinematic zoom animation when user clicks on Indore
//
// 🔗 ANIMATION FLOW:
//    1. User clicks marker → isZooming becomes true
//    2. useEffect captures start positions
//    3. useFrame animates over ~2 seconds:
//       • Earth rotates so Indore faces camera
//       • Camera moves closer to Earth
//    4. onZoomComplete called → shows education popup
// ═══════════════════════════════════════════════════════════════════════════
interface CameraControllerProps {
  isZooming: boolean;
  onZoomComplete: () => void;
  earthGroupRef: React.RefObject<THREE.Group | null>;
}

function CameraController({ isZooming, onZoomComplete, earthGroupRef }: CameraControllerProps) {
  // 👇 useThree() gives access to the Three.js renderer state
  const { camera } = useThree();

  // 👇 Refs to store animation start/end values (not state - updated every frame)
  const startCameraPos = useRef(new THREE.Vector3());
  const targetCameraPos = useRef(new THREE.Vector3());
  const startEarthRotation = useRef(0);
  const targetEarthRotation = useRef(0);
  const progress = useRef(0);          // 💡 Animation progress 0→1
  const zoomStarted = useRef(false);   // 💡 Prevents re-initialization
  const zoomCompleted = useRef(false); // 💡 Prevents calling onComplete multiple times

  // 👇 Calculate Indore's position for rotation math
  const indoreSurfacePos = useMemo(
    () => latLngToVector3(INDORE_LAT, INDORE_LNG, EARTH_RADIUS),
    []
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 🎬 ZOOM INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 When isZooming becomes true, capture starting positions
  useEffect(() => {
    if (isZooming && !zoomStarted.current) {
      // 💡 Wait one frame for OrbitControls to be unmounted
      requestAnimationFrame(() => {
        if (earthGroupRef.current) {
          // Capture current positions
          startCameraPos.current.copy(camera.position);
          startEarthRotation.current = earthGroupRef.current.rotation.y;

          // 👇 Calculate Earth rotation needed to face Indore toward camera
          const indoreAngle = Math.atan2(indoreSurfacePos.x, indoreSurfacePos.z);
          targetEarthRotation.current = -indoreAngle;

          // 👇 Target camera position: gentle zoom to see Earth with Indore clearly
          // Camera starts at z=3, we zoom to z=1.8 (not too close)
          // This provides a nice view without going blank
          targetCameraPos.current.set(0, 0.15, 1.8);

          progress.current = 0;
          zoomStarted.current = true;
          zoomCompleted.current = false;
        }
      });
    }
  }, [isZooming, camera, indoreSurfacePos, earthGroupRef]);

  // ─────────────────────────────────────────────────────────────────────────
  // 🎬 ZOOM ANIMATION LOOP
  // ─────────────────────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (isZooming && zoomStarted.current && !zoomCompleted.current && earthGroupRef.current) {
      // 👇 Increment progress (delta * 0.5 ≈ 2 second duration)
      progress.current += delta * 0.5;
      const t = Math.min(progress.current, 1);

      // 👇 Ease-out cubic: 1 - (1-t)³ — starts fast, slows at end
      const eased = 1 - Math.pow(1 - t, 3);

      // 👇 Animate Earth rotation using lerp (linear interpolation)
      const currentRotation = THREE.MathUtils.lerp(
        startEarthRotation.current,
        targetEarthRotation.current,
        eased
      );
      earthGroupRef.current.rotation.y = currentRotation;

      // 👇 Animate camera position
      camera.position.lerpVectors(startCameraPos.current, targetCameraPos.current, eased);

      // 👇 Keep looking at Earth center
      camera.lookAt(0, 0, 0);

      // 👇 Trigger completion callback after animation ends
      if (t >= 1 && !zoomCompleted.current) {
        zoomCompleted.current = true;
        setTimeout(onZoomComplete, 1200);
      }
    }
  });

  // 💡 This component doesn't render anything - it only controls the camera
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// ⏳ COMPONENT: LoadingEarth
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Fallback shown while Earth textures load (wireframe sphere)
// ═══════════════════════════════════════════════════════════════════════════
function LoadingEarth() {
  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
      <meshBasicMaterial color={0x1a4a7a} wireframe />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎬 COMPONENT: SceneContent
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Wrapper that creates shared earthGroupRef for EarthSphere and CameraController
// 💡 WHY: Both components need to access the same Earth group reference
// ═══════════════════════════════════════════════════════════════════════════
interface SceneContentProps {
  isZooming: boolean;
  showEducation: boolean;
  onIndoreClick: () => void;
  onIndoreHover: (hovered: boolean) => void;
  onZoomComplete: () => void;
}

function SceneContent({
  isZooming,
  showEducation,
  onIndoreClick,
  onIndoreHover,
  onZoomComplete,
}: SceneContentProps) {
  // 👇 Create the shared ref here (inside Canvas context)
  const earthGroupRef = useRef<THREE.Group>(null);

  return (
    <>
      <EarthSphere
        onIndoreClick={onIndoreClick}
        onIndoreHover={onIndoreHover}
        isZooming={isZooming}
        showEducation={showEducation}
        earthGroupRef={earthGroupRef}
      />
      <CameraController
        isZooming={isZooming}
        onZoomComplete={onZoomComplete}
        earthGroupRef={earthGroupRef}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌍 COMPONENT: EarthScene (MAIN EXPORT)
// ═══════════════════════════════════════════════════════════════════════════
// 👇 Main component - orchestrates the entire Earth scene
//
// 🔗 COMPONENT HIERARCHY:
//    EarthScene
//    ├─ Canvas (React Three Fiber)
//    │   ├─ Lights (ambient, directional, point)
//    │   ├─ Stars (background starfield)
//    │   ├─ Suspense → SceneContent
//    │   │   ├─ EarthSphere (3D Earth + marker)
//    │   │   └─ CameraController (zoom animation)
//    │   └─ OrbitControls (when not zooming)
//    ├─ Hover Info Panel (HTML overlay)
//    └─ Zoom Vignette Effect
// ═══════════════════════════════════════════════════════════════════════════
export function EarthScene({ scrollProgress, onVoyageStart }: EarthSceneProps) {
  // ─────────────────────────────────────────────────────────────────────────
  // 📊 LOCAL STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [isZooming, setIsZooming] = useState(false);         // Zoom animation active
  const [showEducation, setShowEducation] = useState(false); // Education popup visible
  const [isHoveringIndore, setIsHoveringIndore] = useState(false); // Marker hover state
  const [voyageTriggered, setVoyageTriggered] = useState(false);   // Prevents double-trigger

  // ─────────────────────────────────────────────────────────────────────────
  // 🎯 SCENE ACTIVATION CHECK
  // ─────────────────────────────────────────────────────────────────────────
  // 👇 Determines if this scene is visible (Earth scene: 0% to 12%)
  const { isActive, progress } = useSceneProgress(
    scrollProgress,
    sceneRanges.earth.start,  // 0
    sceneRanges.earth.end     // 12
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 🖱️ EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const handleIndoreClick = () => {
    if (!isZooming && !voyageTriggered) {
      setIsZooming(true);
    }
  };

  const handleZoomComplete = () => {
    setShowEducation(true);
    setTimeout(() => {
      setVoyageTriggered(true);
      onVoyageStart?.();
    }, 1000);
  };

  // 👇 Fade out as scene exits (transition to Launch scene)
  const sceneOpacity = 1 - progress * 0.5;

  // 👇 Don't render if scene is not active
  if (!isActive) return null;

  return (
    <div className="absolute inset-0" style={{ opacity: sceneOpacity }}>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎬 THREE.JS CANVAS - The 3D rendering context                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* 💡 LIGHTING SETUP */}
        <ambientLight intensity={0.6} />                              {/* Base fill */}
        <directionalLight position={[2, 1, 5]} intensity={2} />       {/* Main sun */}
        <directionalLight position={[-3, 0, -2]} intensity={0.5} color="#4ca6ff" /> {/* Rim */}
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#ffffff" />        {/* Fill */}

        {/* ✨ STARS BACKGROUND */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        {/* 🌍 SCENE CONTENT (with Suspense for texture loading) */}
        <Suspense fallback={<LoadingEarth />}>
          <SceneContent
            isZooming={isZooming}
            showEducation={showEducation}
            onIndoreClick={handleIndoreClick}
            onIndoreHover={setIsHoveringIndore}
            onZoomComplete={handleZoomComplete}
          />
        </Suspense>

        {/* 🎮 ORBIT CONTROLS - User can rotate view (disabled during zoom) */}
        {!isZooming && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate
            autoRotateSpeed={0.3}
          />
        )}
      </Canvas>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 HOVER INFO PANEL - HTML overlay showing location details         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isHoveringIndore && !isZooming && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none animate-in fade-in duration-200">
          <div className="border border-indigo-500/50 bg-black/90 backdrop-blur-md px-6 py-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-indigo-400 tracking-widest">
                ORIGIN_COORDINATES
              </span>
            </div>
            <h2 className="text-xl font-display text-white mb-1">
              <span className="text-indigo-400">{voyageData.origin.city}</span>, {voyageData.origin.country}
            </h2>
            <div className="flex gap-6 text-xs font-mono text-white/60 mb-2">
              <span>LAT: <span className="text-indigo-400">{INDORE_LAT.toFixed(4)}°N</span></span>
              <span>LNG: <span className="text-indigo-400">{INDORE_LNG.toFixed(4)}°E</span></span>
            </div>
            <div className="text-xs font-mono text-amber-500 mt-2">
              CLICK TO BEGIN VOYAGE →
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌑 ZOOM VIGNETTE - Darkens edges during zoom animation              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isZooming && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      )}

      {/* 🎨 CSS KEYFRAME ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 ALTERNATIVES & NOTES
// ═══════════════════════════════════════════════════════════════════════════
// @react-three/fiber:
//   • Three.js vanilla: More control, more boilerplate
//   • Babylon.js: Another 3D engine, different ecosystem
//
// Texture approach:
//   • Current: Static JPG textures loaded at runtime
//   • Alternative: Procedural textures (shader-based)
//   • Alternative: NASA Blue Marble tiles for higher resolution
//
// Camera animation:
//   • Current: Manual interpolation in useFrame
//   • Alternative: @react-spring/three for declarative animations
// ═══════════════════════════════════════════════════════════════════════════
