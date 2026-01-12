"use client";

import Link from "next/link";

const socialLinks = [
  {
    name: "GITHUB",
    href: "https://github.com/Sonali-Sharma-tech",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LINKEDIN",
    href: "https://linkedin.com/in/sonali-sharma110114",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "EMAIL",
    href: "mailto:sonali.sharma110114@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const navLinks = [
  { href: "/", label: "HOME", command: "~/" },
  { href: "/projects", label: "PROJECTS", command: "./projects" },
  { href: "/about", label: "ABOUT", command: "./about" },
  { href: "/blog", label: "BLOG", command: "./blog" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-space-void overflow-hidden">
      {/* Glowing top border with animated gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan to-transparent" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-cyan/40 blur-md" />

      {/* Circuit board pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h80v80h-80z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="10" r="2" fill="currentColor" />
              <circle cx="10" cy="90" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <path d="M50 10v30M10 50h30M90 50h-30M50 90v-30" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-cyan" />
        </svg>
      </div>

      <div className="container relative py-16">
        {/* Main content - Horizontal layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-16">

          {/* Brand section */}
          <div className="lg:max-w-xs">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-cyan flex items-center justify-center font-mono text-lg font-bold text-cyan">
                  S
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-magenta" />
              </div>
              <div>
                <div className="font-mono text-sm text-cyan tracking-widest">SONALI.SH</div>
                <div className="text-[10px] text-text-muted font-mono">FULL-STACK DEVELOPER</div>
              </div>
            </div>

            <p className="text-text-secondary font-mono text-sm leading-relaxed mb-6">
              Crafting digital experiences with clean code and creative solutions.
            </p>

            {/* Social icons - larger, more prominent */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="group relative w-11 h-11 bg-space-surface border border-border flex items-center justify-center text-text-muted transition-all duration-300 hover:text-cyan hover:border-cyan hover:bg-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,245,0.3)]"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                  aria-label={link.name}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {link.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-medium mb-5 text-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-cyan" />
              NAVIGATE
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 font-mono text-sm text-text-muted transition-all duration-300 hover:text-cyan"
                  >
                    <span className="text-green group-hover:text-cyan transition-colors">$</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.command}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect section */}
          <div>
            <h4 className="text-xs font-mono font-medium mb-5 text-magenta uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-magenta" />
              CONNECT
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="group flex items-center gap-2 font-mono text-sm text-text-muted transition-all duration-300 hover:text-magenta"
                  >
                    <span className="text-cyan/50 group-hover:text-cyan transition-colors">[</span>
                    <span className="group-hover:tracking-wider transition-all">{link.name}</span>
                    <span className="text-cyan/50 group-hover:text-cyan transition-colors">]</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Terminal */}
          <div className="lg:max-w-xs">
            <h4 className="text-xs font-mono font-medium mb-5 text-green uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-green" />
              SYSTEM STATUS
            </h4>
            <div className="bg-space-surface border border-border p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <span className="absolute inset-0 w-2 h-2 bg-green rounded-full animate-ping opacity-40" />
                  <span className="relative w-2 h-2 bg-green rounded-full block shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                </div>
                <span className="text-green">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="space-y-1 text-text-muted">
                <div className="flex justify-between">
                  <span>Portfolio</span>
                  <span className="text-green">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span>Projects</span>
                  <span className="text-cyan">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability</span>
                  <span className="text-magenta">OPEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with decorative elements */}
        <div className="relative mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 flex items-center gap-3">
            <div className="w-1 h-1 bg-cyan" />
            <div className="w-4 h-4 border border-cyan/30 rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-magenta rotate-45" />
            </div>
            <div className="w-1 h-1 bg-cyan" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-text-muted font-mono text-sm flex items-center gap-2">
            <span className="text-green">©</span>
            <span suppressHydrationWarning>{currentYear}</span>
            <span className="text-border">|</span>
            <span className="text-cyan">Sonali Sharma</span>
          </p>

          {/* Built with */}
          <p className="text-text-muted font-mono text-xs flex items-center gap-2">
            <span>Built with</span>
            <span className="text-magenta">Next.js</span>
            <span>&</span>
            <span className="text-cyan">TypeScript</span>
          </p>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-text-muted font-mono text-xs hover:text-cyan transition-colors"
          >
            <span>BACK_TO_TOP</span>
            <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom neon line */}
      <div className="h-px w-full bg-gradient-to-r from-magenta/50 via-cyan/50 to-magenta/50" />
    </footer>
  );
}
