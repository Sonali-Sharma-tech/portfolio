"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "HOME", command: "~/" },
  { href: "/projects", label: "PROJECTS", command: "./projects" },
  { href: "/about", label: "ABOUT", command: "./about" },
  { href: "/blog", label: "BLOG", command: "./blog" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-space-void/80 backdrop-blur-md border-b border-border" />

      <div className="container relative">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="relative w-10 h-10 border-2 border-cyan flex items-center justify-center group-hover:bg-cyan transition-colors duration-300">
              <span className="font-mono text-lg font-bold text-cyan group-hover:text-space-void transition-colors duration-300">
                S
              </span>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan" />
            </div>
            <span className="hidden sm:block font-mono text-sm text-cyan tracking-widest">
              SONALI.SH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-cyan"
                      : "text-text-muted hover:text-cyan"
                  }`}
                >
                  <span className="text-green mr-1">$</span>
                  {link.command}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-cyan" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Status indicator + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-green/30 bg-green/5">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green">ONLINE</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 border border-border flex items-center justify-center hover:border-cyan transition-colors"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block w-5 h-0.5 bg-cyan transition-transform duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-cyan transition-opacity duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-cyan transition-transform duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-space-void/95 backdrop-blur-lg border-b border-border transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
        >
          <div className="container py-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 font-mono text-sm tracking-wider border-b border-border last:border-0 transition-colors ${
                    isActive ? "text-cyan" : "text-text-muted"
                  }`}
                >
                  <span className="text-green mr-2">$</span>
                  {link.command}
                  {isActive && (
                    <span className="float-right text-cyan">[ACTIVE]</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
