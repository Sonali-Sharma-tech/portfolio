"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Journey waypoints - each destination in the voyage
const journeyWaypoints = [
  {
    id: 'launch',
    title: 'LAUNCHING FROM HOME BASE',
    subtitle: 'INITIATING WARP SEQUENCE',
    duration: 1500,
    color: 'cyan',
  },
  {
    id: 'projects',
    title: 'ENTERING MISSION SECTOR',
    subtitle: 'SCANNING COMPLETED MISSIONS',
    destination: '/projects',
    duration: 2000,
    color: 'magenta',
    stats: [
      { label: 'MISSIONS COMPLETED', value: '10+' },
      { label: 'TECH DEPLOYED', value: '15+' },
      { label: 'SUCCESS RATE', value: '100%' },
    ],
  },
  {
    id: 'career',
    title: 'TRAVERSING CAREER NEBULA',
    subtitle: 'MAPPING EXPERIENCE COORDINATES',
    duration: 1800,
    color: 'green',
    stats: [
      { label: 'CYCLES ACTIVE', value: '5+' },
      { label: 'STATIONS VISITED', value: '5' },
      { label: 'CURRENT RANK', value: 'SDE III' },
    ],
  },
  {
    id: 'skills',
    title: 'LOADING SKILL MODULES',
    subtitle: 'QUANTUM CORES ONLINE',
    duration: 1500,
    color: 'cyan',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL', 'MongoDB'],
  },
  {
    id: 'arrival',
    title: 'DESTINATION REACHED',
    subtitle: 'WELCOME TO THE MISSION CENTER',
    duration: 1200,
    color: 'green',
  },
];

// ASCII art for different journey phases
const spaceshipFrames = [
  // Frame 1 - Launch
  `
        ▲
       ╱█╲
      ╱███╲
     ╱█████╲
    ╱ ═══════ ╲
   ╱───────────╲
  ╱─────────────╲
      ║   ║
      ║   ║
     ╔═════╗
     ║ ◉ ◉ ║
     ╚═════╝
       ▼▼▼
       ▼▼▼
       ▼▼▼
  `,
  // Frame 2 - Warp speed
  `
        ▲
       ╱█╲
      ╱███╲
     ╔═════╗
     ║◉═══◉║
     ╚═════╝
════════════════════
════════════════════
════════════════════
════════════════════
  `,
];

interface HyperspaceJourneyProps {
  isActive: boolean;
  onComplete: () => void;
  targetPath?: string;
}

export function HyperspaceJourney({ isActive, onComplete, targetPath = '/projects' }: HyperspaceJourneyProps) {
  const router = useRouter();
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'launch' | 'warp' | 'travel' | 'arrive' | 'complete'>('idle');
  const [warpLines, setWarpLines] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);
  const [countdown, setCountdown] = useState(3);
  const [showStats, setShowStats] = useState(false);

  // Generate warp lines
  useEffect(() => {
    if (phase === 'warp' || phase === 'travel') {
      const lines = [];
      for (let i = 0; i < 100; i++) {
        lines.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.5}s`,
          duration: `${0.3 + Math.random() * 0.5}s`,
        });
      }
      setWarpLines(lines);
    }
  }, [phase]);

  // Main journey controller
  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      setCurrentWaypoint(0);
      setCountdown(3);
      return;
    }

    // Start the journey sequence
    setPhase('launch');
    setCountdown(3);

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    // After countdown, start warp
    const warpTimeout = setTimeout(() => {
      setPhase('warp');
    }, 2500);

    // Begin traveling through waypoints
    const travelTimeout = setTimeout(() => {
      setPhase('travel');
      setCurrentWaypoint(1);
    }, 4000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(warpTimeout);
      clearTimeout(travelTimeout);
    };
  }, [isActive]);

  // Progress through waypoints
  useEffect(() => {
    if (phase !== 'travel') return;

    const waypoint = journeyWaypoints[currentWaypoint];
    if (!waypoint) return;

    // Show stats for this waypoint
    setShowStats(true);
    const hideStatsTimeout = setTimeout(() => setShowStats(false), waypoint.duration - 400);

    // Move to next waypoint or complete
    const nextTimeout = setTimeout(() => {
      if (currentWaypoint < journeyWaypoints.length - 1) {
        setCurrentWaypoint(prev => prev + 1);
      } else {
        setPhase('arrive');
        // Navigate after arrival animation
        setTimeout(() => {
          router.push(targetPath);
          setTimeout(() => {
            setPhase('complete');
            onComplete();
          }, 500);
        }, 1500);
      }
    }, waypoint.duration);

    return () => {
      clearTimeout(hideStatsTimeout);
      clearTimeout(nextTimeout);
    };
  }, [phase, currentWaypoint, router, targetPath, onComplete]);

  // Skip on click/key
  const handleSkip = useCallback(() => {
    router.push(targetPath);
    onComplete();
  }, [router, targetPath, onComplete]);

  if (!isActive && phase === 'idle') return null;

  const currentWaypointData = journeyWaypoints[currentWaypoint];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-space-void overflow-hidden cursor-pointer"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Escape' && handleSkip()}
    >
      {/* Skip hint */}
      <div className="absolute top-4 right-4 text-xs font-mono text-text-muted/50 animate-pulse">
        [CLICK TO SKIP]
      </div>

      {/* Warp speed lines */}
      {(phase === 'warp' || phase === 'travel') && (
        <div className="absolute inset-0 overflow-hidden">
          {warpLines.map((line) => (
            <div
              key={line.id}
              className="absolute top-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent animate-warp-line"
              style={{
                left: line.left,
                animationDelay: line.delay,
                animationDuration: line.duration,
                width: `${50 + Math.random() * 150}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Star tunnel effect */}
      {(phase === 'warp' || phase === 'travel') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_60px_30px_rgba(0,255,245,0.3)]" />
          <div className="absolute w-[200vmax] h-[200vmax] border border-cyan/20 rounded-full animate-tunnel-expand" />
          <div className="absolute w-[200vmax] h-[200vmax] border border-magenta/20 rounded-full animate-tunnel-expand" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-[200vmax] h-[200vmax] border border-green/20 rounded-full animate-tunnel-expand" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Main content container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        {/* Launch phase - Countdown */}
        {phase === 'launch' && (
          <div className="text-center animate-fade-in">
            <pre className="text-cyan/60 text-xs leading-tight mb-8 hidden sm:block">
              {spaceshipFrames[0]}
            </pre>
            <div className="text-8xl sm:text-9xl font-display font-bold text-gradient-cyber animate-pulse mb-4">
              {countdown > 0 ? countdown : 'GO'}
            </div>
            <div className="text-xl sm:text-2xl font-mono text-cyan animate-pulse">
              {countdown > 0 ? 'INITIATING LAUNCH SEQUENCE' : 'ENGINES IGNITED'}
            </div>
            <div className="mt-8 flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    4 - countdown >= i ? 'bg-green shadow-[0_0_20px_5px_rgba(0,255,136,0.5)]' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Warp phase - Speed effect */}
        {phase === 'warp' && (
          <div className="text-center animate-fade-in">
            <div className="text-4xl sm:text-6xl font-display font-bold text-white mb-4 animate-shake">
              ENTERING HYPERSPACE
            </div>
            <div className="text-lg font-mono text-cyan animate-pulse">
              WARP DRIVE ENGAGED
            </div>
            <div className="mt-8 w-64 h-2 bg-border/30 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-cyan via-magenta to-green animate-progress-fill" />
            </div>
          </div>
        )}

        {/* Travel phase - Waypoints */}
        {phase === 'travel' && currentWaypointData && (
          <div className="text-center max-w-2xl mx-auto animate-fade-in" key={currentWaypoint}>
            {/* Waypoint indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {journeyWaypoints.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i < currentWaypoint
                      ? 'bg-green'
                      : i === currentWaypoint
                      ? `bg-${currentWaypointData.color} shadow-[0_0_20px_5px_rgba(0,255,245,0.5)] animate-pulse`
                      : 'bg-border/30'
                  }`}
                />
              ))}
            </div>

            {/* Current waypoint info */}
            <div
              className={`text-xs font-mono tracking-[0.5em] mb-4 text-${currentWaypointData.color}/70`}
            >
              WAYPOINT {currentWaypoint + 1} OF {journeyWaypoints.length}
            </div>

            <h2 className={`text-3xl sm:text-5xl font-display font-bold mb-4 text-${currentWaypointData.color}`}>
              {currentWaypointData.title}
            </h2>

            <p className="text-lg font-mono text-text-secondary mb-8">
              {currentWaypointData.subtitle}
            </p>

            {/* Stats display */}
            {currentWaypointData.stats && showStats && (
              <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
                {currentWaypointData.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="p-4 border border-border bg-space-surface/50 backdrop-blur-sm"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={`text-2xl sm:text-3xl font-mono font-bold text-${currentWaypointData.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-mono text-text-muted mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills display */}
            {currentWaypointData.skills && showStats && (
              <div className="flex flex-wrap justify-center gap-3 animate-slide-up">
                {currentWaypointData.skills.map((skill, i) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 border font-mono text-sm
                      ${i % 3 === 0 ? 'border-cyan/50 text-cyan bg-cyan/10' :
                        i % 3 === 1 ? 'border-magenta/50 text-magenta bg-magenta/10' :
                        'border-green/50 text-green bg-green/10'
                      }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            <div className="mt-8 w-48 h-1 bg-border/30 rounded-full overflow-hidden mx-auto">
              <div
                className={`h-full bg-${currentWaypointData.color} animate-progress-fill`}
                style={{ animationDuration: `${currentWaypointData.duration}ms` }}
              />
            </div>
          </div>
        )}

        {/* Arrival phase */}
        {phase === 'arrive' && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl sm:text-8xl mb-8 animate-bounce">
              🚀
            </div>
            <div className="text-4xl sm:text-6xl font-display font-bold text-gradient-cyber mb-4">
              DESTINATION REACHED
            </div>
            <div className="text-lg font-mono text-green animate-pulse">
              DOCKING SEQUENCE INITIATED...
            </div>
          </div>
        )}
      </div>

      {/* Cockpit frame overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-space-void to-transparent">
          <div className="flex items-center justify-between h-full px-4 sm:px-8 text-xs font-mono text-text-muted/60">
            <div className="flex items-center gap-4">
              <span className="text-cyan">◈ VELOCITY: MAXIMUM</span>
              <span className="hidden sm:inline text-magenta">◈ SHIELDS: 100%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-green">◈ FUEL: OPTIMAL</span>
              <span className="text-cyan animate-pulse">◈ NAV: {targetPath.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-space-void to-transparent">
          <div className="flex items-center justify-center h-full px-4 text-xs font-mono text-text-muted/40">
            <span>SPACECRAFT_NAVIGATION_SYSTEM v3.0</span>
          </div>
        </div>

        {/* Side frames */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-space-void to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-space-void to-transparent" />

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan/30" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan/30" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-magenta/30" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-magenta/30" />
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] scanline" />

      {/* Inline keyframe styles */}
      <style jsx>{`
        @keyframes warp-line {
          0% {
            transform: translateY(-50%) translateX(-100vw) scaleX(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(100vw) scaleX(3);
            opacity: 0;
          }
        }
        .animate-warp-line {
          animation: warp-line 0.5s linear infinite;
        }
        @keyframes tunnel-expand {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .animate-tunnel-expand {
          animation: tunnel-expand 2s ease-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-5px); }
          20% { transform: translateX(5px); }
          30% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          50% { transform: translateX(-3px); }
          60% { transform: translateX(3px); }
          70% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          90% { transform: translateX(-1px); }
        }
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fill {
          animation: progress-fill 1.5s ease-out forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
