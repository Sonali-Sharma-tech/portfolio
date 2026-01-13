"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";

// ==========================================
// SPACEX-INSPIRED CREW DRAGON COCKPIT UI
// Minimalist, professional spacecraft interface
// ==========================================

// Launch sequence phases
const launchPhases = [
  { id: 'init', message: 'INITIALIZING SYSTEMS', duration: 1200 },
  { id: 'systems', message: 'SYSTEMS CHECK NOMINAL', duration: 1000 },
  { id: 'fuel', message: 'PROPELLANT PRESSURIZED', duration: 800 },
  { id: 'engines', message: 'ENGINE IGNITION SEQUENCE', duration: 1200 },
  { id: 'countdown', message: 'T-3', duration: 700 },
  { id: 'countdown2', message: 'T-2', duration: 700 },
  { id: 'countdown1', message: 'T-1', duration: 700 },
  { id: 'liftoff', message: 'LIFTOFF', duration: 1500 },
];

// Waypoints in space
const waypoints = [
  {
    id: 'pilot',
    name: 'PILOT PROFILE',
    icon: '●',
    color: 'cyan',
    distance: 15,
    data: {
      title: 'SONALI SHARMA',
      subtitle: 'SDE III @ GLANCE',
      stats: [
        { label: 'EXP', value: '5+ YRS' },
        { label: 'LOC', value: 'BLR' },
        { label: 'STATUS', value: 'ACTIVE' },
      ],
    },
    link: '/about',
  },
  {
    id: 'career',
    name: 'CAREER LOG',
    icon: '◆',
    color: 'blue',
    distance: 35,
    data: {
      title: 'EXPERIENCE',
      entries: [
        'GLANCE — SDE III (Current)',
        'GLANCE — SDE II (2023-2025)',
        'CAPTAIN FRESH — SDE (2022-2023)',
        '6FIGR — Frontend (2020-2022)',
      ],
    },
    link: '/about',
  },
  {
    id: 'tech',
    name: 'TECH STACK',
    icon: '◇',
    color: 'green',
    distance: 55,
    data: {
      title: 'MODULES',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL', 'Svelte', 'MongoDB'],
    },
    link: '/about#skills',
  },
  {
    id: 'missions',
    name: 'MISSIONS',
    icon: '▲',
    color: 'orange',
    distance: 75,
    data: {
      title: 'DEPLOYMENTS',
      projects: [
        { name: 'DevToolkit', status: 'LIVE' },
        { name: 'Colorful Extension', status: 'ACTIVE' },
        { name: 'Black Note', status: 'DEPLOYED' },
      ],
    },
    link: '/projects',
  },
  {
    id: 'comms',
    name: 'COMMS',
    icon: '◎',
    color: 'magenta',
    distance: 95,
    data: {
      title: 'CHANNELS',
      links: [
        { name: 'GitHub', url: 'https://github.com/Sonali-Sharma-tech' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/sonali-sharma110114' },
        { name: 'Email', url: 'mailto:sonali.sharma110114@gmail.com' },
      ],
    },
  },
];

// Pre-generate star data for spiral galaxy effect - deterministic values
// Stars are positioned in polar coordinates for spiral movement
const STARS = Array.from({ length: 120 }, (_, i) => {
  // Create spiral arms - stars distributed along logarithmic spiral
  const armIndex = i % 4; // 4 spiral arms
  const positionInArm = Math.floor(i / 4);
  const baseAngle = (armIndex * Math.PI / 2) + (positionInArm * 0.15); // Spread along arm
  const baseRadius = 5 + positionInArm * 2.5; // Distance from center increases

  return {
    id: i,
    baseAngle,
    baseRadius,
    size: 1 + (i % 3),
    opacity: 0.15 + (i % 5) * 0.08,
    speed: 0.3 + (i % 4) * 0.15, // Rotation speed variation
    // Color variation for galaxy feel
    color: i % 10 === 0 ? 'cyan' : i % 15 === 0 ? 'magenta' : 'white',
  };
});

// Nebula clouds for galaxy center glow
const NEBULA_CLOUDS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * Math.PI * 2,
  radius: 10 + (i % 3) * 5,
  size: 100 + (i % 4) * 50,
  opacity: 0.03 + (i % 3) * 0.01,
  color: i % 2 === 0 ? 'cyan' : 'magenta',
}));

// Circular Gauge Component - SpaceX style
function CircularGauge({
  value,
  max = 100,
  label,
  unit = '',
  color = 'cyan',
  size = 80,
  warning = false
}: {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  color?: string;
  size?: number;
  warning?: boolean;
}) {
  const percentage = Math.min(100, (value / max) * 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = warning ? 'text-orange' : `text-${color}`;
  const strokeColor = warning ? '#ff9500' :
    color === 'cyan' ? '#00fff5' :
    color === 'green' ? '#00ff88' :
    color === 'magenta' ? '#ff00ff' : '#00fff5';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-[10px] sm:text-xs md:text-sm font-mono font-bold ${colorClass}`}>
            {typeof value === 'number' ? (value > 9999 ? `${(value/1000).toFixed(0)}k` : value.toLocaleString()) : value}
          </span>
          {unit && <span className="text-[6px] sm:text-[7px] text-white/40 font-mono">{unit}</span>}
        </div>
      </div>
      <span className="text-[8px] sm:text-[9px] font-mono text-white/50 mt-1 tracking-wider">{label}</span>
    </div>
  );
}

// Linear Progress Bar - SpaceX style
function LinearGauge({
  value,
  max = 100,
  label,
  color = 'cyan',
  showValue = true,
}: {
  value: number;
  max?: number;
  label: string;
  color?: string;
  showValue?: boolean;
}) {
  const percentage = Math.min(100, (value / max) * 100);
  const colorClass = `bg-${color}`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-mono text-white/50 tracking-wider">{label}</span>
        {showValue && <span className={`text-[10px] font-mono text-${color}`}>{percentage.toFixed(0)}%</span>}
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%`, boxShadow: `0 0 10px currentColor` }}
        />
      </div>
    </div>
  );
}

export default function JourneyPage() {
  // Journey phases
  const [phase, setPhase] = useState<'launch' | 'flying' | 'complete'>('launch');
  const [launchStep, setLaunchStep] = useState(0);
  const [launchProgress, setLaunchProgress] = useState(0);

  // Flight state
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [isThrusting, setIsThrusting] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [currentWaypoint, setCurrentWaypoint] = useState(-1);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);

  // Cockpit displays
  const [altitude, setAltitude] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [engineTemp, setEngineTemp] = useState(22);
  const [thrustLevel, setThrustLevel] = useState(0);

  // Visual effects
  const [isShaking, setIsShaking] = useState(false);
  const [warping, setWarping] = useState(false);

  // System time
  const [missionTime, setMissionTime] = useState('00:00:00');
  const missionStartRef = useRef<number | null>(null);

  // Animation refs
  const animRef = useRef<number | null>(null);
  const speedRef = useRef(0);
  const progressRef = useRef(0);

  // Mission timer
  useEffect(() => {
    if (phase === 'flying' && !missionStartRef.current) {
      missionStartRef.current = Date.now();
    }

    const interval = setInterval(() => {
      if (missionStartRef.current) {
        const elapsed = Date.now() - missionStartRef.current;
        const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
        setMissionTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // ==========================================
  // LAUNCH SEQUENCE
  // ==========================================
  useEffect(() => {
    if (phase !== 'launch') return;

    if (launchStep >= launchPhases.length) {
      setTimeout(() => {
        setPhase('flying');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1500);
      }, 400);
      return;
    }

    const currentPhase = launchPhases[launchStep];

    const progressInterval = setInterval(() => {
      setLaunchProgress(prev => {
        const target = ((launchStep + 1) / launchPhases.length) * 100;
        if (prev >= target) {
          clearInterval(progressInterval);
          return target;
        }
        return prev + 3;
      });
    }, 40);

    if (currentPhase.id === 'engines' || currentPhase.id === 'liftoff') {
      setIsShaking(true);
    }

    const timeout = setTimeout(() => {
      setLaunchStep(prev => prev + 1);
      if (currentPhase.id !== 'liftoff') {
        setIsShaking(false);
      }
    }, currentPhase.duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [phase, launchStep]);

  // ==========================================
  // SMOOTH FLYING MECHANICS
  // ==========================================
  const startThrust = useCallback(() => {
    if (phase !== 'flying' || progressRef.current >= 100) return;

    setIsThrusting(true);
    setWarping(true);
    setIsShaking(true);

    const fly = () => {
      speedRef.current = Math.min(9999, speedRef.current + 40);
      setSpeed(speedRef.current);
      setThrustLevel(Math.min(100, speedRef.current / 50));

      progressRef.current = Math.min(100, progressRef.current + 0.2);
      setJourneyProgress(progressRef.current);

      if (progressRef.current >= 100) {
        setIsThrusting(false);
        setWarping(false);
        setIsShaking(false);
        speedRef.current = 0;
        setSpeed(0);
        setPhase('complete');
        return;
      }

      animRef.current = requestAnimationFrame(fly);
    };

    animRef.current = requestAnimationFrame(fly);
  }, [phase]);

  const stopThrust = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    setIsThrusting(false);
    setWarping(false);
    setIsShaking(false);

    const decelerate = () => {
      speedRef.current = Math.max(0, speedRef.current * 0.94);
      setSpeed(Math.floor(speedRef.current));
      setThrustLevel(Math.min(100, speedRef.current / 50));
      if (speedRef.current > 5) {
        requestAnimationFrame(decelerate);
      }
    };
    decelerate();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        startThrust();
      }
      if (e.code === 'KeyR') {
        window.location.reload();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        stopThrust();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startThrust, stopThrust]);

  // Update waypoint
  useEffect(() => {
    const wpIndex = waypoints.findIndex((wp, i) => {
      const next = waypoints[i + 1];
      return journeyProgress >= wp.distance && (!next || journeyProgress < next.distance);
    });
    if (wpIndex !== currentWaypoint && wpIndex >= 0) {
      setCurrentWaypoint(wpIndex);
      setShowWaypointPanel(true);
      setTimeout(() => setShowWaypointPanel(false), 5000);
    }
  }, [journeyProgress, currentWaypoint]);

  // Telemetry updates
  useEffect(() => {
    if (phase !== 'flying') return;

    let altCounter = altitude;
    const interval = setInterval(() => {
      altCounter += isThrusting ? 280 : 15;
      setAltitude(altCounter);
      setFuel(prev => Math.max(12, prev - (isThrusting ? 0.12 : 0.015)));
      setEngineTemp(prev => isThrusting ? Math.min(88, prev + 0.8) : Math.max(22, prev - 0.4));
    }, 250);
    return () => clearInterval(interval);
  }, [phase, isThrusting, altitude]);

  const activeWaypoint = currentWaypoint >= 0 ? waypoints[currentWaypoint] : null;

  // Memoize spiral galaxy stars
  const starElements = useMemo(() => {
    // Center of the viewport
    const centerX = 50;
    const centerY = 50;

    // Rotation based on journey progress - creates spiral motion
    const rotationOffset = (journeyProgress / 100) * Math.PI * 3; // 1.5 full rotations over journey

    return STARS.map(star => {
      // Calculate current angle with rotation (spiral effect)
      const currentAngle = star.baseAngle + rotationOffset * star.speed;

      // Radius expands slightly when thrusting (zoom effect)
      const radiusMultiplier = warping ? 1.3 : 1;
      const currentRadius = star.baseRadius * radiusMultiplier;

      // Convert polar to cartesian coordinates
      const x = centerX + Math.cos(currentAngle) * currentRadius;
      const y = centerY + Math.sin(currentAngle) * currentRadius;

      // Stars stretch radially when warping
      const stretchAngle = currentAngle + Math.PI / 2; // Perpendicular to radius
      const stretchX = warping ? Math.cos(stretchAngle) * 8 : 0;
      const stretchY = warping ? Math.sin(stretchAngle) * 8 : 0;

      // Color based on star type
      const bgColor = star.color === 'cyan' ? '#00fff5' :
                      star.color === 'magenta' ? '#ff00ff' : 'white';

      return (
        <div
          key={star.id}
          className="absolute rounded-full transition-all duration-150"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${star.size}px`,
            height: warping ? `${star.size + 10}px` : `${star.size}px`,
            backgroundColor: bgColor,
            opacity: star.opacity,
            transform: warping ? `translate(${stretchX}px, ${stretchY}px)` : 'none',
            boxShadow: star.color !== 'white' ? `0 0 ${star.size * 2}px ${bgColor}` : 'none',
          }}
        />
      );
    });
  }, [journeyProgress, warping]);

  // Memoize nebula clouds (galaxy center glow)
  const nebulaElements = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    const rotationOffset = (journeyProgress / 100) * Math.PI * 0.5;

    return NEBULA_CLOUDS.map(cloud => {
      const currentAngle = cloud.angle + rotationOffset;
      const x = centerX + Math.cos(currentAngle) * cloud.radius;
      const y = centerY + Math.sin(currentAngle) * cloud.radius;

      const bgColor = cloud.color === 'cyan' ? 'rgba(0,255,245,' : 'rgba(255,0,255,';

      return (
        <div
          key={`nebula-${cloud.id}`}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            backgroundColor: `${bgColor}${cloud.opacity})`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    });
  }, [journeyProgress]);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      className={`fixed inset-0 bg-black overflow-hidden select-none ${isShaking ? 'animate-shake' : ''}`}
      onMouseDown={startThrust}
      onMouseUp={stopThrust}
      onMouseLeave={stopThrust}
      onTouchStart={startThrust}
      onTouchEnd={stopThrust}
    >
      {/* SPACE VIEWPORT - Spiral Galaxy */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Galaxy center glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,245,0.15) 0%, rgba(255,0,255,0.1) 40%, transparent 70%)',
            transform: `translate(-50%, -50%) scale(${warping ? 1.5 : 1})`,
            transition: 'transform 0.3s ease-out',
          }}
        />

        {/* Nebula clouds rotating slowly */}
        {nebulaElements}

        {/* Spiral galaxy stars */}
        {starElements}

        {/* Subtle grid overlay - SpaceX style */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,245,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,245,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Waypoint markers on timeline */}
        {waypoints.map((wp) => {
          const relativePos = wp.distance - journeyProgress;
          if (relativePos < -5 || relativePos > 35) return null;
          const scale = Math.max(0.3, 1 - Math.abs(relativePos) / 35);
          const yOffset = (relativePos - 10) * 2.5;

          return (
            <div
              key={wp.id}
              className="absolute left-1/2 transition-all duration-500 ease-out"
              style={{
                transform: `translateX(-50%) translateY(${yOffset}vh) scale(${scale})`,
                top: '40%',
                opacity: scale * 0.9,
                zIndex: Math.floor(scale * 10),
              }}
            >
              <div className="text-center">
                <div
                  className={`text-3xl sm:text-4xl md:text-5xl font-light text-${wp.color}`}
                  style={{
                    filter: `drop-shadow(0 0 20px var(--neon-${wp.color}))`,
                    textShadow: `0 0 30px var(--neon-${wp.color})`
                  }}
                >
                  {wp.icon}
                </div>
                <div className={`text-[10px] sm:text-xs font-mono mt-2 text-${wp.color}/80 tracking-widest`}>
                  {wp.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COCKPIT FRAME - Minimal SpaceX style */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/60 to-transparent" />

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-cyan/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-cyan/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-cyan/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-cyan/30" />
      </div>

      {/* LAUNCH SEQUENCE UI */}
      {phase === 'launch' && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/90">
          <div className="text-center max-w-md px-6">
            {/* Launch status indicator */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto relative">
                <svg className="transform -rotate-90" width="96" height="96">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="48" cy="48" r="44"
                    fill="none"
                    stroke="#00fff5"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (launchProgress / 100) * 276.46}
                    className="transition-all duration-200"
                    style={{ filter: 'drop-shadow(0 0 8px #00fff5)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-mono text-cyan font-bold">{Math.floor(launchProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-mono text-white/90 mb-2 tracking-wider">
              {launchPhases[launchStep]?.message || 'INITIALIZING'}
            </div>

            <div className="text-sm font-mono text-white/40 mb-8">
              DRAGON SPACECRAFT • LAUNCH SEQUENCE
            </div>

            {/* Systems status grid */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {[
                { name: 'LIFE SUPPORT', threshold: 20 },
                { name: 'NAVIGATION', threshold: 40 },
                { name: 'PROPULSION', threshold: 60 },
                { name: 'COMMS', threshold: 80 },
              ].map((system) => (
                <div
                  key={system.name}
                  className={`flex items-center gap-2 p-2 border transition-all duration-300 ${
                    launchProgress >= system.threshold
                      ? 'border-green/50 bg-green/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      launchProgress >= system.threshold ? 'bg-green' : 'bg-white/20'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono tracking-wider transition-colors ${
                      launchProgress >= system.threshold ? 'text-green' : 'text-white/40'
                    }`}
                  >
                    {system.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COCKPIT HUD - SpaceX Crew Dragon inspired */}
      {phase === 'flying' && (
        <>
          {/* TOP BAR - Mission info */}
          <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
            <div className="flex justify-between items-start p-4 sm:p-6">
              {/* Left panel - Telemetry */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 sm:p-3 md:p-4">
                <div className="text-[8px] sm:text-[9px] font-mono text-white/40 mb-2 sm:mb-3 tracking-widest">TELEMETRY</div>
                <div className="flex gap-3 sm:gap-4 md:gap-6">
                  <CircularGauge
                    value={altitude}
                    max={999999}
                    label="ALT"
                    unit="KM"
                    color="cyan"
                    size={55}
                  />
                  <CircularGauge
                    value={speed}
                    max={9999}
                    label="VEL"
                    unit="M/S"
                    color="cyan"
                    size={55}
                    warning={speed > 7000}
                  />
                </div>
              </div>

              {/* Center - Mission status */}
              <div className="hidden sm:block text-center">
                <div className="text-[10px] font-mono text-white/30 tracking-[0.3em] mb-1">MISSION</div>
                <div className="text-lg font-mono text-white/90 tracking-wider">PORTFOLIO VOYAGE</div>
                <div className="text-2xl font-mono text-cyan mt-1">{journeyProgress.toFixed(0)}%</div>
                <div className="text-[10px] font-mono text-white/30 mt-2">MET {missionTime}</div>
              </div>

              {/* Right panel - Systems */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 sm:p-3 md:p-4">
                <div className="text-[8px] sm:text-[9px] font-mono text-white/40 mb-2 sm:mb-3 tracking-widest">SYSTEMS</div>
                <div className="space-y-2 sm:space-y-3 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
                  <LinearGauge value={fuel} max={100} label="FUEL" color="green" />
                  <LinearGauge value={engineTemp} max={100} label="TEMP" color={engineTemp > 75 ? 'orange' : 'cyan'} />
                  <LinearGauge value={thrustLevel} max={100} label="THRUST" color="magenta" />
                </div>
              </div>
            </div>
          </div>

          {/* WAYPOINT PANEL - Center overlay */}
          {showWaypointPanel && activeWaypoint && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in pointer-events-auto px-4 w-full max-w-sm">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl text-${activeWaypoint.color}`}>{activeWaypoint.icon}</span>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 tracking-widest">WAYPOINT REACHED</div>
                    <h2 className={`text-lg font-mono text-${activeWaypoint.color} tracking-wider`}>
                      {activeWaypoint.name}
                    </h2>
                  </div>
                </div>

                {activeWaypoint.data.title && (
                  <div className="text-white font-mono text-sm mb-3">{activeWaypoint.data.title}</div>
                )}

                {activeWaypoint.data.subtitle && (
                  <div className="text-white/60 font-mono text-xs mb-3">{activeWaypoint.data.subtitle}</div>
                )}

                {activeWaypoint.data.stats && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {activeWaypoint.data.stats.map(stat => (
                      <div key={stat.label} className="text-center p-2 bg-white/5 border border-white/10">
                        <div className="text-[9px] text-white/40 font-mono">{stat.label}</div>
                        <div className={`text-xs font-mono font-bold text-${activeWaypoint.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeWaypoint.data.entries && (
                  <div className="space-y-1 text-xs font-mono mb-4">
                    {activeWaypoint.data.entries.map((entry, i) => (
                      <div key={i} className="text-white/60 flex items-center gap-2">
                        <span className="text-green">▸</span> {entry}
                      </div>
                    ))}
                  </div>
                )}

                {activeWaypoint.data.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activeWaypoint.data.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-[10px] font-mono border border-green/40 text-green bg-green/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {activeWaypoint.data.projects && (
                  <div className="space-y-1.5 mb-4">
                    {activeWaypoint.data.projects.map(p => (
                      <div key={p.name} className="flex justify-between text-xs font-mono p-2 bg-white/5 border border-white/10">
                        <span className="text-white">{p.name}</span>
                        <span className="text-green">{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeWaypoint.data.links && (
                  <div className="flex gap-2 flex-wrap">
                    {activeWaypoint.data.links.map(link => (
                      <Link
                        key={link.name}
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                        className="px-3 py-1.5 text-xs font-mono border border-orange/40 text-orange hover:bg-orange/10 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}

                {activeWaypoint.link && (
                  <Link
                    href={activeWaypoint.link}
                    className={`block mt-4 text-center py-2.5 border border-${activeWaypoint.color}/50 text-${activeWaypoint.color} text-xs font-mono hover:bg-white/5 transition-colors tracking-wider`}
                  >
                    DOCK →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* BOTTOM HUD - Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
            <div className="flex justify-between items-end p-3 sm:p-4 md:p-6 gap-2">
              {/* Left - Controls info */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 sm:p-3 text-[10px] sm:text-xs font-mono pointer-events-auto">
                <div className="text-white/60 mb-1 hidden sm:block">HOLD <span className="text-cyan">SPACE</span> OR <span className="text-cyan">CLICK</span></div>
                <div className="text-cyan sm:hidden">TAP TO FLY</div>
                <Link href="/" className="block mt-1 sm:mt-2 text-orange hover:text-orange/80 transition-colors text-[10px] sm:text-xs">
                  ← ABORT
                </Link>
              </div>

              {/* Center - Thrust indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                    isThrusting
                      ? 'border-orange bg-orange/20 scale-110'
                      : 'border-white/20 bg-white/5'
                  }`}
                  style={isThrusting ? { boxShadow: '0 0 30px rgba(255,150,0,0.5)' } : {}}
                >
                  <span className={`text-xl sm:text-2xl md:text-3xl transition-transform ${isThrusting ? 'scale-110' : ''}`}>
                    {isThrusting ? '🔥' : '▲'}
                  </span>
                </div>
                <div className={`text-[9px] sm:text-[10px] font-mono mt-1 sm:mt-2 tracking-wider ${isThrusting ? 'text-orange' : 'text-white/40'}`}>
                  {isThrusting ? 'THRUST' : 'IDLE'}
                </div>
              </div>

              {/* Right - Journey progress */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 sm:p-3 min-w-[70px] sm:min-w-[100px] md:min-w-[130px]">
                <div className="text-[8px] sm:text-[9px] font-mono text-white/40 mb-1 sm:mb-2 tracking-widest">PROGRESS</div>
                <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden mb-1 sm:mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-green rounded-full transition-all duration-100"
                    style={{ width: `${journeyProgress}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-mono text-cyan font-bold">{journeyProgress.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Waypoint timeline indicator */}
          <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden sm:block">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />

              {waypoints.map((wp, i) => {
                const isPassed = journeyProgress >= wp.distance;
                const isCurrent = currentWaypoint === i;

                return (
                  <div
                    key={wp.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCurrent
                          ? `border-${wp.color} bg-${wp.color}/30`
                          : isPassed
                            ? 'border-green bg-green/30'
                            : 'border-white/20 bg-black'
                      }`}
                      style={isCurrent ? { boxShadow: `0 0 10px var(--neon-${wp.color})` } : {}}
                    >
                      {isPassed && <span className="text-[8px] text-green">✓</span>}
                    </div>
                    <span
                      className={`text-[9px] font-mono tracking-wider transition-colors ${
                        isCurrent ? `text-${wp.color}` : isPassed ? 'text-white/60' : 'text-white/30'
                      }`}
                    >
                      {wp.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* JOURNEY COMPLETE */}
      {phase === 'complete' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/95 animate-fade-in px-6 sm:px-8">
          <div className="text-center w-full max-w-md">
            {/* Success icon - responsive size */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-full border-2 border-green flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(0,255,136,0.3)' }}>
              <span className="text-2xl sm:text-3xl md:text-4xl">✓</span>
            </div>

            {/* Label */}
            <div className="text-[9px] sm:text-[10px] font-mono text-white/40 tracking-[0.2em] sm:tracking-[0.3em] mb-2">
              MISSION COMPLETE
            </div>

            {/* Title - responsive text that won't overflow */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-white mb-2 tracking-wide sm:tracking-wider whitespace-nowrap">
              VOYAGE SUCCESSFUL
            </h1>

            {/* Mission time */}
            <p className="text-white/50 font-mono text-xs sm:text-sm mb-6 sm:mb-8">
              Mission elapsed time: {missionTime}
            </p>

            {/* Action buttons - responsive layout */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pointer-events-auto">
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-5 py-2 sm:py-2.5 border border-cyan/50 text-cyan font-mono text-xs sm:text-sm hover:bg-cyan/10 transition-colors tracking-wider"
              >
                RESTART
              </button>
              <Link
                href="/projects"
                className="px-4 sm:px-5 py-2 sm:py-2.5 border border-green/50 text-green font-mono text-xs sm:text-sm hover:bg-green/10 transition-colors tracking-wider"
              >
                PROJECTS
              </Link>
              <Link
                href="/"
                className="px-4 sm:px-5 py-2 sm:py-2.5 border border-white/30 text-white/70 font-mono text-xs sm:text-sm hover:bg-white/5 transition-colors tracking-wider"
              >
                HOME
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subtle scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02] scanline" />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1px, -1px); }
          20% { transform: translate(1px, 1px); }
          30% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, 0); }
          60% { transform: translate(1px, 0); }
          70% { transform: translate(0, -1px); }
          80% { transform: translate(0, 1px); }
          90% { transform: translate(-1px, -1px); }
        }
        .animate-shake {
          animation: shake 0.1s infinite;
        }
      `}</style>
    </div>
  );
}
