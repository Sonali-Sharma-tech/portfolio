"use client";

import { useEffect } from "react";

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

// Enhanced shooting stars - beautiful meteor streaks across the sky
function ShootingStars() {
  useEffect(() => {
    // Color palette for variety - matches our cyberpunk theme
    const colors = [
      { main: "#00fff5", glow: "rgba(0, 255, 245, 0.6)" },   // Cyan
      { main: "#ffffff", glow: "rgba(255, 255, 255, 0.5)" }, // White
      { main: "#ff00ff", glow: "rgba(255, 0, 255, 0.4)" },   // Magenta (rare)
    ];

    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "shooting-star";

      // Random properties for variety
      const startX = Math.random() * 100;
      const startY = Math.random() * 60; // Keep in upper portion of screen
      const length = 80 + Math.random() * 120;
      const duration = 0.8 + Math.random() * 0.6;
      const angle = -25 + Math.random() * 15; // Slight angle variation

      // Mostly white/cyan, occasionally magenta
      const colorChoice = Math.random();
      const color = colorChoice > 0.15
        ? (colorChoice > 0.5 ? colors[0] : colors[1])
        : colors[2];

      star.style.cssText = `
        position: fixed;
        top: ${startY}%;
        left: ${startX}%;
        width: ${length}px;
        height: 2px;
        background: linear-gradient(90deg, ${color.main}, ${color.glow}, transparent);
        transform: rotate(${angle}deg);
        animation: shootingStar ${duration}s ease-out forwards;
        pointer-events: none;
        z-index: 0;
        border-radius: 2px;
        box-shadow: 0 0 6px ${color.glow}, 0 0 12px ${color.glow};
      `;

      // Create a small bright head for the meteor
      const head = document.createElement("div");
      head.style.cssText = `
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: ${color.main};
        border-radius: 50%;
        box-shadow: 0 0 8px ${color.main}, 0 0 16px ${color.glow};
      `;
      star.appendChild(head);

      document.body.appendChild(star);
      setTimeout(() => star.remove(), duration * 1000 + 100);
    };

    // Add shooting star animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shootingStar {
        0% {
          opacity: 0;
          transform: translateX(0) translateY(0) rotate(-25deg) scaleX(0.3);
        }
        10% {
          opacity: 1;
          transform: translateX(20px) translateY(15px) rotate(-25deg) scaleX(1);
        }
        100% {
          opacity: 0;
          transform: translateX(350px) translateY(250px) rotate(-25deg) scaleX(0.5);
        }
      }
    `;
    document.head.appendChild(style);

    // Create shooting stars more frequently for a livelier effect
    // Staggered intervals for natural feel
    const createWithRandomDelay = () => {
      const delay = 1500 + Math.random() * 2500; // 1.5-4 seconds
      setTimeout(() => {
        createShootingStar();
        createWithRandomDelay();
      }, delay);
    };

    // Start multiple "threads" for overlapping stars
    createWithRandomDelay();
    setTimeout(() => createWithRandomDelay(), 800);

    return () => {
      style.remove();
      // Clean up any remaining stars
      document.querySelectorAll(".shooting-star").forEach((el) => el.remove());
    };
  }, []);

  return null;
}

export function SpaceEffects() {
  return (
    <>
      <Starfield />
      <ShootingStars />
    </>
  );
}
