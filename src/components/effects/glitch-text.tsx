"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
}

export function GlitchText({ text, className = "", as: Component = "span" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Component
      className={`glitch-text ${isGlitching ? "glitching" : ""} ${className}`}
      data-text={text}
    >
      {text}
    </Component>
  );
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`typewriter-text ${className}`}>
      {displayText}
      <span
        className={`typewriter-cursor ${cursorVisible ? "visible" : ""} ${isComplete ? "blink" : ""}`}
      >
        |
      </span>
    </span>
  );
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
}

const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function ScrambleText({ text, className = "", scrambleOnHover = true }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span
      className={`scramble-text ${className}`}
      onMouseEnter={scrambleOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}
