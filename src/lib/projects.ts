export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  github: string;
  live?: string;
}

// Real projects from GitHub
export const projects: Project[] = [
  {
    slug: "colorful-carbon-extension",
    title: "Colorful Carbon Extension",
    description:
      "VS Code extension that transforms your editor and terminal with beautiful colors and syntax highlighting.",
    tags: ["TypeScript", "VS Code", "Developer Tools", "Themes"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/colorful-carbon-extension",
  },
  {
    slug: "react-chat-application",
    title: "React Chat Application",
    description:
      "Real-time chat application built with React.js, Node.js, and Socket.io for instant messaging.",
    tags: ["React", "Node.js", "Socket.io", "Real-time"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/react-chat-application",
  },
  {
    slug: "react-quiz-app",
    title: "React Quiz App",
    description:
      "Interactive quiz app for testing knowledge with engaging questions and real-time feedback.",
    tags: ["React", "JavaScript", "Interactive", "Education"],
    featured: true,
    github: "https://github.com/Sonali-Sharma-tech/react-quiz-app",
  },
  {
    slug: "mern-social-media-app",
    title: "MERN Social Media App",
    description:
      "Full-stack social media platform built with MongoDB, Express, React, and Node.js.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/MERN-social-media-app",
  },
  {
    slug: "frontend-interview-questions",
    title: "Frontend Interview Questions",
    description:
      "Comprehensive collection of interview questions on JavaScript and React for frontend developers.",
    tags: ["JavaScript", "React", "Interview Prep", "Learning"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/frontend-interview-questions",
  },
  {
    slug: "react-typeahead",
    title: "React Typeahead",
    description:
      "Custom typeahead/autocomplete functionality implemented without using any third-party library.",
    tags: ["React", "JavaScript", "UI Components", "No Dependencies"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/react-typeahead",
  },
  {
    slug: "nested-list-rendering-app",
    title: "Nested List Rendering",
    description:
      "Rendering List UI with nested children like an Accordion component.",
    tags: ["React", "JavaScript", "UI Patterns", "Components"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/nested-list-rendering-app",
  },
  {
    slug: "pomodoro",
    title: "Pomodoro Timer",
    description:
      "Productivity timer application using the Pomodoro technique for focused work sessions.",
    tags: ["TypeScript", "Productivity", "Timer", "App"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/pomodoro",
  },
  {
    slug: "weather-app-reactjs",
    title: "Weather App",
    description:
      "React-based weather application to check current weather conditions.",
    tags: ["React", "JavaScript", "API", "Weather"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/weather-app-reactjs",
  },
  {
    slug: "grpc-web",
    title: "gRPC Web",
    description:
      "Implementation of gRPC-Web for browser-based communication with gRPC services.",
    tags: ["JavaScript", "gRPC", "Web", "Backend"],
    featured: false,
    github: "https://github.com/Sonali-Sharma-tech/grpc-web",
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
