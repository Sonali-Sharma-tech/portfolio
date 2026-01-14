// ==========================================
// SPACE VOYAGE JOURNEY DATA
// All content for the cinematic portfolio voyage
// ==========================================

export interface VoyageOrigin {
  city: string;
  country: string;
  education: string;
  coordinates: { lat: number; lng: number };
}

export interface VoyageCompany {
  id: string;
  name: string;
  role: string;
  period: string;
  duration: string;
  type: 'internship' | 'full-time';
  stationType: 'dock' | 'satellite' | 'freighter' | 'mothership';
  color: string;
  skills: string[];
  log: string; // Captain's log narrative
  scrollStart: number; // percentage
  scrollEnd: number;
}

export interface VoyageProject {
  id: string;
  name: string;
  description: string;
  theme: 'matrix' | 'rainbow' | 'minimal';
  tags: string[];
  github: string;
  live?: string;
  color: string;
  scrollStart: number;
  scrollEnd: number;
}

export interface VoyageData {
  origin: VoyageOrigin;
  companies: VoyageCompany[];
  projects: VoyageProject[];
  stats: {
    years: string;
    companies: number;
    projects: number;
  };
}

// ==========================================
// JOURNEY CONTENT
// ==========================================

export const voyageData: VoyageData = {
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
      stationType: "dock",
      color: "orange",
      skills: ["Angular", "AJAX"],
      log: "First mission assignment. Learning the fundamentals of enterprise web development. Systems initialized.",
      scrollStart: 22,
      scrollEnd: 30,
    },
    {
      id: "6figr",
      name: "6figr.com",
      role: "Frontend Developer",
      period: "Dec 2020 - May 2022",
      duration: "1 yr 6 mos",
      type: "full-time",
      stationType: "satellite",
      color: "green",
      skills: ["TypeScript", "Angular"],
      log: "Remote mission commenced. Operating independently in the Angular ecosystem. Building compensation intelligence systems.",
      scrollStart: 32,
      scrollEnd: 40,
    },
    {
      id: "captain-fresh",
      name: "Captain Fresh",
      role: "Software Engineer",
      period: "Jun 2022 - Jul 2023",
      duration: "1 yr 2 mos",
      type: "full-time",
      stationType: "freighter",
      color: "magenta",
      skills: ["React", "Redux", "Ant Design"],
      log: "Joined the fresh cargo fleet. Scaling operations across supply chain systems. Redux architecture deployed.",
      scrollStart: 42,
      scrollEnd: 50,
    },
    {
      id: "glance",
      name: "Glance",
      role: "SDE II → SDE III",
      period: "Aug 2023 - Present",
      duration: "2+ years",
      type: "full-time",
      stationType: "mothership",
      color: "cyan",
      skills: ["Svelte", "SvelteKit", "React", "TypeScript"],
      log: "Docked at command center. Promoted to senior rank. Leading frontend initiatives across the Glance ecosystem.",
      scrollStart: 52,
      scrollEnd: 60,
    },
  ],

  projects: [
    {
      id: "devtoolkit",
      name: "DevToolkit",
      description: "A comprehensive developer toolkit with essential utilities and tools to boost productivity.",
      theme: "matrix",
      tags: ["TypeScript", "Developer Tools", "Productivity"],
      github: "https://github.com/Sonali-Sharma-tech/devtoolkit",
      color: "green",
      scrollStart: 74,
      scrollEnd: 80,
    },
    {
      id: "colorful-extension",
      name: "Colorful Extension",
      description: "VS Code extension that transforms your editor with beautiful colors and syntax highlighting.",
      theme: "rainbow",
      tags: ["VS Code", "Themes", "TypeScript"],
      github: "https://github.com/Sonali-Sharma-tech/colorful-carbon-extension",
      color: "magenta",
      scrollStart: 81,
      scrollEnd: 87,
    },
    {
      id: "black-note",
      name: "Black Note",
      description: "A sleek and minimal note-taking application with a beautiful dark interface.",
      theme: "minimal",
      tags: ["React", "Notes", "Productivity"],
      github: "https://github.com/Sonali-Sharma-tech/black-note",
      color: "cyan",
      scrollStart: 88,
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
  earth: { start: 0, end: 12 },
  launch: { start: -1, end: -1 },  // DISABLED - skipping launch scene
  career: { start: 12, end: 62 },  // Career starts directly after Earth
  wormhole: { start: 62, end: 74 },
  projects: { start: 74, end: 94 },
  destination: { start: 94, end: 100 },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getCurrentScene(scrollProgress: number): string {
  if (scrollProgress < sceneRanges.earth.end) return 'earth';
  // Launch scene is disabled - skip directly to career
  if (scrollProgress < sceneRanges.career.end) return 'career';
  if (scrollProgress < sceneRanges.wormhole.end) return 'wormhole';
  if (scrollProgress < sceneRanges.projects.end) return 'projects';
  return 'destination';
}

export function getActiveCompany(scrollProgress: number): VoyageCompany | null {
  return voyageData.companies.find(
    (c) => scrollProgress >= c.scrollStart && scrollProgress < c.scrollEnd
  ) || null;
}

export function getActiveProject(scrollProgress: number): VoyageProject | null {
  return voyageData.projects.find(
    (p) => scrollProgress >= p.scrollStart && scrollProgress < p.scrollEnd
  ) || null;
}

export function getSceneProgress(scrollProgress: number, sceneStart: number, sceneEnd: number): number {
  if (scrollProgress < sceneStart) return 0;
  if (scrollProgress > sceneEnd) return 1;
  return (scrollProgress - sceneStart) / (sceneEnd - sceneStart);
}
