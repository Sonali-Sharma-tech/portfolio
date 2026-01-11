"use client";

import { useEffect, useState, useCallback } from "react";

interface Trail {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const COLORS = ["#7c3aed", "#ec4899", "#06b6d4", "#f97316", "#84cc16"];

export function CursorEffects() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse position
  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Add trail
      setTrails((prev) => [
        ...prev.slice(-15),
        { id: trailId++, x: e.clientX, y: e.clientY },
      ]);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("bento-card");
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Click explosion
    const handleClick = (e: MouseEvent) => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const speed = 3 + Math.random() * 4;
        newParticles.push({
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // gravity
            life: p.life - 0.03,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  // Fade out trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        className={`cursor-custom ${isHovering ? "cursor-hovering" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div
          className="cursor-dot"
          style={{
            transform: `scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
            transition: "transform 0.15s ease-out",
          }}
        />
        <div className="cursor-ring" />
      </div>

      {/* Cursor trails */}
      {trails.map((trail, i) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x,
            top: trail.y,
            width: 6 + (i / trails.length) * 4,
            height: 6 + (i / trails.length) * 4,
            opacity: (i / trails.length) * 0.4,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Click particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="click-particle"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
            background: particle.color,
            transform: `translate(-50%, -50%) scale(${particle.life})`,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
    </>
  );
}
