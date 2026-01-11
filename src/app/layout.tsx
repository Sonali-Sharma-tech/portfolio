import type { Metadata } from "next";
import { Cinzel, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Particles } from "@/components/effects/particles";
import { CursorEffects } from "@/components/effects/cursor-effects";
import { GameHUD } from "@/components/effects/game-ui";
import "./globals.css";

// Ancient display font for headings
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

// Elegant body font
const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});

// Code font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sonali Sharma — Developer",
    template: "%s — Sonali Sharma",
  },
  description:
    "Developer crafting elegant digital experiences with precision and artistry.",
  keywords: ["developer", "software engineer", "web development", "React", "TypeScript"],
  authors: [{ name: "Sonali Sharma" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${crimson.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Cinematic cursor with trails and click explosions */}
          <CursorEffects />

          {/* Gamified XP bar and achievement system */}
          <GameHUD />

          {/* Floating particles throughout */}
          <Particles />

          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
