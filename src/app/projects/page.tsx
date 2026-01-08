import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects I've built, from web applications to open-source tools.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-semibold mb-4">Projects</h1>
        <p className="text-lg text-foreground-muted max-w-2xl">
          A collection of things I&apos;ve built. Some are professional work,
          others are experiments and learning projects.
        </p>
      </header>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block p-6 bg-card border border-border rounded-lg hover:border-gold/50 hover:bg-card-hover transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-heading text-xl font-semibold group-hover:text-gold transition-colors">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-foreground-muted mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-background-secondary rounded text-foreground-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-foreground-muted group-hover:text-gold transition-colors">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
