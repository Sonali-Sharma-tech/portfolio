"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Boot sequence phases for a spacecraft terminal
const bootSequence = [
  { phase: 'init', lines: ['INITIALIZING NEURAL INTERFACE...', 'ESTABLISHING QUANTUM LINK...'] },
  { phase: 'connect', lines: ['CONNECTION ESTABLISHED', 'LOADING PILOT PROFILE...'] },
];

const terminalLines = [
  { type: 'system', text: '◈ PILOT IDENTIFICATION VERIFIED' },
  { type: 'label', text: 'CALLSIGN:' },
  { type: 'name', text: 'SONALI SHARMA' },
  { type: 'label', text: 'DESIGNATION:' },
  { type: 'role', text: 'FULLSTACK ENGINEER' },
  { type: 'label', text: 'MISSION:' },
  { type: 'mission', text: 'Building tools developers actually want to use' },
  { type: 'divider', text: '═' },
  { type: 'system', text: '◈ LOADING SKILL MODULES...' },
  { type: 'skills', text: 'React|TypeScript|Next.js|Node.js|GraphQL' },
  { type: 'divider', text: '═' },
  { type: 'success', text: '▲ SYSTEMS ONLINE ▲ READY FOR DEPLOYMENT' },
];

// ASCII art spacecraft
const spacecraftArt = `
     ╱╲
    ╱  ╲
   ╱ ◉◉ ╲
  ╱──────╲
 ╱________╲
   ╲    ╱
    ╲  ╱
     ▼▼
`;

export function TerminalHero() {
  const [bootPhase, setBootPhase] = useState(0);
  const [bootLineIndex, setBootLineIndex] = useState(0);
  const [showMain, setShowMain] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: '00.0000', y: '00.0000' });
  const [systemTime, setSystemTime] = useState('00:00:00');
  const [signal, setSignal] = useState(85);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // System time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toTimeString().slice(0, 8));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate coordinate changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates({
        x: (Math.random() * 90 + 10).toFixed(4),
        y: (Math.random() * 90 + 10).toFixed(4),
      });
      setSignal(Math.floor(Math.random() * 15) + 85);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence animation
  useEffect(() => {
    if (bootPhase >= bootSequence.length) {
      setTimeout(() => setShowMain(true), 400);
      return;
    }

    const currentPhase = bootSequence[bootPhase];
    if (bootLineIndex < currentPhase.lines.length) {
      const timeout = setTimeout(() => {
        setBootLineIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setBootPhase(prev => prev + 1);
        setBootLineIndex(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [bootPhase, bootLineIndex]);

  // Main content reveal
  useEffect(() => {
    if (!showMain) return;

    if (visibleLines < terminalLines.length) {
      const line = terminalLines[visibleLines];
      const delay = line.type === 'divider' ? 100 :
                    line.type === 'name' || line.type === 'role' ? 400 :
                    line.type === 'skills' ? 300 : 200;

      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowCTA(true), 500);
    }
  }, [showMain, visibleLines]);

  const renderBootSequence = () => {
    const allBootLines: string[] = [];
    for (let i = 0; i < bootPhase; i++) {
      allBootLines.push(...bootSequence[i].lines);
    }
    if (bootPhase < bootSequence.length) {
      allBootLines.push(...bootSequence[bootPhase].lines.slice(0, bootLineIndex));
    }

    return (
      <div className="font-mono text-xs sm:text-sm text-cyan/80 space-y-1">
        {allBootLines.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-green">▸</span>
            <span className={i === allBootLines.length - 1 ? 'animate-pulse' : ''}>
              {line}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-green">▸</span>
          <span
            className={`inline-block w-2 h-4 bg-cyan transition-opacity ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    );
  };

  const renderLine = (line: typeof terminalLines[0], index: number) => {
    switch (line.type) {
      case 'system':
        return (
          <div key={index} className="text-cyan/70 text-xs sm:text-sm font-mono mb-2">
            {line.text}
          </div>
        );
      case 'label':
        return (
          <div key={index} className="text-text-muted text-xs font-mono tracking-[0.3em] mt-4 mb-1">
            {line.text}
          </div>
        );
      case 'name':
        return (
          <div
            key={index}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight glitch-text"
            data-text={line.text}
          >
            <span className="text-gradient-cyber">{line.text}</span>
          </div>
        );
      case 'role':
        return (
          <div key={index} className="text-xl sm:text-2xl md:text-3xl font-display text-white/60 mb-2">
            {line.text}
          </div>
        );
      case 'mission':
        return (
          <div key={index} className="text-text-secondary text-sm sm:text-base max-w-md">
            {line.text}
          </div>
        );
      case 'divider':
        return (
          <div key={index} className="text-cyan/20 text-xs font-mono my-4 overflow-hidden">
            {'═'.repeat(50)}
          </div>
        );
      case 'skills':
        return (
          <div key={index} className="flex flex-wrap gap-2 my-3">
            {line.text.split('|').map((skill, i) => (
              <span
                key={skill}
                className={`px-3 py-1 text-sm font-mono border rounded-sm backdrop-blur-sm
                  ${i % 3 === 0 ? 'border-cyan/50 text-cyan bg-cyan/5' :
                    i % 3 === 1 ? 'border-magenta/50 text-magenta bg-magenta/5' :
                    'border-green/50 text-green bg-green/5'
                  } hover:scale-105 transition-transform cursor-default`}
              >
                {skill}
              </span>
            ))}
          </div>
        );
      case 'success':
        return (
          <div key={index} className="flex items-center gap-3 mt-6 pt-4 border-t border-green/30">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            <span className="text-green font-mono text-sm font-bold tracking-wider">
              {line.text}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="hero relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Terminal Interface */}
          <div className="terminal-card relative">
            {/* Terminal Header - Spacecraft Console */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
              </div>
              <span className="terminal-title">SPACECRAFT_CONSOLE v2.4.7</span>
              <div className="ml-auto flex items-center gap-4 text-[10px] font-mono">
                <span className="text-cyan/60">SIG: <span className="text-cyan">{signal}%</span></span>
                <span className="text-magenta/60">LAT: <span className="text-magenta">{coordinates.x}°</span></span>
                <span className="text-green/60">LONG: <span className="text-green">{coordinates.y}°</span></span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="terminal-body min-h-[450px] sm:min-h-[500px] relative">
              {/* Scanline effect overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanline" />

              {/* Boot sequence or main content */}
              {!showMain ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  {/* ASCII Spacecraft */}
                  <pre className="text-cyan/40 text-xs leading-tight mb-6 hidden sm:block">
                    {spacecraftArt}
                  </pre>
                  <div className="w-full max-w-md px-4">
                    {renderBootSequence()}
                  </div>
                  {/* Loading bar */}
                  <div className="mt-8 w-48 h-1 bg-border/30 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan via-magenta to-green transition-all duration-500"
                      style={{
                        width: `${((bootPhase * 2 + bootLineIndex) / (bootSequence.length * 2)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  {/* Render visible lines */}
                  {terminalLines.slice(0, visibleLines).map((line, i) => renderLine(line, i))}

                  {/* Typing cursor while revealing */}
                  {visibleLines < terminalLines.length && (
                    <span
                      className={`inline-block w-2 h-4 bg-cyan transition-opacity ${
                        cursorVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* CTA Buttons - Glassmorphism */}
                  <div className={`mt-10 flex flex-wrap gap-4 transition-all duration-700 ${
                    showCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <Link href="/journey" className="btn-glass btn-glass-lg group">
                      <span>🚀 LAUNCH VOYAGE</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link href="/projects" className="btn-glass-ghost group">
                      <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>EXPLORE_MISSIONS</span>
                    </Link>
                    <Link href="/about" className="btn-glass-ghost group">
                      <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>PILOT_PROFILE</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar - Spacecraft telemetry */}
            <div className="px-4 py-2 border-t border-cyan/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-text-muted/60 bg-space-void/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                  <span className="text-green/80">ONLINE</span>
                </span>
                <span className="text-border">│</span>
                <span>EXP: 3+ CYCLES</span>
                <span className="text-border">│</span>
                <span>MISSIONS: 10+</span>
                <span className="text-border">│</span>
                <span className="text-cyan/70">STATUS: OPEN TO COLLABORATE</span>
              </div>
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning className="text-magenta/60">{systemTime}</span>
                <span className="text-border">UTC</span>
              </div>
            </div>
          </div>

          {/* Ambient glow effects */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan/5 via-transparent to-magenta/5 blur-3xl" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-green/5 via-transparent to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  );
}
