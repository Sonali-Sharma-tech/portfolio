"use client";

import { useEffect, useState } from "react";

// Parallax Starfield - multiple layers at different speeds
function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="stars stars-small" />
      <div className="stars stars-medium" />
      <div className="stars stars-large" />
    </div>
  );
}

// Nebula clouds - subtle colored fog
function Nebula() {
  return <div className="nebula" aria-hidden="true" />;
}

// Matrix column type
interface MatrixColumn {
  id: number;
  left: string;
  delay: string;
  duration: string;
  text: string;
}

// Matrix-style code rain with space characters
function MatrixRain() {
  const [columns, setColumns] = useState<MatrixColumn[]>([]);

  // Generate columns only on client side to avoid hydration mismatch
  useEffect(() => {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const cols: MatrixColumn[] = [];

    for (let i = 0; i < 30; i++) {
      const text = Array.from(
        { length: 20 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");

      cols.push({
        id: i,
        left: `${(i / 30) * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${8 + Math.random() * 12}s`,
        text,
      });
    }

    setColumns(cols);
  }, []);

  // Don't render until client-side generation is complete
  if (columns.length === 0) {
    return <div className="matrix-rain" aria-hidden="true" />;
  }

  return (
    <div className="matrix-rain" aria-hidden="true">
      {columns.map((col) => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: col.left,
            animationDelay: col.delay,
            animationDuration: col.duration,
          }}
        >
          {col.text}
        </div>
      ))}
    </div>
  );
}

// Floating space objects removed - they were distracting from the main terminal UI

// Shooting stars - occasional streaks
function ShootingStars() {
  useEffect(() => {
    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "shooting-star";
      star.style.cssText = `
        position: fixed;
        top: ${Math.random() * 50}%;
        left: ${Math.random() * 100}%;
        width: ${50 + Math.random() * 100}px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00fff5, transparent);
        transform: rotate(${-30 + Math.random() * 20}deg);
        animation: shoot 1s ease-out forwards;
        pointer-events: none;
        z-index: -1;
      `;

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1000);
    };

    // Add shooting star animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shoot {
        0% {
          opacity: 1;
          transform: translateX(0) translateY(0) rotate(-30deg);
        }
        100% {
          opacity: 0;
          transform: translateX(300px) translateY(200px) rotate(-30deg);
        }
      }
    `;
    document.head.appendChild(style);

    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      style.remove();
    };
  }, []);

  return null;
}

export function SpaceEffects() {
  return (
    <>
      <Starfield />
      <Nebula />
      <MatrixRain />
      <ShootingStars />
    </>
  );
}
