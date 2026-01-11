"use client";

import Link from "next/link";

const socialLinks = [
  {
    name: "GITHUB",
    href: "https://github.com/Sonali-Sharma-tech",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LINKEDIN",
    href: "https://linkedin.com/in/sonali-sharma110114",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "EMAIL",
    href: "mailto:sonali.sharma110114@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <footer className="relative border-t border-cyan/20 bg-space-void overflow-hidden">
      {/* Animated scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 245, 0.1) 2px, rgba(0, 255, 245, 0.1) 4px)',
          }}
        />
      </div>

      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
      <div className="absolute top-0 left-1/3 right-1/3 h-[2px] bg-cyan/60 blur-sm" />

      <div className="container relative py-16">
        {/* Main grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* About & Social */}
          <div className="group">
            <h4 className="text-xs font-mono font-medium mb-4 text-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="text-green transition-transform group-hover:translate-x-1">&gt;</span>
              ABOUT
            </h4>
            <p className="text-text-secondary font-mono text-sm leading-relaxed mb-6">
              Full-stack developer crafting<br />
              digital experiences with code.
            </p>

            {/* Social icons with glow effects */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="group/icon relative w-12 h-12 border border-border flex items-center justify-center text-text-muted transition-all duration-300 hover:text-cyan hover:border-cyan hover:shadow-[0_0_20px_rgba(0,255,245,0.4)] hover:scale-110"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    animationDelay: `${index * 100}ms`
                  }}
                  aria-label={link.name}
                >
                  {/* Corner accent on hover */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover/icon:border-cyan transition-colors" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover/icon:border-cyan transition-colors" />

                  <span className="transition-transform group-hover/icon:scale-110">
                    {link.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono font-medium mb-4 text-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="text-green">&gt;</span>
              NAVIGATION
            </h4>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group/nav relative flex items-center gap-3 py-2 px-3 -mx-3 font-mono text-sm text-text-muted transition-all duration-300 hover:text-cyan hover:bg-cyan/5 hover:pl-5"
                  >
                    {/* Animated line on hover */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-cyan transition-all duration-300 group-hover/nav:w-2" />

                    <span className="text-green text-xs transition-all group-hover/nav:text-cyan group-hover/nav:drop-shadow-[0_0_8px_rgba(0,255,245,0.8)]">$</span>
                    <span className="transition-all group-hover/nav:tracking-wider">{link.command}</span>

                    {/* Arrow on hover */}
                    <span className="ml-auto opacity-0 -translate-x-2 transition-all group-hover/nav:opacity-100 group-hover/nav:translate-x-0 text-cyan">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-mono font-medium mb-4 text-magenta uppercase tracking-widest flex items-center gap-2">
              <span className="text-green">&gt;</span>
              CONNECT
            </h4>
            <ul className="space-y-1">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="group/connect relative inline-flex items-center gap-2 py-2 font-mono text-sm text-text-muted transition-all duration-300 hover:text-magenta"
                  >
                    {/* Bracket animation */}
                    <span className="transition-all group-hover/connect:text-cyan group-hover/connect:-translate-x-1">[</span>
                    <span className="transition-all group-hover/connect:tracking-wider group-hover/connect:drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]">
                      {link.name}
                    </span>
                    <span className="transition-all group-hover/connect:text-cyan group-hover/connect:translate-x-1">]</span>

                    {/* Underline effect */}
                    <span className="absolute bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan to-magenta transition-all duration-300 group-hover/connect:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated Divider */}
        <div className="relative h-px mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan animate-pulse" />
            <div className="w-2 h-2 border border-magenta rotate-45 animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 h-1 bg-cyan animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-mono">
          {/* Copyright with hover */}
          <p className="group text-text-muted flex items-center gap-2">
            <span className="text-green group-hover:animate-pulse">©</span>
            <span suppressHydrationWarning>{currentYear}</span>
            <span className="text-cyan transition-all group-hover:text-magenta group-hover:drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]">
              Sonali Sharma
            </span>
          </p>

          {/* Status indicator with enhanced animation */}
          <div className="group flex items-center gap-3 px-4 py-2 border border-transparent hover:border-green/30 hover:bg-green/5 transition-all duration-300 cursor-default">
            <span className="text-text-muted group-hover:text-green transition-colors">STATUS:</span>
            <div className="relative">
              <span className="absolute inset-0 w-2 h-2 bg-green rounded-full animate-ping opacity-40" />
              <span className="relative w-2 h-2 bg-green rounded-full block shadow-[0_0_10px_rgba(0,255,65,0.6)]" />
            </div>
            <span className="text-green group-hover:tracking-wider transition-all">OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-magenta/50 to-transparent" />
    </footer>
  );
}
