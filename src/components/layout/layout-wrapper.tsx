"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SpaceEffects } from "@/components/effects/space-effects";
import { CyberEffects } from "@/components/effects/cyber-effects";
import { HyperspaceJourneyWrapper } from "@/components/effects/hyperspace-wrapper";

// Routes that should have full-screen immersive experience (no header/footer)
const IMMERSIVE_ROUTES = ["/journey"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isImmersive = IMMERSIVE_ROUTES.some(route => pathname?.startsWith(route));

  if (isImmersive) {
    // Full-screen immersive mode - no header, footer, or background effects
    return <>{children}</>;
  }

  // Normal layout with all effects
  return (
    <>
      {/* Space background effects - starfield, nebula */}
      <SpaceEffects />

      {/* Cyberpunk effects - glitch, cursor, scanlines */}
      <CyberEffects />

      {/* Hyperspace journey overlay */}
      <HyperspaceJourneyWrapper />

      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
