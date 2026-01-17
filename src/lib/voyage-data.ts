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

// ==========================================
// CONSTELLATION MAP DATA
// Star positions and skill categories for the new journey
// ==========================================

export interface StarPosition {
  id: string;
  x: number;  // normalized -1 to 1
  y: number;
  z: number;
  type: 'origin' | 'company' | 'project';
}

export interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

// Star positions form a constellation pattern
// Origin at bottom, career ascends upward, projects branch out at top
export const constellationLayout: StarPosition[] = [
  // Origin point
  { id: "origin", x: 0, y: -0.8, z: 0, type: 'origin' },
  // Career stars - ascending diagonal path
  { id: "ey", x: -0.4, y: -0.45, z: 0.1, type: 'company' },
  { id: "6figr", x: -0.15, y: -0.1, z: -0.05, type: 'company' },
  { id: "captain-fresh", x: 0.15, y: 0.25, z: 0.1, type: 'company' },
  { id: "glance", x: 0.4, y: 0.55, z: 0, type: 'company' },
  // Projects - branching at the top
  { id: "devtoolkit", x: -0.35, y: 0.8, z: 0.15, type: 'project' },
  { id: "colorful-extension", x: 0.05, y: 0.95, z: -0.1, type: 'project' },
  { id: "black-note", x: 0.45, y: 0.85, z: 0.1, type: 'project' },
];

// Connections between stars (forms the constellation lines)
export const constellationConnections: [string, string][] = [
  ['origin', 'ey'],
  ['ey', '6figr'],
  ['6figr', 'captain-fresh'],
  ['captain-fresh', 'glance'],
  // Branch to projects
  ['glance', 'devtoolkit'],
  ['glance', 'colorful-extension'],
  ['glance', 'black-note'],
  // Connect projects horizontally
  ['devtoolkit', 'colorful-extension'],
  ['colorful-extension', 'black-note'],
];

// Skill categories for visualization
export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    color: "cyan",
    skills: ["React", "Svelte", "SvelteKit", "TypeScript", "Next.js", "Angular"]
  },
  {
    name: "State & Data",
    color: "green",
    skills: ["Redux", "GraphQL", "REST APIs", "Zustand"]
  },
  {
    name: "Tools",
    color: "orange",
    skills: ["Git", "VS Code", "Figma", "Webpack", "Vite"]
  },
  {
    name: "UI Libraries",
    color: "magenta",
    skills: ["Ant Design", "Tailwind CSS", "Framer Motion", "Three.js"]
  },
];

// New scene ranges for constellation journey
export const constellationSceneRanges = {
  intro: { start: 0, end: 10 },      // Star chart overview
  origin: { start: 10, end: 20 },    // Origin star - Indore
  career: { start: 20, end: 65 },    // Career constellation
  warp: { start: 65, end: 75 },      // Warp bridge transition
  projects: { start: 75, end: 95 },  // Project nebula
  reveal: { start: 95, end: 100 },   // Full constellation reveal
};

// Get star data by ID
export function getStarById(id: string): StarPosition | undefined {
  return constellationLayout.find(star => star.id === id);
}

// Get company or project data by star ID
export function getStarContent(id: string) {
  if (id === 'origin') {
    return { type: 'origin', data: voyageData.origin };
  }
  const company = voyageData.companies.find(c => c.id === id);
  if (company) {
    return { type: 'company', data: company };
  }
  const project = voyageData.projects.find(p => p.id === id);
  if (project) {
    return { type: 'project', data: project };
  }
  return null;
}

// Get current constellation scene
export function getConstellationScene(progress: number): string {
  const { intro, origin, career, warp, projects } = constellationSceneRanges;
  if (progress < intro.end) return 'intro';
  if (progress < origin.end) return 'origin';
  if (progress < career.end) return 'career';
  if (progress < warp.end) return 'warp';
  if (progress < projects.end) return 'projects';
  return 'reveal';
}

// Get active star based on progress
export function getActiveStar(progress: number): StarPosition | null {
  const scene = getConstellationScene(progress);

  if (scene === 'origin') {
    return constellationLayout.find(s => s.id === 'origin') || null;
  }

  if (scene === 'career') {
    // Map career progress (20-65%) to company index (0-3)
    const careerProgress = (progress - 20) / 45; // 0 to 1
    const companyIndex = Math.min(3, Math.floor(careerProgress * 4));
    const companyIds = ['ey', '6figr', 'captain-fresh', 'glance'];
    return constellationLayout.find(s => s.id === companyIds[companyIndex]) || null;
  }

  if (scene === 'projects') {
    // Map project progress (75-95%) to project index (0-2)
    const projectProgress = (progress - 75) / 20; // 0 to 1
    const projectIndex = Math.min(2, Math.floor(projectProgress * 3));
    const projectIds = ['devtoolkit', 'colorful-extension', 'black-note'];
    return constellationLayout.find(s => s.id === projectIds[projectIndex]) || null;
  }

  return null;
}

// Get stars that should be illuminated (visited) based on progress
export function getIlluminatedStars(progress: number): string[] {
  const illuminated: string[] = [];

  if (progress >= 10) illuminated.push('origin');
  if (progress >= 25) illuminated.push('ey');
  if (progress >= 37) illuminated.push('6figr');
  if (progress >= 50) illuminated.push('captain-fresh');
  if (progress >= 62) illuminated.push('glance');
  if (progress >= 80) illuminated.push('devtoolkit');
  if (progress >= 87) illuminated.push('colorful-extension');
  if (progress >= 93) illuminated.push('black-note');

  return illuminated;
}
