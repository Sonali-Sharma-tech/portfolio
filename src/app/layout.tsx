import type { Metadata } from "next";
import { Cinzel, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

// Heading font - elegant, medieval feel
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Body font - readable serif for long-form content
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

// Code font - for code blocks
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sonali Sharma | Developer",
    template: "%s | Sonali Sharma",
  },
  description:
    "Full-stack developer crafting elegant digital experiences. Explore my projects, blog posts, and journey through code.",
  keywords: ["developer", "portfolio", "full-stack", "web development", "React", "Next.js"],
  authors: [{ name: "Sonali Sharma" }],
  creator: "Sonali Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sonalisharma.dev",
    siteName: "Sonali Sharma",
    title: "Sonali Sharma | Developer",
    description: "Full-stack developer crafting elegant digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonali Sharma | Developer",
    description: "Full-stack developer crafting elegant digital experiences.",
    creator: "@sonalisharma",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
