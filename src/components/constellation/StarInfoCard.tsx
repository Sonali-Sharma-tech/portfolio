"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  voyageData,
  getStarContent,
} from "@/lib/voyage-data";
import type { StarPosition, VoyageCompany, VoyageProject, VoyageOrigin } from "@/lib/voyage-data";

// ==========================================
// STAR INFO CARD
// Displays information about the active star
// Appears when approaching a star
// ==========================================

interface StarInfoCardProps {
  activeStar: StarPosition | null;
  progress: number;
}

// Color mapping
const COLOR_MAP: Record<string, string> = {
  orange: "#ff8844",
  green: "#44ff88",
  magenta: "#ff44aa",
  cyan: "#44ffff",
  gold: "#ffd700",
};

export function StarInfoCard({ activeStar, progress }: StarInfoCardProps) {
  if (!activeStar) return null;

  const content = getStarContent(activeStar.id);
  if (!content) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStar.id}
        className="fixed right-6 top-1/2 -translate-y-1/2 w-[340px] z-40"
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {content.type === "origin" && (
          <OriginCard origin={content.data as VoyageOrigin} />
        )}
        {content.type === "company" && (
          <CompanyCard company={content.data as VoyageCompany} />
        )}
        {content.type === "project" && (
          <ProjectCard project={content.data as VoyageProject} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Origin star card
function OriginCard({ origin }: { origin: VoyageOrigin }) {
  const color = COLOR_MAP.gold;

  return (
    <div
      className="relative border bg-black/90 backdrop-blur-lg overflow-hidden"
      style={{
        borderColor: `${color}50`,
        boxShadow: `0 0 40px ${color}20`,
      }}
    >
      {/* Gradient accent top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Corner accents */}
      <CornerAccents color={color} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}, ${color}60)`,
              boxShadow: `0 0 25px ${color}50`,
            }}
          >
            <span className="text-2xl">🌟</span>
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/40 tracking-[0.3em] mb-1">
              ORIGIN POINT
            </div>
            <h3 className="text-xl font-display" style={{ color }}>
              {origin.city}, {origin.country}
            </h3>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-5">
          <div className="p-3 bg-white/5 border border-white/10">
            <div className="text-[9px] font-mono text-white/40 mb-1">EDUCATION</div>
            <div className="text-sm font-mono text-white/90">{origin.education}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-[8px] font-mono text-white/40 mb-1">LATITUDE</div>
              <div className="text-xs font-mono" style={{ color }}>
                {origin.coordinates.lat.toFixed(4)}°N
              </div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-[8px] font-mono text-white/40 mb-1">LONGITUDE</div>
              <div className="text-xs font-mono" style={{ color }}>
                {origin.coordinates.lng.toFixed(4)}°E
              </div>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className="text-center text-[10px] font-mono text-white/40 animate-pulse">
          Press ▲ to continue the journey
        </div>
      </div>
    </div>
  );
}

// Company star card
function CompanyCard({ company }: { company: VoyageCompany }) {
  const color = COLOR_MAP[company.color] || "#ffffff";

  return (
    <div
      className="relative border bg-black/90 backdrop-blur-lg overflow-hidden"
      style={{
        borderColor: `${color}50`,
        boxShadow: `0 0 40px ${color}20`,
      }}
    >
      {/* Gradient accent top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Corner accents */}
      <CornerAccents color={color} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}, ${color}60)`,
              boxShadow: `0 0 25px ${color}50`,
              color: "#000",
            }}
          >
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/40 tracking-[0.3em] mb-1">
              WAYPOINT {voyageData.companies.indexOf(company) + 1}
            </div>
            <h3 className="text-xl font-display" style={{ color }}>
              {company.name}
            </h3>
          </div>
        </div>

        {/* Captain's Log */}
        <div className="mb-4 p-3 bg-white/5 border border-white/10">
          <div className="text-[9px] font-mono text-white/40 mb-2">CAPTAIN&apos;S LOG</div>
          <p className="text-sm font-mono text-white/70 leading-relaxed italic">
            &ldquo;{company.log}&rdquo;
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 bg-white/5 border border-white/10">
            <div className="text-[8px] font-mono text-white/40 mb-1">ROLE</div>
            <div className="text-xs font-mono" style={{ color }}>{company.role}</div>
          </div>
          <div className="p-3 bg-white/5 border border-white/10">
            <div className="text-[8px] font-mono text-white/40 mb-1">DURATION</div>
            <div className="text-xs font-mono text-white/80">{company.duration}</div>
          </div>
        </div>

        {/* Period */}
        <div className="text-[10px] font-mono text-white/50 mb-4 text-center">
          {company.period}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {company.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-[10px] font-mono"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                color,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Project star card
function ProjectCard({ project }: { project: VoyageProject }) {
  const color = COLOR_MAP[project.color] || "#ffffff";

  return (
    <div
      className="relative border bg-black/90 backdrop-blur-lg overflow-hidden"
      style={{
        borderColor: `${color}50`,
        boxShadow: `0 0 40px ${color}20`,
      }}
    >
      {/* Gradient accent top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Corner accents */}
      <CornerAccents color={color} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}50`,
            }}
          >
            {project.theme === "matrix" && <span className="text-xl">⚡</span>}
            {project.theme === "rainbow" && <span className="text-xl">🎨</span>}
            {project.theme === "minimal" && <span className="text-xl">📝</span>}
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/40 tracking-[0.3em] mb-1">
              PROJECT
            </div>
            <h3 className="text-xl font-display" style={{ color }}>
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm font-mono text-white/70 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[10px] font-mono"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                color,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 text-center text-sm font-mono border transition-colors hover:bg-white/5"
            style={{ borderColor: `${color}50`, color }}
          >
            GitHub
          </Link>
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-sm font-mono border transition-colors"
              style={{
                background: `${color}20`,
                borderColor: color,
                color,
              }}
            >
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Corner accent decorations
function CornerAccents({ color }: { color: string }) {
  return (
    <>
      <div className="absolute -top-px -left-px w-4 h-4 border-l-2 border-t-2" style={{ borderColor: color }} />
      <div className="absolute -top-px -right-px w-4 h-4 border-r-2 border-t-2" style={{ borderColor: color }} />
      <div className="absolute -bottom-px -left-px w-4 h-4 border-l-2 border-b-2" style={{ borderColor: color }} />
      <div className="absolute -bottom-px -right-px w-4 h-4 border-r-2 border-b-2" style={{ borderColor: color }} />
    </>
  );
}
