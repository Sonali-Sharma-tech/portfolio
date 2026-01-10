import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-bg-void/60 backdrop-blur-xl border-b border-border" />

      <div className="container relative py-4 flex items-center justify-between">
        {/* Logo with gradient hover */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-purple opacity-0 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-purple/30 bg-purple/5 group-hover:border-purple group-hover:bg-purple/10 transition-all duration-300">
              <span className="font-cinzel font-semibold text-sm text-gradient">SS</span>
            </span>
          </div>
          <span className="hidden sm:block font-cinzel font-medium tracking-wide text-text-primary group-hover:text-gradient transition-all duration-300">
            Sonali Sharma
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm text-text-muted hover:text-text-primary transition-colors duration-300 font-mono tracking-wide uppercase group"
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple to-pink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Right side - Mobile nav only */}
        <div className="flex items-center gap-4">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
