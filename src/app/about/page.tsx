import type { Metadata } from "next";
import { AnimatedTimeline } from "@/components/about/animated-timeline";
import { AnimatedTerminal, AnimatedInterests } from "@/components/about/animated-sections";

export const metadata: Metadata = {
  title: "About | SONALI.SH",
  description: "Full-stack developer with 5+ years of experience building web applications.",
};

const experience = [
  {
    company: "Glance",
    role: "SDE III",
    period: "Jul 2025 - Present",
    description: "Leading frontend architecture for products reaching millions daily.",
    skills: ["React", "TypeScript", "System Design"],
    current: true,
    year: "2025",
  },
  {
    company: "Glance",
    role: "SDE II",
    period: "Aug 2023 - Jun 2025",
    description: "Built interactive features with Svelte for the lock screen platform.",
    skills: ["Svelte", "SvelteKit"],
    year: "2023",
  },
  {
    company: "Captain Fresh",
    role: "Software Engineer",
    period: "Jun 2022 - Jul 2023",
    description: "Developed B2B seafood logistics platform frontend.",
    skills: ["React", "Redux"],
    year: "2022",
  },
  {
    company: "6figr.com",
    role: "Frontend Developer",
    period: "Dec 2020 - May 2022",
    description: "Created salary insights and career analytics platform.",
    skills: ["Angular", "TypeScript"],
    year: "2020",
  },
  {
    company: "EY",
    role: "Web Developer Intern",
    period: "Aug 2019 - Apr 2020",
    description: "Started the journey. Built internal tools and learned enterprise patterns.",
    skills: ["Angular", "AJAX"],
    year: "2019",
  },
];

const techStack = ["TypeScript", "React", "Next.js", "Svelte", "Node.js", "Tailwind", "GraphQL", "MongoDB"];

const interests = [
  { icon: "📚", label: "Reading" },
  { icon: "🎵", label: "Music" },
  { icon: "✈️", label: "Travel" },
  { icon: "🎮", label: "Gaming" },
];

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      {/* Hero */}
      <section className="container max-w-4xl mb-24">
        <p className="text-xs font-mono text-cyan mb-4 tracking-widest">ABOUT</p>
        <h1 className="text-3xl md:text-4xl font-display leading-tight mb-6">
          I turn &apos;what if&apos; into &apos;wow&apos;.
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mb-6">
          Software engineer with 5+ years shipping products at scale.
          Currently at <span className="text-cyan">Glance</span>, building interfaces
          that reach millions.
        </p>
      
      </section>

      {/* Career Timeline */}
      <section className="container max-w-4xl mb-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="text-2xl font-display">Career Journey</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <AnimatedTimeline experience={experience} />
      </section>

      {/* Tech Stack */}
      <section className="container max-w-4xl mb-24">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-2xl font-display">Stack</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <AnimatedTerminal techStack={techStack} />
      </section>

      {/* Beyond Code */}
      <section className="container max-w-4xl">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-2xl font-display">Beyond Code</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <AnimatedInterests interests={interests} />
      </section>
    </div>
  );
}
