import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me, my background, and what I do.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-semibold mb-4">About</h1>
      </header>

      <div className="prose prose-lg max-w-none">
        {/* Bio Section */}
        <section className="mb-12">
          <p className="text-xl text-foreground-muted leading-relaxed mb-6">
            Hi, I&apos;m Sonali. I&apos;m a developer passionate about building
            things that live on the web. I focus on creating clean, accessible,
            and performant user experiences.
          </p>
          <p className="text-foreground-muted leading-relaxed mb-6">
            Currently, I&apos;m working on [your current role/focus]. Previously,
            I&apos;ve worked at [previous companies/roles] where I learned
            [key skills/lessons].
          </p>
          <p className="text-foreground-muted leading-relaxed">
            When I&apos;m not coding, you can find me [hobbies/interests]. I believe
            in continuous learning and sharing knowledge with the community.
          </p>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-semibold mb-6">Skills & Technologies</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-heading text-lg font-medium mb-3 text-gold">Frontend</h3>
              <ul className="space-y-2 text-foreground-muted">
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>HTML / CSS / JavaScript</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium mb-3 text-gold">Backend</h3>
              <ul className="space-y-2 text-foreground-muted">
                <li>Node.js</li>
                <li>PostgreSQL / MongoDB</li>
                <li>REST APIs / GraphQL</li>
                <li>Docker / AWS</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="pt-8 border-t border-border">
          <h2 className="font-heading text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-foreground-muted mb-6">
            I&apos;m always happy to connect with fellow developers, discuss
            potential collaborations, or just chat about technology.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="mailto:hello@sonalisharma.dev"
              className="inline-flex items-center px-4 py-2 border border-border rounded hover:border-gold hover:text-gold transition-colors"
            >
              Email me
            </Link>
            <Link
              href="https://github.com/sonalisharma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-border rounded hover:border-gold hover:text-gold transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/sonalisharma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-border rounded hover:border-gold hover:text-gold transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
