"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
  skills: string[];
  current?: boolean;
  year: string;
}

interface AnimatedTimelineProps {
  experience: Job[];
}

export function AnimatedTimeline({ experience }: AnimatedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Timeline line grows as you scroll
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Animated center line - Desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
        <div className="w-px h-full bg-border/20" />
        <motion.div
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-cyan via-magenta to-orange"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Animated left line - Mobile */}
      <div className="md:hidden absolute left-3 top-0 bottom-0">
        <div className="w-px h-full bg-border/20" />
        <motion.div
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-cyan via-magenta to-orange"
          style={{ height: lineHeight }}
        />
      </div>

      <div className="space-y-8 md:space-y-16">
        {experience.map((job, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <TimelineCard
              key={`${job.company}-${job.role}`}
              job={job}
              index={idx}
              isLeft={isLeft}
            />
          );
        })}

        {/* Origin marker */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:hidden absolute left-0">
            <motion.div
              className="w-6 h-6 rounded-full border-2 border-dashed border-text-muted/30 bg-space-void flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-[8px] font-mono text-text-muted">○</span>
            </motion.div>
          </div>
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <motion.div
              className="w-4 h-4 rounded-full border-2 border-dashed border-text-muted/30 bg-space-void"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="pl-10 md:pl-0 md:text-center">
            <span className="text-xs font-mono text-text-muted/50">The beginning</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TimelineCard({
  job,
  index,
  isLeft,
}: {
  job: Job;
  index: number;
  isLeft: boolean;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Mobile dot */}
      <motion.div
        className="md:hidden absolute left-0 top-5"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            job.current
              ? "bg-cyan border-cyan shadow-[0_0_12px_rgba(0,255,245,0.6)]"
              : "bg-space-void border-border"
          }`}
        >
          <span className="text-[8px] font-mono font-bold">{job.year.slice(-2)}</span>
        </div>
        {job.current && (
          <motion.span
            className="absolute inset-0 rounded-full bg-cyan"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Desktop center dot */}
      <motion.div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-5 z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 ${
            job.current
              ? "bg-cyan border-cyan shadow-[0_0_20px_rgba(0,255,245,0.6)]"
              : "bg-space-void border-border"
          }`}
        />
        {job.current && (
          <motion.span
            className="absolute inset-0 rounded-full bg-cyan"
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Card */}
      <motion.div
        className={`pl-10 md:pl-0 md:w-[calc(50%-2rem)] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className={`relative border bg-space-surface/20 p-5 overflow-hidden group ${
            job.current ? "border-cyan/40" : "border-border/30"
          }`}
          whileHover={{
            y: -4,
            transition: { duration: 0.2 },
          }}
        >
          {/* Animated gradient border effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,255,245,0.1), transparent)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Corner accents that appear on hover */}
          <motion.div
            className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-transparent group-hover:border-cyan transition-colors duration-300"
          />
          <motion.div
            className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-transparent group-hover:border-cyan transition-colors duration-300"
          />
          <motion.div
            className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-transparent group-hover:border-magenta transition-colors duration-300"
          />
          <motion.div
            className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-transparent group-hover:border-magenta transition-colors duration-300"
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 30px rgba(0, 255, 245, 0.1), 0 0 40px rgba(0, 255, 245, 0.1)",
            }}
          />
          {/* Header */}
          <motion.div
            className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : ""}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-xs font-mono text-cyan">{job.year}</span>
            {job.current && (
              <motion.span
                className="text-[10px] font-mono text-cyan px-1.5 py-0.5 border border-cyan/30 bg-cyan/10"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NOW
              </motion.span>
            )}
          </motion.div>

          <div className={isLeft ? "md:text-right" : ""}>
            <motion.h3
              className="text-lg font-medium text-text-primary mb-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {job.role}
            </motion.h3>
            <motion.p
              className="text-sm text-text-muted mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              @ {job.company}
            </motion.p>
            <motion.p
              className="text-sm text-text-secondary mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {job.description}
            </motion.p>
          </div>

          {/* Skills - Staggered animation */}
          <div className={`flex flex-wrap gap-1.5 ${isLeft ? "md:justify-end" : ""}`}>
            {job.skills.map((skill, skillIdx) => (
              <motion.span
                key={skill}
                className="text-[10px] font-mono px-1.5 py-0.5 bg-space-void border border-border/30 text-text-muted"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + skillIdx * 0.1 }}
                whileHover={{
                  borderColor: "rgba(0, 255, 245, 0.5)",
                  color: "rgba(0, 255, 245, 1)",
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
