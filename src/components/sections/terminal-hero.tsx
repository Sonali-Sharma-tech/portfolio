"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 50, delay: number = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
        }
      };
      typeNextChar();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
}

// Terminal line component
function TerminalLine({
  prompt,
  command,
  delay,
  showCursor = false,
}: {
  prompt: string;
  command: string;
  delay: number;
  showCursor?: boolean;
}) {
  const { displayText, isComplete } = useTypewriter(command, 30, delay);

  return (
    <div className="terminal-line">
      <span className="terminal-prompt">{prompt}</span>
      <span className="terminal-command">
        {displayText}
        {showCursor && !isComplete && <span className="terminal-cursor" />}
      </span>
    </div>
  );
}

// Output line that appears after typing
function OutputLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return <div className="terminal-output">{children}</div>;
}

export function TerminalHero() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Terminal */}
          <div className="order-2 lg:order-1">
            <div className="terminal-card max-w-2xl h-[480px] flex flex-col">
              <div className="terminal-header flex-shrink-0">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="terminal-title">sonali@dev ~ /portfolio</span>
              </div>
              <div className="terminal-body flex-1 overflow-hidden">
                <TerminalLine
                  prompt="$"
                  command="whoami"
                  delay={500}
                />
                <OutputLine delay={1000}>
                  <span className="text-cyan">Sonali Sharma</span> — Full-Stack Developer
                </OutputLine>

                <TerminalLine
                  prompt="$"
                  command="cat mission.txt"
                  delay={1500}
                />
                <OutputLine delay={2200}>
                  Building{" "}
                  <span className="text-magenta">digital experiences</span>{" "}
                  that feel like magic ✨
                </OutputLine>

                <TerminalLine
                  prompt="$"
                  command="ls skills/"
                  delay={2800}
                />
                <OutputLine delay={3500}>
                  <span className="text-green">React</span>{" "}
                  <span className="text-cyan">TypeScript</span>{" "}
                  <span className="text-magenta">Next.js</span>{" "}
                  <span className="text-green">Node.js</span>{" "}
                  <span className="text-cyan">GraphQL</span>
                </OutputLine>

                <TerminalLine
                  prompt="$"
                  command="./start_adventure.sh"
                  delay={4000}
                  showCursor
                />

                {showContent && (
                  <div className="mt-6 pt-6 border-t border-cyan/20">
                    <div className="text-green text-sm mb-2">
                      [SUCCESS] Connection established!
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Link href="/projects" className="btn-cyber text-xs py-2 px-4">
                        EXPLORE_PROJECTS
                      </Link>
                      <Link href="/about" className="btn-ghost-cyber text-xs py-2 px-4">
                        VIEW_PROFILE
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Big text */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-cyan/30 bg-cyan/5 text-xs font-mono text-cyan uppercase tracking-widest">
                <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                SYSTEM ONLINE
              </span>
            </div>

            <h1 className="mb-6">
              <span className="block text-text-muted text-lg md:text-2xl font-normal tracking-widest mb-4">
                &gt; HELLO, I&apos;M
              </span>
              <span
                className="block text-gradient-cyber glitch"
                data-text="SONALI"
              >
                SONALI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary font-mono mb-8 max-w-lg">
              <span className="text-cyan">&lt;</span>
              Developer
              <span className="text-cyan">/&gt;</span> crafting{" "}
              <span className="text-magenta">seamless experiences</span>
            </p>

            {/* Coordinates display */}
            <div className="grid grid-cols-3 gap-4 max-w-sm lg:max-w-none">
              <div className="text-center p-4 border border-border bg-space-surface/50">
                <div className="text-2xl font-mono text-cyan">27+</div>
                <div className="text-xs text-text-muted font-mono mt-1">REPOS</div>
              </div>
              <div className="text-center p-4 border border-border bg-space-surface/50">
                <div className="text-2xl font-mono text-magenta">10+</div>
                <div className="text-xs text-text-muted font-mono mt-1">PROJECTS</div>
              </div>
              <div className="text-center p-4 border border-border bg-space-surface/50">
                <div className="text-2xl font-mono text-green">∞</div>
                <div className="text-xs text-text-muted font-mono mt-1">CURIOSITY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator - no text, just visual cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-cyan/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cyan rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
