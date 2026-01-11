"use client";

import { useEffect, useState, useRef } from "react";

// Cinematic intro overlay that fades out
function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start fade out after a brief moment
    const fadeTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    // Remove from DOM after animation
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

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
        <div className="intro-logo">S</div>
        <div className="intro-line" />
      </div>
    </div>
  );
}

// Smooth cursor glow that follows mouse
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on devices with fine pointer (not touch)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setIsVisible(true);

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth follow with lerp
    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isVisible) return null;

  return <div ref={glowRef} className="cursor-glow-ambient" aria-hidden="true" />;
}

// Magnetic effect for interactive elements
function MagneticElements() {
  useEffect(() => {
    const magneticElements = document.querySelectorAll(".btn-magic, .bento-card");

    const handleMouseMove = (e: MouseEvent, element: Element) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;

      (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = (element: Element) => {
      (element as HTMLElement).style.transform = "";
    };

    magneticElements.forEach((el) => {
      const moveHandler = (e: Event) => handleMouseMove(e as MouseEvent, el);
      const leaveHandler = () => handleMouseLeave(el);

      el.addEventListener("mousemove", moveHandler);
      el.addEventListener("mouseleave", leaveHandler);

      // Store handlers for cleanup
      (el as HTMLElement).dataset.hasMagnetic = "true";
    });

    return () => {
      magneticElements.forEach((el) => {
        if ((el as HTMLElement).dataset.hasMagnetic) {
          el.removeEventListener("mousemove", () => {});
          el.removeEventListener("mouseleave", () => {});
        }
      });
    };
  }, []);

  return null;
}

// Parallax tilt effect on cards
function TiltEffect() {
  useEffect(() => {
    const cards = document.querySelectorAll(".bento-card, .glass-card");

    const handleMouseMove = (e: MouseEvent, element: Element) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      (element as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = (element: Element) => {
      (element as HTMLElement).style.transform = "";
    };

    cards.forEach((card) => {
      const moveHandler = (e: Event) => handleMouseMove(e as MouseEvent, card);
      const leaveHandler = () => handleMouseLeave(card);

      card.addEventListener("mousemove", moveHandler);
      card.addEventListener("mouseleave", leaveHandler);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return null;
}

// Ripple effect on click
function RippleEffect() {
  useEffect(() => {
    const createRipple = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only apply to buttons and cards
      if (!target.closest(".btn-magic, .btn-ghost, .bento-card")) return;

      const button = target.closest(".btn-magic, .btn-ghost, .bento-card") as HTMLElement;
      const rect = button.getBoundingClientRect();

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    document.addEventListener("click", createRipple);
    return () => document.removeEventListener("click", createRipple);
  }, []);

  return null;
}

// Text reveal on scroll
function ScrollRevealEnhancer() {
  useEffect(() => {
    // Add stagger delays to scroll-reveal elements
    const revealElements = document.querySelectorAll(".scroll-reveal, .scroll-slide-left, .scroll-slide-right");

    revealElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return null;
}

export function CinematicEffects() {
  return (
    <>
      <IntroOverlay />
      <CursorGlow />
      <MagneticElements />
      <TiltEffect />
      <RippleEffect />
      <ScrollRevealEnhancer />
    </>
  );
}
