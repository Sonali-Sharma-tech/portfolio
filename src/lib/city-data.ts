// ==========================================
// CYBERPUNK CITY JOURNEY DATA
// All content for the night city portfolio journey
// ==========================================

export interface CityOrigin {
  city: string;
  country: string;
  education: string;
  coordinates: { lat: number; lng: number };
}

export interface CityCompany {
  id: string;
  name: string;
  role: string;
  period: string;
  duration: string;
  type: 'internship' | 'full-time';
  buildingType: 'industrial' | 'startup' | 'warehouse' | 'headquarters';
  neonColor: string;
  skills: string[];
  techIcons: string[];
  log: string;
  scrollStart: number;
  scrollEnd: number;
}

export interface CityProject {
  id: string;
  name: string;
  description: string;
  district: 'matrix' | 'neon' | 'dark';
  tags: string[];
  github: string;
  live?: string;
  neonColor: string;
  scrollStart: number;
  scrollEnd: number;
}

export interface CityData {
  origin: CityOrigin;
  companies: CityCompany[];
  projects: CityProject[];
  stats: {
    years: string;
    companies: number;
    projects: number;
  };
}

// ==========================================
// JOURNEY CONTENT
// ==========================================

export const cityData: CityData = {
  origin: {
    city: "Indore",
    country: "India",
    education: "Engineering Graduate",
    coordinates: { lat: 22.7196, lng: 75.8577 },
  },

  companies: [
    {
      id: "ey",
      name: "EY",
      role: "Web Developer",
      period: "Aug 2019 - Apr 2020",
      duration: "9 months",
      type: "internship",
      buildingType: "industrial",
      neonColor: "#ff6600",
      skills: ["Angular", "AJAX"],
      techIcons: ["angular", "javascript", "html5"],
      log: "First mission assignment. Learning the fundamentals of enterprise web development. Systems initialized.",
      scrollStart: 12,
      scrollEnd: 24,
    },
    {
      id: "6figr",
      name: "6figr.com",
      role: "Frontend Developer",
      period: "Dec 2020 - May 2022",
      duration: "1 yr 6 mos",
      type: "full-time",
      buildingType: "startup",
      neonColor: "#00ff88",
      skills: ["TypeScript", "Angular"],
      techIcons: ["typescript", "angular", "sass"],
      log: "Remote mission commenced. Operating independently in the Angular ecosystem. Building compensation intelligence systems.",
      scrollStart: 24,
      scrollEnd: 38,
    },
    {
      id: "captain-fresh",
      name: "Captain Fresh",
      role: "Software Engineer",
      period: "Jun 2022 - Jul 2023",
      duration: "1 yr 2 mos",
      type: "full-time",
      buildingType: "warehouse",
      neonColor: "#ff00ff",
      skills: ["React", "Redux", "Ant Design"],
      techIcons: ["react", "redux", "typescript"],
      log: "Joined the fresh cargo fleet. Scaling operations across supply chain systems. Redux architecture deployed.",
      scrollStart: 38,
      scrollEnd: 50,
    },
    {
      id: "glance",
      name: "Glance",
      role: "SDE II → SDE III",
      period: "Aug 2023 - Present",
      duration: "2+ years",
      type: "full-time",
      buildingType: "headquarters",
      neonColor: "#00fff5",
      skills: ["Svelte", "SvelteKit", "React", "TypeScript"],
      techIcons: ["svelte", "react", "typescript"],
      log: "Docked at command center. Promoted to senior rank. Leading frontend initiatives across the Glance ecosystem.",
      scrollStart: 50,
      scrollEnd: 62,
    },
  ],

  projects: [
    {
      id: "devtoolkit",
      name: "DevToolkit",
      description: "A comprehensive developer toolkit with essential utilities and tools to boost productivity.",
      district: "matrix",
      tags: ["TypeScript", "Developer Tools", "Productivity"],
      github: "https://github.com/Sonali-Sharma-tech/devtoolkit",
      neonColor: "#00ff88",
      scrollStart: 74,
      scrollEnd: 80,
    },
    {
      id: "colorful-extension",
      name: "Colorful Extension",
      description: "VS Code extension that transforms your editor with beautiful colors and syntax highlighting.",
      district: "neon",
      tags: ["VS Code", "Themes", "TypeScript"],
      github: "https://github.com/Sonali-Sharma-tech/colorful-carbon-extension",
      neonColor: "#ff00ff",
      scrollStart: 80,
      scrollEnd: 87,
    },
    {
      id: "black-note",
      name: "Black Note",
      description: "A sleek and minimal note-taking application with a beautiful dark interface.",
      district: "dark",
      tags: ["React", "Notes", "Productivity"],
      github: "https://github.com/Sonali-Sharma-tech/black-note",
      neonColor: "#00fff5",
      scrollStart: 87,
      scrollEnd: 94,
    },
  ],

  stats: {
    years: "5+",
    companies: 5,
    projects: 3,
  },
};

// ==========================================
// SCROLL SCENE RANGES
// ==========================================

export const sceneRanges = {
  rooftop: { start: 0, end: 12 },
  downtown: { start: 12, end: 62 },
  portal: { start: 62, end: 74 },
  districts: { start: 74, end: 94 },
  skyline: { start: 94, end: 100 },
};

// ==========================================
// COLOR PALETTE
// ==========================================

export const cityColors = {
  dark: '#0a0a12',
  building: '#1a1a2e',
  neonCyan: '#00fff5',
  neonMagenta: '#ff00ff',
  neonOrange: '#ff6600',
  neonGreen: '#00ff88',
  rainBlue: '#4488ff',
  fogPurple: 'rgba(100, 50, 150, 0.3)',
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getCurrentScene(scrollProgress: number): string {
  if (scrollProgress < sceneRanges.rooftop.end) return 'rooftop';
  if (scrollProgress < sceneRanges.downtown.end) return 'downtown';
  if (scrollProgress < sceneRanges.portal.end) return 'portal';
  if (scrollProgress < sceneRanges.districts.end) return 'districts';
  return 'skyline';
}

export function getActiveCompany(scrollProgress: number): CityCompany | null {
  return cityData.companies.find(
    (c) => scrollProgress >= c.scrollStart && scrollProgress < c.scrollEnd
  ) || null;
}

export function getActiveProject(scrollProgress: number): CityProject | null {
  return cityData.projects.find(
    (p) => scrollProgress >= p.scrollStart && scrollProgress < p.scrollEnd
  ) || null;
}

export function getSceneProgress(scrollProgress: number, sceneStart: number, sceneEnd: number): number {
  if (scrollProgress < sceneStart) return 0;
  if (scrollProgress > sceneEnd) return 1;
  return (scrollProgress - sceneStart) / (sceneEnd - sceneStart);
}
