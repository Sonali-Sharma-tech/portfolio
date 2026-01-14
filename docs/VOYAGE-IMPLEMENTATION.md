# Space Voyage Journey - Implementation Documentation

## Overview

The **Space Voyage Journey** is an immersive, keyboard-controlled space flight experience that serves as an interactive portfolio showcase. Users pilot a spacecraft through a cinematic journey representing the developer's career path, from origin (Earth) through career milestones (space stations) to personal projects (themed planets).

**Entry Point:** `/journey` route
**Technology Stack:** Next.js 14, React Three Fiber (R3F), Framer Motion, Three.js, Tailwind CSS

---

## Architecture

```
src/
├── app/
│   └── journey/
│       └── page.tsx                    # Main journey page
├── components/
│   └── voyage/
│       ├── VoyageController.tsx        # State management & keyboard input
│       ├── VoyageHUD.tsx               # Heads-up display overlay
│       ├── SpaceshipPilot.tsx          # Spaceship controls & cockpit HUD
│       ├── effects/
│       │   ├── SpaceEnvironment.tsx    # 3D starfield & parallax background
│       │   └── HyperspaceStars.tsx     # Scroll-linked star parallax
│       ├── scenes/
│       │   ├── EarthScene.tsx          # Scene 1: Interactive 3D Earth
│       │   ├── LaunchScene.tsx         # Scene 2: Rocket launch animation
│       │   ├── SpaceStation.tsx        # Scene 3: Career milestones
│       │   ├── WormholeScene.tsx       # Scene 4: Dimensional transition
│       │   ├── ProjectPlanet.tsx       # Scene 5: Project showcases
│       │   └── DestinationScene.tsx    # Scene 6: Journey complete
│       └── three/
│           ├── SpaceCanvas.tsx         # R3F canvas wrapper
│           ├── GalaxyParticles.tsx     # Galaxy particle effects
│           ├── NebulaBackground.tsx    # Nebula gradients
│           ├── CinematicPlanet.tsx     # 3D planet rendering
│           └── WormholeTunnel.tsx      # 3D wormhole geometry
└── lib/
    └── voyage-data.ts                  # Journey content data
```

---

## Core Components

### 1. VoyageController (`VoyageController.tsx`)

**Purpose:** Central state management and orchestration

**Key Features:**
- Manages journey progress (0-100%)
- Handles keyboard input delegation
- Computes current scene, active company, and active project
- Provides render prop pattern for child components
- Controls viewport transform based on ship movement

**State Interface:**
```typescript
interface VoyageState {
  scrollProgress: number;           // 0-100% journey completion
  currentScene: string;             // 'earth' | 'launch' | 'career' | 'wormhole' | 'projects' | 'destination'
  activeCompany: VoyageCompany | null;
  activeProject: VoyageProject | null;
  isLaunching: boolean;
  isInWormhole: boolean;
  scrollYProgress: MotionValue<number>;
  startVoyage: () => void;
  hasStarted: boolean;
  shipLateralPosition: number;      // -1 to 1, left/right
  shipRoll: number;                 // -1 to 1, banking angle
}
```

**Exported Utilities:**
- `SceneWrapper` - Animated visibility wrapper for scenes
- `useSceneProgress()` - Hook for computing scene-local progress

---

### 2. SpaceshipPilot (`SpaceshipPilot.tsx`)

**Purpose:** First-person spaceship control system

**Controls:**
| Key | Action |
|-----|--------|
| `↑` / `W` | Thrust forward (advance through journey) |
| `↓` / `S` | Reduce thrust |
| `←` / `A` | Bank/strafe left |
| `→` / `D` | Bank/strafe right |
| `SHIFT` | Hyperdrive boost (faster travel) |
| `SPACE` | Initial launch trigger |

**Ship State:**
```typescript
interface ShipState {
  thrust: number;           // 0-1, current engine power
  lateralPosition: number;  // -1 to 1, horizontal offset
  roll: number;             // -1 to 1, banking angle
  pitch: number;            // Forward tilt during acceleration
  speed: number;            // Current velocity
  boostActive: boolean;     // Hyperdrive engaged
}
```

**Visual Elements:**
- Cockpit corner frames (cyan/magenta gradients)
- Center targeting reticle (scales with thrust)
- Bottom HUD bar (velocity & thrust meters)
- Engine glow reflection at screen bottom
- "HYPERDRIVE ENGAGED" indicator during boost

---

### 3. SpaceEnvironment (`effects/SpaceEnvironment.tsx`)

**Purpose:** Immersive space background with parallax and interactivity

**Features:**
- Mouse-tracked camera rotation (creates parallax)
- 5-layer 3D starfield with depth-based movement
- Spiral galaxy with SVG spiral arms
- Nebula clouds (blue, magenta)
- Floating dust particles
- Warp speed lines (appears after 12% progress)
- Cockpit window frame overlay
- Responds to ship lateral movement (strafing shifts view)

**Star Layer Configuration:**
| Layer | Count | Depth | Size Range | Parallax Speed |
|-------|-------|-------|------------|----------------|
| 1 | 200 | 0.1 | 0.5-1.5px | 0.02 |
| 2 | 150 | 0.3 | 1-2px | 0.05 |
| 3 | 100 | 0.5 | 1.5-3px | 0.1 |
| 4 | 50 | 0.8 | 2-4px | 0.2 |
| 5 | 20 | 1.0 | 3-5px | 0.3 |

---

### 4. VoyageHUD (`VoyageHUD.tsx`)

**Purpose:** Persistent journey information overlay

**Elements:**
- **Top Bar:**
  - Mission status indicator (pulsing dot)
  - Current scene label
  - Current waypoint name
  - Voyage progress percentage
  - Exit link (← EXIT)

- **Bottom Bar:**
  - Scene markers on timeline
  - Gradient progress bar
  - Current position indicator

---

## Scene Breakdown

### Scene 1: Earth (0-12%)
**File:** `scenes/EarthScene.tsx`

**Features:**
- Interactive 3D Earth with React Three Fiber
- High-resolution Earth textures (day map, cloud layer)
- Clickable Indore marker with coordinates
- Camera zoom animation on click
- Education info popup on zoom complete
- Auto-rotating Earth with cloud layer
- Stars background via `@react-three/drei`

**Textures Used:**
- `public/textures/planets/earth_day.jpg`
- `public/textures/planets/earth_clouds.png`

**Interaction Flow:**
1. User hovers Indore marker → Info panel appears
2. User clicks marker → Camera zooms to location
3. Zoom complete → Education info displays
4. 1 second delay → Voyage auto-starts

---

### Scene 2: Launch (12-22%)
**File:** `scenes/LaunchScene.tsx`

**Features:**
- CSS-based Earth receding animation
- Atmosphere glow and haze fading
- Engine glow with flicker effect
- Telemetry HUD (altitude, velocity, status)
- Milestone messages ("PASSING THROUGH STRATOSPHERE", etc.)
- Star density increasing as atmosphere fades
- Viewport vignette effect

**Telemetry Values:**
- Altitude: 0 → 400 km
- Velocity: 0 → 7800 m/s
- Phases: Stratosphere → Mesosphere → Exiting Atmosphere

---

### Scene 3: Career/Space Stations (22-62%)
**File:** `scenes/SpaceStation.tsx`

**Features:**
- Full 3D React Three Fiber scene
- Spiral galaxy with 25,000 particle dust lanes
- Camera follows logarithmic spiral path
- 4 career planets positioned along spiral
- Each company appears as approaching planet
- Planet themes by company color (orange, green, magenta, cyan)
- Saturn-style rings on some planets
- Traveling particles around camera
- Company info panel slides in when active

**Company Data:**
| Company | Role | Duration | Station Type | Color |
|---------|------|----------|--------------|-------|
| EY | Web Developer | 9 months | Dock | Orange |
| 6figr.com | Frontend Developer | 1yr 6mo | Satellite | Green |
| Captain Fresh | Software Engineer | 1yr 2mo | Freighter | Magenta |
| Glance | SDE II → SDE III | 2+ years | Mothership | Cyan |

**Planet Themes:**
```typescript
const PLANET_THEMES = {
  orange: { hasRing: false },
  green: { hasRing: true },
  magenta: { hasRing: false },
  cyan: { hasRing: true },
};
```

---

### Scene 4: Wormhole (62-74%)
**File:** `scenes/WormholeScene.tsx`

**Features:**
- 3D wormhole tunnel with camera fly-through
- Three phases: Entering (0-25%), Inside (25-75%), Exiting (75-100%)
- Camera shake during center passage
- Color transition: Cyan → Magenta → Green
- Portal rings at both ends
- Streaming particles through tunnel
- Chromatic aberration overlay when inside
- Scan lines effect
- Text overlays:
  - "INITIATING DIMENSIONAL SHIFT"
  - "EMPLOYEE → CREATOR"
  - "ENTERING PROJECT DIMENSION"
- Exit flash effect

**Supporting Component:** `three/WormholeTunnel.tsx`

---

### Scene 5: Projects (74-94%)
**File:** `scenes/ProjectPlanet.tsx`

**Features:**
- Three distinct themed worlds
- Project timeline on left side
- Project info panel on right side
- Smooth transitions between projects

**Project Themes:**

1. **Matrix World (DevToolkit)**
   - Matrix-style falling code rain
   - Terminal prompt with blinking cursor
   - Green grid overlay
   - Japanese/code characters

2. **Rainbow World (Colorful Extension)**
   - Floating color orbs with blur
   - Animated gradient background
   - Paint splash effects
   - Color palette bar

3. **Minimal World (Black Note)**
   - Subtle floating particles
   - Elegant note card silhouettes
   - Clean dark aesthetic

**Project Data:**
| Project | Theme | Tags |
|---------|-------|------|
| DevToolkit | matrix | TypeScript, Developer Tools |
| Colorful Extension | rainbow | VS Code, Themes |
| Black Note | minimal | React, Notes |

---

### Scene 6: Destination (94-100%)
**File:** `scenes/DestinationScene.tsx`

**Features:**
- Rotating spiral galaxy background
- Celebration particles in 4 colors
- Success checkmark icon
- "VOYAGE COMPLETE" gradient text
- Career statistics grid (Years, Stations, Worlds)
- Navigation buttons:
  - HOME BASE (→ /)
  - VIEW PROJECTS (→ /projects)
  - ABOUT PILOT (→ /about)
- "REPLAY VOYAGE" button (reloads page)
- Inspirational quote

---

## Data Layer

### voyage-data.ts

**Exported Types:**
```typescript
interface VoyageOrigin {
  city: string;
  country: string;
  education: string;
  coordinates: { lat: number; lng: number };
}

interface VoyageCompany {
  id: string;
  name: string;
  role: string;
  period: string;
  duration: string;
  type: 'internship' | 'full-time';
  stationType: 'dock' | 'satellite' | 'freighter' | 'mothership';
  color: string;
  skills: string[];
  log: string;  // Captain's log narrative
  scrollStart: number;
  scrollEnd: number;
}

interface VoyageProject {
  id: string;
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
```

**Scene Ranges:**
```typescript
const sceneRanges = {
  earth: { start: 0, end: 12 },
  launch: { start: 12, end: 22 },
  career: { start: 22, end: 62 },
  wormhole: { start: 62, end: 74 },
  projects: { start: 74, end: 94 },
  destination: { start: 94, end: 100 },
};
```

**Helper Functions:**
- `getCurrentScene(scrollProgress)` - Returns scene name
- `getActiveCompany(scrollProgress)` - Returns company or null
- `getActiveProject(scrollProgress)` - Returns project or null
- `getSceneProgress(scrollProgress, start, end)` - Returns 0-1 progress within scene

---

## Assets

### Earth Textures (`public/textures/planets/`)
| File | Purpose | Resolution |
|------|---------|------------|
| earth_day.jpg | Daylight surface map | High-res |
| earth_night.jpg | City lights | High-res |
| earth_clouds.png | Cloud layer (transparent) | High-res |
| earth_normal.jpg | Normal map for 3D | High-res |
| earth_specular.jpg | Specular highlights | High-res |

---

## Key Technical Decisions

### 1. Keyboard-Controlled Navigation
- Replaced scroll-based navigation with game-like controls
- UP arrow creates forward thrust that advances progress
- Creates more engaging, interactive experience
- Allows lateral movement for visual variety

### 2. Render Prop Pattern (VoyageController)
- Single source of truth for voyage state
- Clean separation between control logic and presentation
- All scenes receive consistent state interface

### 3. Progress-Based Scene Visibility
- Each scene checks `isActive` before rendering
- `SceneWrapper` handles fade in/out animations
- Prevents unnecessary rendering of off-screen scenes

### 4. React Three Fiber for 3D
- Used for Earth, Career planets, and Wormhole
- `@react-three/drei` for helpers (Stars, Html, OrbitControls)
- Suspense boundaries for texture loading

### 5. CSS-Based Effects Where Possible
- Launch scene uses pure CSS for Earth animation
- Reduces Three.js overhead in simpler scenes
- Project worlds use CSS animations for patterns

### 6. Framer Motion for 2D Animations
- HUD elements and panels
- Scene transitions
- Info panel slide-ins

---

## Performance Considerations

1. **Scene Lazy Rendering:** Only active scene renders its content
2. **Memoized Star Fields:** Star arrays generated once with `useMemo`
3. **RequestAnimationFrame Loop:** Ship physics runs in optimized game loop
4. **Three.js Optimization:**
   - `powerPreference: "high-performance"`
   - Controlled DPR: `dpr={[1, 2]}`
   - Additive blending for particles (no depth sorting)
5. **CSS Transforms:** Parallax uses GPU-accelerated transforms

---

## Dependencies

```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "three": "^0.160.x",
  "framer-motion": "^10.x",
  "next": "14.x",
  "react": "18.x",
  "tailwindcss": "3.x"
}
```

---

## Usage

1. Navigate to `/journey` route
2. Click on Indore marker on Earth to begin
3. Press `↑` or `W` to thrust forward
4. Use `←` `→` or `A` `D` to strafe
5. Hold `SHIFT` for hyperdrive boost
6. Watch the bottom progress bar to track journey
7. Complete at 100% to see final statistics

---

## Future Improvements

- [ ] Mobile touch controls
- [ ] Sound effects and ambient audio
- [ ] Persistent progress saving
- [ ] Additional project worlds
- [ ] VR/AR mode support
- [ ] Accessibility improvements (screen reader support)
