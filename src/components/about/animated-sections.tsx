"use client";

import { motion } from "framer-motion";

interface AnimatedTerminalProps {
  techStack: string[];
}

export function AnimatedTerminal({ techStack }: AnimatedTerminalProps) {
  return (
    <motion.div
      className="border border-border/50 bg-space-void/80 overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{
        borderColor: "rgba(0, 255, 245, 0.3)",
        boxShadow: "0 0 40px rgba(0, 255, 245, 0.1)",
      }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-space-surface/30 border-b border-border/30">
        <div className="flex gap-1.5">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500/70"
            whileHover={{ scale: 1.2, backgroundColor: "rgb(239, 68, 68)" }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-yellow-500/70"
            whileHover={{ scale: 1.2, backgroundColor: "rgb(234, 179, 8)" }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500/70"
            whileHover={{ scale: 1.2, backgroundColor: "rgb(34, 197, 94)" }}
          />
        </div>
        <span className="text-xs font-mono text-text-muted ml-2">skills.sh</span>
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-sm">
        <motion.div
          className="text-text-muted mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-cyan">$</span>{" "}
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "auto" }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-block overflow-hidden"
          >
            cat ~/.skills
          </motion.span>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech}
              className="flex items-center gap-2 group/item cursor-default"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + idx * 0.08 }}
            >
              <motion.span
                className="text-magenta"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                →
              </motion.span>
              <motion.span
                className="text-text-primary transition-colors"
                whileHover={{
                  color: "rgb(0, 255, 245)",
                  textShadow: "0 0 10px rgba(0, 255, 245, 0.5)",
                }}
              >
                {tech}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-4 text-text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <span className="text-cyan">$</span>
          <motion.span
            className="ml-1 inline-block"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ▊
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface Interest {
  icon: string;
  label: string;
}

interface AnimatedInterestsProps {
  interests: Interest[];
}

export function AnimatedInterests({ interests }: AnimatedInterestsProps) {
  const colors = [
    { border: "rgba(0, 255, 245, 0.6)", bg: "rgba(0, 255, 245, 0.1)", shadow: "0, 255, 245" },
    { border: "rgba(255, 0, 255, 0.6)", bg: "rgba(255, 0, 255, 0.1)", shadow: "255, 0, 255" },
    { border: "rgba(255, 107, 0, 0.6)", bg: "rgba(255, 107, 0, 0.1)", shadow: "255, 107, 0" },
    { border: "rgba(0, 255, 65, 0.6)", bg: "rgba(0, 255, 65, 0.1)", shadow: "0, 255, 65" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {interests.map((interest, idx) => {
        const color = colors[idx % colors.length];

        return (
          <motion.div
            key={interest.label}
            className="group relative border border-border/30 bg-space-surface/20 p-6 text-center cursor-default overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              borderColor: color.border,
              backgroundColor: color.bg,
              boxShadow: `0 0 30px rgba(${color.shadow}, 0.2), inset 0 0 30px rgba(${color.shadow}, 0.05)`,
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            {/* Animated corner brackets */}
            <motion.div
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-transparent"
              whileHover={{ borderColor: color.border }}
            />
            <motion.div
              className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent"
              whileHover={{ borderColor: color.border }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-transparent"
              whileHover={{ borderColor: color.border }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent"
              whileHover={{ borderColor: color.border }}
            />

            {/* Scanning line effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ y: "-100%" }}
              whileHover={{ y: "100%" }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
            />

            <motion.span
              className="text-4xl mb-3 block relative z-10"
              whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {interest.icon}
            </motion.span>
            <motion.span className="text-sm font-mono text-text-secondary group-hover:text-text-primary transition-colors relative z-10">
              {interest.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
