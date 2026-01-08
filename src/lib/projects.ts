export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  featured: boolean;
  github?: string;
  live?: string;
  image?: string;
}

// Replace with your actual projects
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    description:
      "A full-stack web application that solves a real problem. Built with modern technologies and best practices.",
    longDescription: `
## Overview

This project was built to solve [specific problem]. It allows users to [key functionality].

## Key Features

- Feature one with detailed explanation
- Feature two with detailed explanation
- Feature three with detailed explanation

## Technical Decisions

I chose Next.js for this project because...

The database schema was designed to...

## Challenges & Learnings

The biggest challenge was...

I learned a lot about...
    `.trim(),
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    featured: true,
    github: "https://github.com/sonalisharma/project-one",
    live: "https://project-one.vercel.app",
  },
  {
    slug: "project-two",
    title: "Project Two",
    description:
      "An open-source library that helps developers build better applications faster.",
    longDescription: `
## Overview

An npm package that simplifies [specific task] for developers.

## Installation

\`\`\`bash
npm install project-two
\`\`\`

## Usage

\`\`\`typescript
import { something } from 'project-two';

const result = something();
\`\`\`

## Why I Built This

I noticed many developers struggling with...
    `.trim(),
    tags: ["React", "npm", "Open Source"],
    featured: true,
    github: "https://github.com/sonalisharma/project-two",
  },
  {
    slug: "project-three",
    title: "Project Three",
    description:
      "A CLI tool that automates repetitive tasks and improves developer experience.",
    longDescription: `
## Overview

A command-line tool that automates [specific workflow].

## Installation

\`\`\`bash
npm install -g project-three
\`\`\`

## Commands

- \`project-three init\` - Initialize a new project
- \`project-three build\` - Build the project
- \`project-three deploy\` - Deploy to production
    `.trim(),
    tags: ["Node.js", "CLI", "Automation"],
    featured: false,
    github: "https://github.com/sonalisharma/project-three",
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
