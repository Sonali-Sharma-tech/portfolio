"use client";

import { useEffect, useMemo } from "react";

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

// Matrix-style code rain with space characters
function MatrixRain() {
  const columns = useMemo(() => {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const cols = [];

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

    return cols;
  }, []);

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

// Floating astronaut/rocket decorations
function FloatingSpaceObjects() {
  return (
    <>
      {/* Floating astronaut - top right */}
      <div
        className="astronaut hidden lg:block"
        style={{ top: "15%", right: "10%" }}
        aria-hidden="true"
      >
        🧑‍🚀
      </div>

      {/* Floating rocket - bottom left */}
      <div
        className="astronaut hidden lg:block"
        style={{
          bottom: "20%",
          left: "5%",
          fontSize: "4rem",
          animationDelay: "-10s",
          animationDuration: "25s"
        }}
        aria-hidden="true"
      >
        🚀
      </div>

      {/* Satellite - mid left */}
      <div
        className="astronaut hidden xl:block"
        style={{
          top: "40%",
          left: "3%",
          fontSize: "3rem",
          animationDelay: "-5s",
          animationDuration: "30s",
          opacity: 0.05
        }}
        aria-hidden="true"
      >
        🛸
      </div>
    </>
  );
}

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
      <FloatingSpaceObjects />
      <ShootingStars />
    </>
  );
}
