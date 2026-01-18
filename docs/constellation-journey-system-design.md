# Constellation Journey - System Design Document

## Table of Contents
1. [Overview](#overview)
2. [High-Level Design (HLD)](#high-level-design-hld)
3. [Low-Level Design (LLD)](#low-level-design-lld)
4. [Data Structures](#data-structures)
5. [State Management](#state-management)
6. [Component Architecture](#component-architecture)
7. [Rendering Pipeline](#rendering-pipeline)
8. [Audio System](#audio-system)
9. [Performance Considerations](#performance-considerations)

---

## Overview

### Purpose
An interactive 3D star-charting experience where users navigate through a constellation representing career milestones. Each star represents a company or project, and constellation lines connect them to form a meaningful pattern.

### Key Features
- Keyboard-controlled navigation (WASD/Arrow keys)
- 3D WebGL rendering with Three.js/React Three Fiber
- Progressive constellation line illumination
- Contextual information cards
- Ambient audio with star activation sounds
- Responsive camera system

---

## High-Level Design (HLD)

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                        │   │
│  │                    /journey route                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              ConstellationController                         │   │
│  │         (State Management & Input Handling)                  │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │   Keyboard   │  │    State     │  │   Motion     │       │   │
│  │  │   Handler    │──│   Manager    │──│   Values     │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│          ┌──────────────────┼──────────────────┐                   │
│          ▼                  ▼                  ▼                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │ Constellation │  │  StarInfo     │  │ Constellation │          │
│  │    Canvas     │  │    Card       │  │     HUD       │          │
│  │   (WebGL)     │  │   (HTML)      │  │   (HTML)      │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
│          │                                     │                   │
│          ▼                                     │                   │
│  ┌───────────────────────────────────┐        │                   │
│  │     React Three Fiber Canvas      │        │                   │
│  │  ┌─────────┐  ┌─────────────────┐ │        │                   │
│  │  │  Stars  │  │ Constellation   │ │        │                   │
│  │  │         │  │     Lines       │ │        │                   │
│  │  └─────────┘  └─────────────────┘ │        │                   │
│  │  ┌─────────┐  ┌─────────────────┐ │        │                   │
│  │  │ Camera  │  │   Particles     │ │        │                   │
│  │  │Controller│ │  (Cosmic Dust)  │ │        │                   │
│  │  └─────────┘  └─────────────────┘ │        │                   │
│  └───────────────────────────────────┘        │                   │
│          │                                     │                   │
│          ▼                                     ▼                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   ConstellationAudio                         │   │
│  │              (Web Audio API Controller)                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Data Layer                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     voyage-data.ts                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │ Constellation│ │  Companies  │  │      Projects       │   │  │
│  │  │   Layout    │  │    Data     │  │        Data         │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │ Connections │  │   Scene     │  │  Helper Functions   │   │  │
│  │  │   Graph     │  │   Ranges    │  │                     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Keyboard   │────▶│    State     │────▶│   Derived    │
│    Input     │     │   Updates    │     │    State     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            ▼                     ▼
                     ┌──────────────┐     ┌──────────────┐
                     │   Progress   │     │   Active     │
                     │   (0-100%)   │     │    Star      │
                     └──────────────┘     └──────────────┘
                            │                     │
          ┌─────────────────┼─────────────────────┤
          ▼                 ▼                     ▼
   ┌──────────────┐  ┌──────────────┐     ┌──────────────┐
   │    Camera    │  │ Illuminated  │     │   Info Card  │
   │   Position   │  │    Stars     │     │   Content    │
   └──────────────┘  └──────────────┘     └──────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
   ┌──────────────┐  ┌──────────────┐     ┌──────────────┐
   │   3D Scene   │  │ Constellation│     │     UI       │
   │   Render     │  │    Lines     │     │   Render     │
   └──────────────┘  └──────────────┘     └──────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 | App routing, SSR/CSR |
| UI Library | React 19 | Component architecture |
| 3D Rendering | Three.js + R3F | WebGL abstraction |
| Animation | Framer Motion | HTML animations |
| State | React useState/useRef | Local state management |
| Audio | Web Audio API | Procedural audio |
| Styling | Tailwind CSS | Utility-first CSS |

---

## Low-Level Design (LLD)

### Module Breakdown

```
src/
├── app/journey/
│   └── page.tsx                 # Route entry point
│
├── components/constellation/
│   ├── index.ts                 # Barrel exports
│   ├── ConstellationController.tsx
│   ├── ConstellationCanvas.tsx
│   ├── ConstellationHUD.tsx
│   ├── StarInfoCard.tsx
│   │
│   ├── three/
│   │   ├── Star.tsx             # 3D star component
│   │   └── ConstellationLine.tsx # Connection lines
│   │
│   ├── effects/
│   │   └── (future: particles, shaders)
│   │
│   └── audio/
│       └── ConstellationAudio.tsx
│
└── lib/
    └── voyage-data.ts           # Data & helpers
```

### Component Specifications

#### 1. ConstellationController

```typescript
/**
 * Purpose: Central state manager and input handler
 * Pattern: Render Props (children as function)
 *
 * Responsibilities:
 * - Capture keyboard input (keydown/keyup)
 * - Calculate movement based on input
 * - Manage progress state (0-100)
 * - Compute derived state (scene, active star, illuminated stars)
 * - Pass state to children via render prop
 */

interface ConstellationState {
  progress: number;           // 0-100, journey completion
  currentScene: string;       // 'intro' | 'origin' | 'career' | 'warp' | 'projects' | 'reveal'
  activeStar: StarPosition | null;
  illuminatedStars: string[]; // IDs of visited stars
  lateralOffset: number;      // -1 to 1, strafe position
  cameraRoll: number;         // degrees, camera tilt
  isMoving: boolean;
  isBoosting: boolean;
  progressMotion: MotionValue<number>;
}

// Input Processing Pipeline
KeyboardEvent → keysPressed Set → Animation Frame Loop → State Updates
```

#### 2. ConstellationCanvas

```typescript
/**
 * Purpose: 3D scene renderer
 * Pattern: Composition with R3F primitives
 *
 * Responsibilities:
 * - Initialize WebGL canvas
 * - Manage camera position/orientation
 * - Render all 3D objects
 * - Handle performance monitoring
 */

// Camera Position Calculation
f(progress, scene, lateralOffset) → Vector3 position

// Scene Composition
Canvas
├── CameraController (useFrame hook)
├── ambientLight
├── Stars (drei background)
├── CosmicDust (custom particles)
├── AllConstellationLines
├── Star (for each in constellationLayout)
└── gridHelper (intro scene only)
```

#### 3. Star Component

```typescript
/**
 * Purpose: Individual star rendering
 * Pattern: Declarative 3D component
 *
 * Visual States:
 * - Default: dim, small
 * - Illuminated: bright, glowing
 * - Active: pulsing, lens flare, point light
 */

// Star Composition
<group>
  <mesh>                    // Core sphere
    <sphereGeometry />
    <meshBasicMaterial />
  </mesh>

  {isIlluminated && (
    <mesh>                  // Inner glow
      <sphereGeometry />
      <meshBasicMaterial blending={AdditiveBlending} />
    </mesh>
  )}

  {isActive && (
    <>
      <mesh />              // Outer glow
      <pointLight />        // Dynamic lighting
      <mesh />              // Lens flare X
      <mesh />              // Lens flare Y
    </>
  )}
</group>
```

#### 4. ConstellationLine

```typescript
/**
 * Purpose: Connect two stars with animated line
 * Pattern: Imperative Three.js wrapped in React
 *
 * Animation: Draw range animation for "drawing" effect
 */

// Line Creation (useMemo)
fromPosition → toPosition → interpolate 20 segments → BufferGeometry

// Animation (useFrame)
illuminationProgress (0-1) → setDrawRange(0, visiblePoints)
```

---

## Data Structures

### Core Types

```typescript
// ============================================
// STAR POSITION
// Represents a point in the constellation
// ============================================
interface StarPosition {
  id: string;                           // Unique identifier
  x: number;                            // Normalized X (-1 to 1)
  y: number;                            // Normalized Y (-1 to 1)
  z: number;                            // Normalized Z (-1 to 1)
  type: 'origin' | 'company' | 'project';
}

// ============================================
// COMPANY DATA
// Career waypoint information
// ============================================
interface VoyageCompany {
  id: string;                           // Must match StarPosition.id
  name: string;
  role: string;
  period: string;                       // "Aug 2019 - Apr 2020"
  duration: string;                     // "9 months"
  type: 'internship' | 'full-time';
  stationType: 'dock' | 'satellite' | 'freighter' | 'mothership';
  color: string;                        // Theme color key
  skills: string[];
  log: string;                          // Captain's log narrative
  scrollStart: number;                  // Legacy (for old voyage)
  scrollEnd: number;
}

// ============================================
// PROJECT DATA
// Personal project information
// ============================================
interface VoyageProject {
  id: string;                           // Must match StarPosition.id
  name: string;
  description: string;
  theme: 'matrix' | 'rainbow' | 'minimal';
  tags: string[];
  github: string;
  live?: string;
  color: string;
  scrollStart: number;
  scrollEnd: number;
}

// ============================================
// SCENE RANGE
// Progress percentage boundaries
// ============================================
interface SceneRange {
  start: number;                        // 0-100
  end: number;                          // 0-100
}

// ============================================
// SKILL CATEGORY
// Grouped skills for visualization
// ============================================
interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}
```

### Graph Structure (Constellation Connections)

```typescript
// Edge list representation
const constellationConnections: [string, string][] = [
  ['origin', 'ey'],
  ['ey', '6figr'],
  ['6figr', 'captain-fresh'],
  ['captain-fresh', 'glance'],
  ['glance', 'devtoolkit'],
  ['glance', 'colorful-extension'],
  ['glance', 'black-note'],
  ['devtoolkit', 'colorful-extension'],
  ['colorful-extension', 'black-note'],
];

// Visual representation:
//
//     devtoolkit ─── colorful-extension ─── black-note
//          │              │                    │
//          └──────────────┴────────────────────┘
//                         │
//                      glance
//                         │
//                   captain-fresh
//                         │
//                       6figr
//                         │
//                        ey
//                         │
//                      origin
```

### Spatial Layout

```
Y-axis (normalized -1 to 1)
│
│  1.0 ┤           colorful-extension
│      │                 ╱│╲
│  0.8 ┤    devtoolkit ─╱ │ ╲─ black-note
│      │               ╲  │  ╱
│  0.6 ┤                ╲ │ ╱
│      │                 glance
│  0.4 ┤                  │
│      │                  │
│  0.2 ┤         captain-fresh
│      │              ╱
│  0.0 ┤             ╱
│      │          6figr
│ -0.2 ┤           ╱
│      │          ╱
│ -0.4 ┤        ey
│      │       ╱
│ -0.6 ┤      ╱
│      │     ╱
│ -0.8 ┤  origin
│      │
└──────┴─────────────────────────── X-axis
     -0.4   -0.2    0    0.2   0.4
```

### Scene Ranges

```
Progress: 0%                                                    100%
          │                                                      │
          ▼                                                      ▼
┌─────────┬─────────┬─────────────────────────┬─────────┬───────────────────┬─────────┐
│  INTRO  │ ORIGIN  │         CAREER          │  WARP   │     PROJECTS      │ REVEAL  │
│  0-10%  │ 10-20%  │        20-65%           │ 65-75%  │      75-95%       │ 95-100% │
└─────────┴─────────┴─────────────────────────┴─────────┴───────────────────┴─────────┘
                    │                         │         │                   │
                    ▼                         ▼         ▼                   ▼
               ┌────────────────────────┐  ┌─────────────────────────────┐
               │ EY(25%) → 6figr(37%)   │  │ DevToolkit(80%)             │
               │ → CF(50%) → Glance(62%)│  │ → Colorful(87%)             │
               └────────────────────────┘  │ → BlackNote(93%)            │
                                           └─────────────────────────────┘
```

---

## State Management

### State Machine

```
                    ┌─────────────┐
                    │    INTRO    │
                    │   (idle)    │
                    └──────┬──────┘
                           │ progress > 10%
                           ▼
                    ┌─────────────┐
                    │   ORIGIN    │
                    │ (first star)│
                    └──────┬──────┘
                           │ progress > 20%
                           ▼
                    ┌─────────────┐
                    │   CAREER    │◀─────┐
                    │(4 companies)│      │ (cycling through
                    └──────┬──────┘      │  active company)
                           │─────────────┘
                           │ progress > 65%
                           ▼
                    ┌─────────────┐
                    │    WARP     │
                    │(transition) │
                    └──────┬──────┘
                           │ progress > 75%
                           ▼
                    ┌─────────────┐
                    │  PROJECTS   │◀─────┐
                    │(3 projects) │      │ (cycling through
                    └──────┬──────┘      │  active project)
                           │─────────────┘
                           │ progress > 95%
                           ▼
                    ┌─────────────┐
                    │   REVEAL    │
                    │  (finale)   │
                    └─────────────┘
```

### Keyboard State Processing

```typescript
// Input State (useRef - mutable, no re-render)
keysPressed: Set<string> = new Set()

// Animation Frame Loop (60fps)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Read keysPressed set                                    │
│  2. Calculate delta time                                    │
│  3. Apply movement speeds:                                  │
│     - BASE_SPEED = 0.15                                     │
│     - BOOST_MULTIPLIER = 2.5 (if shift)                     │
│     - LATERAL_SPEED = 0.08                                  │
│                                                             │
│  4. Update state:                                           │
│     - progress: clamp(0, 100)                               │
│     - lateralOffset: clamp(-1, 1) with decay                │
│     - cameraRoll: with decay toward 0                       │
│                                                             │
│  5. requestAnimationFrame(loop)                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Derived State Calculations

```typescript
// Scene determination
getConstellationScene(progress: number): string
  if progress < 10 → 'intro'
  if progress < 20 → 'origin'
  if progress < 65 → 'career'
  if progress < 75 → 'warp'
  if progress < 95 → 'projects'
  else → 'reveal'

// Active star determination
getActiveStar(progress: number): StarPosition | null
  scene = getConstellationScene(progress)

  if scene === 'origin':
    return stars.find(id === 'origin')

  if scene === 'career':
    careerProgress = (progress - 20) / 45  // normalize to 0-1
    index = floor(careerProgress * 4)      // 0, 1, 2, or 3
    return stars[['ey', '6figr', 'captain-fresh', 'glance'][index]]

  if scene === 'projects':
    projectProgress = (progress - 75) / 20
    index = floor(projectProgress * 3)     // 0, 1, or 2
    return stars[['devtoolkit', 'colorful-extension', 'black-note'][index]]

  return null

// Illuminated stars (visited)
getIlluminatedStars(progress: number): string[]
  result = []
  if progress >= 10: add 'origin'
  if progress >= 25: add 'ey'
  if progress >= 37: add '6figr'
  if progress >= 50: add 'captain-fresh'
  if progress >= 62: add 'glance'
  if progress >= 80: add 'devtoolkit'
  if progress >= 87: add 'colorful-extension'
  if progress >= 93: add 'black-note'
  return result
```

---

## Rendering Pipeline

### Frame Update Cycle

```
┌───────────────────────────────────────────────────────────────────┐
│                        FRAME UPDATE                               │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. INPUT PHASE                                                   │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ Read keyboard state from keysPressed Set                │  │
│     │ Check for boost (shift key)                             │  │
│     └─────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  2. STATE UPDATE PHASE                                            │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ Calculate new progress (clamp 0-100)                    │  │
│     │ Calculate lateral offset with decay                     │  │
│     │ Calculate camera roll with decay                        │  │
│     │ Set isMoving, isBoosting flags                          │  │
│     └─────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  3. DERIVED STATE PHASE                                           │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ Compute currentScene                                    │  │
│     │ Compute activeStar                                      │  │
│     │ Compute illuminatedStars[]                              │  │
│     └─────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  4. RENDER PHASE (React)                                          │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ Pass state to children via render prop                  │  │
│     │ StarInfoCard updates with new activeStar                │  │
│     │ ConstellationHUD updates progress display               │  │
│     └─────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  5. 3D RENDER PHASE (useFrame in R3F)                             │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ CameraController: lerp camera to target position        │  │
│     │ Star components: update pulse/twinkle animations        │  │
│     │ ConstellationLine: update draw ranges                   │  │
│     │ CosmicDust: update particle rotation                    │  │
│     └─────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  6. AUDIO PHASE                                                   │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │ Check if activeStar changed → play chime                │  │
│     │ Adjust ambient volume based on isBoosting               │  │
│     └─────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Camera Position Algorithm

```typescript
function calculateCameraPosition(
  progress: number,
  scene: string,
  lateralOffset: number
): { position: Vector3, lookAt: Vector3 } {

  const SCALE = 30; // Star position scale factor

  switch(scene) {
    case 'intro':
      // High above, looking down
      return {
        position: new Vector3(
          lateralOffset * 5,
          25 + progress * 0.5,
          55
        ),
        lookAt: new Vector3(0, -5, 0)
      };

    case 'origin':
      // Zoom toward origin star
      const t = (progress - 10) / 10; // 0 to 1
      const originStar = getStarById('origin');
      return {
        position: new Vector3(
          originStar.x * SCALE + lateralOffset * 8,
          originStar.y * SCALE + 8 - t * 3,
          35 - t * 10
        ),
        lookAt: new Vector3(
          originStar.x * SCALE,
          originStar.y * SCALE,
          originStar.z * SCALE
        )
      };

    case 'career':
      // Follow along career path
      const careerPath = ['origin', 'ey', '6figr', 'captain-fresh', 'glance']
        .map(id => getStarById(id));
      const pathT = (progress - 20) / 45; // 0 to 1
      const pathProgress = pathT * (careerPath.length - 1);
      const pathIndex = Math.floor(pathProgress);
      const segmentT = pathProgress - pathIndex;

      const current = careerPath[pathIndex];
      const next = careerPath[Math.min(pathIndex + 1, careerPath.length - 1)];

      const x = lerp(current.x, next.x, segmentT) * SCALE;
      const y = lerp(current.y, next.y, segmentT) * SCALE;
      const z = lerp(current.z, next.z, segmentT) * SCALE;

      return {
        position: new Vector3(x + lateralOffset * 8, y + 5, z + 25),
        lookAt: new Vector3(x, y, z)
      };

    // ... similar for warp, projects, reveal
  }
}
```

---

## Audio System

### Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    ConstellationAudio                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────┐    ┌──────────────────────┐         │
│  │    AudioContext      │    │   User Interaction   │         │
│  │   (Web Audio API)    │◀───│    Event Listener    │         │
│  └──────────────────────┘    └──────────────────────┘         │
│            │                                                   │
│            ▼                                                   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Sound Generators                     │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   Ambient    │  │ Star Chimes  │  │    Boost     │  │   │
│  │  │   Noise      │  │ (per star)   │  │    Sound     │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                         │   │
│  │  Brown Noise      Oscillator +      Sawtooth wave      │   │
│  │  + Low-pass       Harmonics        + Filter sweep      │   │
│  │  filter                                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Sound Design

```typescript
// AMBIENT NOISE (brown noise, space-like)
function createAmbientNoise(context: AudioContext) {
  const buffer = context.createBuffer(1, sampleRate * 2, sampleRate);
  const output = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm
    lastOut = output[i];
  }

  // Route: BufferSource → LowPassFilter (200Hz) → GainNode → Output
}

// STAR CHIMES (unique frequency per star)
const STAR_FREQUENCIES = {
  origin: 440,            // A4
  ey: 494,               // B4
  '6figr': 523,          // C5
  'captain-fresh': 587,  // D5
  glance: 659,           // E5
  devtoolkit: 698,       // F5
  'colorful-extension': 784, // G5
  'black-note': 880      // A5
};

function playStarChime(starId: string) {
  const freq = STAR_FREQUENCIES[starId];
  // Play fundamental + 1.5x + 2x harmonics
  createOscillatorSound(freq, 0.5, 'sine');
  createOscillatorSound(freq * 1.5, 0.3, 'sine', 50ms delay);
  createOscillatorSound(freq * 2, 0.2, 'sine', 100ms delay);
}
```

---

## Performance Considerations

### Optimization Strategies

```
┌────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE OPTIMIZATIONS                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. GEOMETRY MEMOIZATION                                       │
│     ┌────────────────────────────────────────────────────────┐│
│     │ useMemo for all BufferGeometry creation                ││
│     │ Prevents recreation on every render                    ││
│     │ Single allocation per star/line                        ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
│  2. CONDITIONAL RENDERING                                      │
│     ┌────────────────────────────────────────────────────────┐│
│     │ Active effects only rendered when star is active       ││
│     │ Glow lines only when illuminated                       ││
│     │ Grid helper only during intro scene                    ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
│  3. DRAW RANGE OPTIMIZATION                                    │
│     ┌────────────────────────────────────────────────────────┐│
│     │ Line animation via setDrawRange, not geometry rebuild  ││
│     │ GPU handles partial rendering efficiently              ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
│  4. CAMERA LERPING                                             │
│     ┌────────────────────────────────────────────────────────┐│
│     │ Smooth interpolation (lerp 0.03) prevents jerky motion ││
│     │ Target position calculated, actual position follows    ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
│  5. PERFORMANCE MONITOR                                        │
│     ┌────────────────────────────────────────────────────────┐│
│     │ drei PerformanceMonitor adjusts quality dynamically    ││
│     │ DPR capped at [1, 2] for mobile optimization           ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
│  6. PARTICLE LIMITS                                            │
│     ┌────────────────────────────────────────────────────────┐│
│     │ Background stars: 3000 (drei Stars)                    ││
│     │ Cosmic dust: 400 particles                             ││
│     │ Reasonable for 60fps on mid-range devices              ││
│     └────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Memory Management

```typescript
// Pattern: useMemo for Three.js objects
const geometry = useMemo(() => {
  // Created once on mount
  return new THREE.BufferGeometry().setFromPoints(points);
}, [/* dependencies */]);

// Pattern: useEffect cleanup for audio
useEffect(() => {
  const context = new AudioContext();
  // ... setup

  return () => {
    // Cleanup on unmount
    context.close();
  };
}, []);

// Pattern: useRef for mutable state (no re-renders)
const keysPressed = useRef<Set<string>>(new Set());
// Mutate directly without setState
keysPressed.current.add(key);
```

---

## Future Enhancements

### Planned Features

1. **Touch Controls**: Swipe gestures for mobile
2. **Skill Orbits**: Skills orbiting around active star
3. **Star Burst Particles**: Particle effect on star activation
4. **Persistent Progress**: LocalStorage to resume journey
5. **Accessibility**: Screen reader announcements, reduced motion mode
6. **WebGPU Support**: Future migration for better performance

### Architecture for Extensions

```typescript
// Plugin pattern for scene effects
interface SceneEffect {
  id: string;
  scenes: string[];  // Which scenes to apply to
  onEnter: (progress: number) => void;
  onUpdate: (progress: number, delta: number) => void;
  onExit: () => void;
  render: () => JSX.Element;
}

// Registry for effects
const effectRegistry: SceneEffect[] = [];

// Example: Star burst effect
const starBurstEffect: SceneEffect = {
  id: 'star-burst',
  scenes: ['career', 'projects'],
  onEnter: (progress) => { /* initialize particles */ },
  onUpdate: (progress, delta) => { /* animate */ },
  onExit: () => { /* cleanup */ },
  render: () => <StarBurstParticles />
};
```

---

## Summary

This system design provides a complete blueprint for the Constellation Journey feature, covering:

- **HLD**: Overall architecture, data flow, and technology stack
- **LLD**: Component specifications, module breakdown, and algorithms
- **Data Structures**: Type definitions, graph representation, and spatial layout
- **State Management**: State machine, input processing, and derived state
- **Rendering**: Frame update cycle and camera positioning
- **Audio**: Web Audio API architecture and sound design
- **Performance**: Optimization strategies and memory management

The design follows React and Three.js best practices while maintaining extensibility for future enhancements.
