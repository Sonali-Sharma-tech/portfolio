"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// Terminal sequence - each step waits for the previous
interface TerminalStep {
  type: 'command' | 'output';
  content: string | React.ReactNode;
  typingSpeed?: number;
}

const terminalSequence: TerminalStep[] = [
  { type: 'command', content: 'whoami', typingSpeed: 80 },
  { type: 'output', content: <><span className="text-cyan">Sonali Sharma</span> — Full-Stack Developer</> },
  { type: 'command', content: 'cat mission.txt', typingSpeed: 60 },
  { type: 'output', content: <>Building <span className="text-magenta">digital experiences</span> that feel like magic</> },
  { type: 'command', content: 'ls skills/', typingSpeed: 70 },
  { type: 'output', content: (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      <span className="text-green">React</span>
      <span className="text-cyan">TypeScript</span>
      <span className="text-magenta">Next.js</span>
      <span className="text-green">Node.js</span>
      <span className="text-cyan">GraphQL</span>
    </div>
  )},
  { type: 'command', content: './start_adventure.sh', typingSpeed: 50 },
];

export function TerminalHero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Type out command character by character
  const typeCommand = useCallback((text: string, speed: number) => {
    setIsTyping(true);
    setTypedText("");
    let index = 0;

    const typeNext = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        setTimeout(typeNext, speed + Math.random() * 30);
      } else {
        setIsTyping(false);
        // After command is typed, wait a bit then move to next step
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 400);
      }
    };

    setTimeout(typeNext, 300);
  }, []);

  // Process each step
  useEffect(() => {
    if (currentStep >= terminalSequence.length) {
      // All done, show success message
      setTimeout(() => setShowSuccess(true), 500);
      return;
    }

    const step = terminalSequence[currentStep];

    if (step.type === 'command') {
      typeCommand(step.content as string, step.typingSpeed || 60);
    } else if (step.type === 'output') {
      // Output appears instantly, then wait before next command
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTypedText("");
      }, 800);
    }
  }, [currentStep, typeCommand]);

  // Render completed steps
  const renderCompletedSteps = () => {
    const completed: React.ReactNode[] = [];

    for (let i = 0; i < currentStep; i++) {
      const step = terminalSequence[i];
      if (step.type === 'command') {
        completed.push(
          <div key={`cmd-${i}`} className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-command">{step.content}</span>
          </div>
        );
      } else {
        completed.push(
          <div key={`out-${i}`} className="terminal-output animate-fadeIn">
            {step.content}
          </div>
        );
      }
    }

    return completed;
  };

  // Render current step being typed
  const renderCurrentStep = () => {
    if (currentStep >= terminalSequence.length) return null;

    const step = terminalSequence[currentStep];

    if (step.type === 'command') {
      return (
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="terminal-command">
            {typedText}
            <span
              className={`inline-block w-2.5 h-5 bg-cyan ml-0.5 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 0.1s' }}
            />
          </span>
        </div>
      );
    } else {
      return (
        <div className="terminal-output animate-fadeIn">
          {step.content}
        </div>
      );
    }
  };

  return (
    <section className="hero">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Terminal */}
          <div className="order-2 lg:order-1">
            <div className="terminal-card max-w-2xl h-[440px] flex flex-col">
              <div className="terminal-header flex-shrink-0">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="terminal-title">sonali@dev ~ /portfolio</span>
              </div>
              <div className="terminal-body flex-1 overflow-hidden">
                {renderCompletedSteps()}
                {renderCurrentStep()}

                {showSuccess && (
                  <div className="mt-6 pt-6 border-t border-cyan/20 animate-fadeIn">
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                      <span className="text-green">[SUCCESS]</span>
                      <span className="text-text-muted">Connection established!</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Fade-in animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
