import type { Metadata } from "next";
import Link from "next/link";
import { Fireflies } from "@/components/effects/nature-elements";

export const metadata: Metadata = {
  title: "About | Sonali Sharma",
  description: "Learn more about me, my background, and what I do.",
};

const skills = {
  frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
  backend: ["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL"],
  tools: ["Git", "Docker", "VS Code", "Socket.io", "REST APIs"],
};

const interests = [
  { emoji: "📚", label: "Reading" },
  { emoji: "🎵", label: "Music" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "💡", label: "Learning" },
  { emoji: "🚀", label: "Building" },
];

export default function AboutPage() {
  return (
    <>
      {/* ========================================
          HERO - Personal & Warm
          ======================================== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan" style={{ top: "20%", right: "10%" }} />
          <div className="orb orb-purple" style={{ bottom: "30%", left: "5%" }} />
          <div className="orb orb-pink" style={{ top: "60%", right: "30%", opacity: 0.3 }} />
          <Fireflies count={18} />
        </div>

        <div className="container relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              {/* Decorative element */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan" />
                <span className="text-xs font-mono text-cyan-light uppercase tracking-[0.3em]">
                  About Me
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-cinzel mb-8 leading-tight">
                <span className="text-text-muted">Hello, I&apos;m</span>
                <br />
                <span className="text-gradient text-glow">Sonali</span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-8">
                Throwing thoughts into the void &{" "}
                <span className="text-purple-light">building</span> what{" "}
                <span className="text-pink-light">emerges</span> ✨
              </p>

              <p className="text-lg text-text-muted leading-relaxed mb-12">
                I&apos;m a Full-stack Engineer based in India, passionate about
                crafting digital experiences that blend beautiful design with
                rock-solid engineering. Every pixel matters, every interaction counts.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8">
                <div className="text-center">
                  <span className="stat-number text-3xl">27+</span>
                  <p className="text-text-muted text-sm font-mono mt-1">Repos</p>
                </div>
                <div className="text-center">
                  <span className="stat-number text-3xl">10+</span>
                  <p className="text-text-muted text-sm font-mono mt-1">Projects</p>
                </div>
                <div className="text-center">
                  <span className="stat-number text-3xl">∞</span>
                  <p className="text-text-muted text-sm font-mono mt-1">Curiosity</p>
                </div>
              </div>
            </div>

            {/* Right - Creative visual */}
            <div className="relative hidden lg:block">
              <div className="aspect-square relative">
                {/* Decorative circles */}
                <div className="absolute inset-0 rounded-full border border-purple/20 animate-spin-slow" style={{ animationDuration: "20s" }} />
                <div className="absolute inset-8 rounded-full border border-pink/20 animate-spin-slow" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
                <div className="absolute inset-16 rounded-full border border-cyan/20 animate-spin-slow" style={{ animationDuration: "25s" }} />

                {/* Center content */}
                <div className="absolute inset-24 rounded-full bg-gradient-to-br from-purple/20 via-pink/10 to-cyan/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">👩‍💻</span>
                    <span className="text-sm font-mono text-text-muted">Building the future</span>
                  </div>
                </div>

                {/* Floating skill badges */}
                <div className="absolute top-10 right-10 px-4 py-2 rounded-full bg-purple/10 border border-purple/30 backdrop-blur-sm animate-float">
                  <span className="text-sm font-mono text-purple-light">React</span>
                </div>
                <div className="absolute bottom-20 left-5 px-4 py-2 rounded-full bg-pink/10 border border-pink/30 backdrop-blur-sm animate-float" style={{ animationDelay: "-2s" }}>
                  <span className="text-sm font-mono text-pink-light">TypeScript</span>
                </div>
                <div className="absolute top-1/2 -left-5 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/30 backdrop-blur-sm animate-float" style={{ animationDelay: "-4s" }}>
                  <span className="text-sm font-mono text-cyan-light">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glowing divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      {/* ========================================
          SKILLS SECTION
          ======================================== */}
      <section className="section relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple" style={{ top: "20%", right: "10%", opacity: 0.2 }} />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="section-label justify-center mb-4">Expertise</p>
            <h2 className="text-gradient">Skills & Technologies</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Frontend */}
            <div className="scroll-slide-left">
              <div className="bento-card p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/30 flex items-center justify-center mb-6">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-cinzel text-purple-light mb-6">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="scroll-scale">
              <div className="bento-card p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-pink/10 border border-pink/30 flex items-center justify-center mb-6">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-cinzel text-pink-light mb-6">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="scroll-slide-right">
              <div className="bento-card p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-center mb-6">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h3 className="text-xl font-cinzel text-cyan-light mb-6">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          INTERESTS - Personal Touch
          ======================================== */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="scroll-reveal mb-12">
              <p className="section-label justify-center mb-4">Beyond Code</p>
              <h2 className="text-gradient mb-6">When I&apos;m Not Coding</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Life is more than just code. Here&apos;s what keeps me inspired and balanced.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 scroll-blur">
              {interests.map((interest) => (
                <div
                  key={interest.label}
                  className="px-6 py-4 rounded-2xl border border-border bg-bg-elevated hover:border-purple/50 hover:bg-bg-glass transition-all duration-300 group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                    {interest.emoji}
                  </span>
                  <span className="text-sm font-mono text-text-muted">
                    {interest.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA - Let's Connect
          ======================================== */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-pink" style={{ top: "30%", left: "20%", opacity: 0.3 }} />
          <div className="orb orb-cyan" style={{ bottom: "20%", right: "20%", opacity: 0.3 }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="scroll-blur">
              <p className="section-label justify-center mb-6">Let&apos;s Connect</p>
            </div>
            <div className="scroll-scale">
              <h2 className="text-4xl md:text-6xl font-cinzel mb-8">
                <span className="text-gradient">Say hello</span>
                <br />
                I&apos;d love to hear from you
              </h2>
            </div>
            <div className="scroll-reveal">
              <p className="text-xl text-text-secondary mb-12 max-w-lg mx-auto">
                Whether you have a project in mind or just want to chat about
                technology — my inbox is always open.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 scroll-flip">
              <Link href="mailto:sonali.sharma110114@gmail.com" className="btn-magic text-lg">
                <span>Email Me</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
              <Link
                href="https://github.com/Sonali-Sharma-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <span>GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com/in/sonali-sharma110114"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <span>LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
