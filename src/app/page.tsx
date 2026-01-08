import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { getAllPosts, formatDate } from "@/lib/posts";

export default function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 2);
  const recentPosts = getAllPosts().slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-6">
          Developer & Builder
        </h1>
        <p className="text-xl sm:text-2xl text-foreground-muted leading-relaxed max-w-2xl mb-8">
          I craft clean, performant web applications with a focus on user experience
          and code quality. Currently exploring the intersection of design and engineering.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-gold text-background font-medium rounded-md hover:bg-gold-light transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-6 py-3 border border-border text-foreground font-medium rounded-md hover:border-gold hover:text-gold transition-colors"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-semibold">Featured Projects</h2>
          <Link
            href="/projects"
            className="text-sm text-foreground-muted hover:text-gold transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid gap-6">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block p-6 bg-card border border-border rounded-lg hover:border-gold/50 hover:bg-card-hover transition-colors group"
            >
              <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                {project.title}
              </h3>
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
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-semibold">Recent Writing</h2>
          <Link
            href="/blog"
            className="text-sm text-foreground-muted hover:text-gold transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-card border border-border rounded-lg hover:border-gold/50 hover:bg-card-hover transition-colors group"
            >
              <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                {post.title}
              </h3>
              <p className="text-foreground-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border text-center">
        <h2 className="font-heading text-2xl font-semibold mb-4">
          Let&apos;s work together
        </h2>
        <p className="text-foreground-muted mb-6 max-w-md mx-auto">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>
        <Link
          href="mailto:hello@sonalisharma.dev"
          className="inline-flex items-center px-6 py-3 bg-gold text-background font-medium rounded-md hover:bg-gold-light transition-colors"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
