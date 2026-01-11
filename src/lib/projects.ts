export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  github: string;
  live?: string;
}

// Featured projects
export const projects: Project[] = [
  {
    slug: "devtoolkit",
    title: "DevToolkit",
    description:
      "A comprehensive developer toolkit with essential utilities and tools to boost productivity.",
    tags: ["TypeScript", "Developer Tools", "Productivity", "Utilities"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/devtoolkit",
  },
  {
    slug: "colorful-carbon-extension",
    title: "Colorful Extension",
    description:
      "VS Code extension that transforms your editor and terminal with beautiful colors and syntax highlighting.",
    tags: ["TypeScript", "VS Code", "Developer Tools", "Themes"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/colorful-carbon-extension",
  },
  {
    slug: "black-note",
    title: "Black Note",
    description:
      "A sleek and minimal note-taking application with a beautiful dark interface.",
    tags: ["React", "Notes", "Productivity", "Dark Mode"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/black-note",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
