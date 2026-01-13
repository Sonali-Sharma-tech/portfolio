import type { Metadata } from "next";
import { Orbitron, Exo_2, Fira_Code } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { HyperspaceProvider } from "@/context/hyperspace-context";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import "./globals.css";

// Futuristic display font for headings
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

// Clean body font with futuristic feel
const exo = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-exo",
  display: "swap",
});

// Terminal/code font
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fira",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SONALI.SH — Space Terminal",
    template: "%s — SONALI.SH",
  },
  description:
    "Full-stack developer crafting seamless web experiences. Turning ideas into elegant, functional code.",
  keywords: ["developer", "software engineer", "cyberpunk", "space", "React", "TypeScript"],
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
      className={`${orbitron.variable} ${exo.variable} ${firaCode.variable}`}
    >
      <body className="min-h-screen antialiased screen-flicker">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <HyperspaceProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </HyperspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
