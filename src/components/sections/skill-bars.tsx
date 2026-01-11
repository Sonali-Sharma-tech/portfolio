"use client";

import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "REACT / NEXT.JS", level: 95, color: "cyan" },
  { name: "TYPESCRIPT", level: 90, color: "magenta" },
  { name: "NODE.JS", level: 85, color: "green" },
  { name: "GRAPHQL", level: 80, color: "cyan" },
  { name: "POSTGRESQL / MONGODB", level: 85, color: "magenta" },
  { name: "TAILWIND CSS", level: 95, color: "green" },
];

function SkillBar({
  name,
  level,
  color,
  delay,
}: {
  name: string;
  level: number;
  color: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              // Animate the level number
              let current = 0;
              const increment = level / 30;
              const timer = setInterval(() => {
                current += increment;
                if (current >= level) {
                  setCurrentLevel(level);
                  clearInterval(timer);
                } else {
                  setCurrentLevel(Math.floor(current));
                }
              }, 30);
            }, delay);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => observer.disconnect();
  }, [level, delay]);

  const gradientClass =
    color === "cyan"
      ? "from-cyan to-cyan/50"
      : color === "magenta"
      ? "from-magenta to-magenta/50"
      : "from-green to-green/50";

  return (
    <div ref={barRef} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-mono text-text-primary tracking-wide">
          {name}
        </span>
        <span className={`text-sm font-mono text-${color}`}>
          {currentLevel}%
        </span>
      </div>
      <div className="skill-bar">
        <div
          className={`skill-bar-fill bg-gradient-to-r ${gradientClass}`}
          style={{
            width: isVisible ? `${level}%` : "0%",
            transition: "width 1s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        />
      </div>
    </div>
  );
}

export function SkillBars() {
  return (
    <section className="section relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Header */}
          <div className="scroll-reveal">
            <p className="section-label mb-4">SYSTEM_SPECS</p>
            <h2 className="text-gradient-cyber mb-6">
              Technical Proficiency
            </h2>
            <p className="text-text-secondary font-mono text-sm leading-relaxed mb-8">
              // LOADING CAPABILITY MATRIX...<br />
              // ANALYZING SKILL DISTRIBUTION...<br />
              // GENERATING PROFICIENCY REPORT...
            </p>

            {/* Terminal-style system info */}
            <div className="terminal-card p-6">
              <div className="terminal-line mb-2">
                <span className="terminal-prompt">$</span>
                <span className="terminal-command">cat /proc/developer</span>
              </div>
              <div className="text-text-secondary text-sm font-mono space-y-1">
                <div>
                  <span className="text-cyan">model:</span> Full-Stack Developer
                </div>
                <div>
                  <span className="text-cyan">cores:</span> React, Node.js, TypeScript
                </div>
                <div>
                  <span className="text-cyan">memory:</span> Unlimited Curiosity
                </div>
                <div>
                  <span className="text-cyan">uptime:</span> Always Learning
                </div>
                <div>
                  <span className="text-cyan">status:</span>{" "}
                  <span className="text-green">OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Skill Bars */}
          <div className="scroll-slide-right">
            <div className="p-1 border border-border bg-space-surface/30">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-green animate-pulse" />
                  <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
                    PROFICIENCY_MATRIX.DAT
                  </span>
                </div>

                {skills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={skill.color}
                    delay={index * 150}
                  />
                ))}

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                    <span>TOTAL_SKILLS: {skills.length}</span>
                    <span>
                      AVG_PROFICIENCY:{" "}
                      <span className="text-cyan">
                        {Math.round(
                          skills.reduce((acc, s) => acc + s.level, 0) / skills.length
                        )}
                        %
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
