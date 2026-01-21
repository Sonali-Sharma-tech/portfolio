"use client";

import { useEffect, useState, useRef } from "react";

// Cinematic intro overlay with warp effect
function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start fade out after intro animation
    const fadeTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 1200);

    // Remove from DOM after animation
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`intro-overlay ${isAnimating ? "active" : "fade-out"}`}
      aria-hidden="true"
    >
      <div className="intro-content">
        <div className="intro-logo">S_</div>
        <div className="intro-line" />
        <div
          className="text-xs tracking-[0.3em] text-text-muted uppercase mt-4"
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: "opacity 0.5s ease",
            fontFamily: "var(--font-fira)"
          }}
        >
          INITIALIZING TERMINAL...
        </div>
      </div>
    </div>
  );
}

// CRT scanline overlay
function CRTOverlay() {
  return <div className="crt-overlay" aria-hidden="true" />;
}

// Smooth cursor glow that follows mouse
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on devices with fine pointer (not touch)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) {
      // Hide the container if no pointer
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth follow with lerp
    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div ref={glowRef} className="cursor-glow-ambient" aria-hidden="true" />
    </div>
  );
}

// Glitch effect on interactive elements
function GlitchEnhancer() {
  useEffect(() => {
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      target.classList.add("glitch-hover");
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      target.classList.remove("glitch-hover");
    };

    // Add glitch effect to headings on hover
    const headings = document.querySelectorAll("h1, h2");
    headings.forEach((heading) => {
      heading.addEventListener("mouseenter", handleMouseEnter);
      heading.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("mouseenter", handleMouseEnter);
        heading.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return null;
}

// Holographic shimmer on cards
function HoloEffect() {
  useEffect(() => {
    const cards = document.querySelectorAll(".holo-card, .bento-card");

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      target.style.setProperty("--mouse-x", `${x}%`);
      target.style.setProperty("--mouse-y", `${y}%`);
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove as EventListener);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove as EventListener);
      });
    };
  }, []);

  return null;
}

// Random glitch effect that occurs occasionally
function RandomGlitch() {
  useEffect(() => {
    let glitchTimeout: NodeJS.Timeout;

    const triggerGlitch = () => {
      const body = document.body;
      body.style.filter = "hue-rotate(10deg) brightness(1.1)";

      setTimeout(() => {
        body.style.filter = "";
      }, 50);

      // Schedule next glitch
      glitchTimeout = setTimeout(triggerGlitch, 5000 + Math.random() * 15000);
    };

    // Start after a delay
    glitchTimeout = setTimeout(triggerGlitch, 8000);

    return () => clearTimeout(glitchTimeout);
  }, []);

  return null;
}

// Typing sound effect simulation (visual only)
function TypingIndicator() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => {
      setIsTyping(true);
    };

    const handleKeyUp = () => {
      setTimeout(() => setIsTyping(false), 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  if (!isTyping) return null;

  return (
    <div
      className="fixed bottom-4 right-4 px-3 py-1 bg-space-surface border border-cyan/30 text-xs font-mono text-cyan z-50"
      aria-hidden="true"
    >
      ▌ INPUT DETECTED
    </div>
  );
}

export function CyberEffects() {
  return (
    <>
      <IntroOverlay />
      <CRTOverlay />
      <CursorGlow />
      <GlitchEnhancer />
      <HoloEffect />
      <RandomGlitch />
      <TypingIndicator />
    </>
  );
}
