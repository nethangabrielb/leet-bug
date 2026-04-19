"use client";

import { motion } from "motion/react";
import { Compass, RotateCcw, GitFork, BrainCircuit, Activity } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "The 31-Day Roadmap",
    description: "Fixed weekly progression from Arrays to Trees. No decisions needed, just follow the path.",
    colSpan: "md:col-span-2",
  },
  {
    icon: Activity,
    title: "Traffic Light System",
    description: "Every problem rated. Red = rewrite from memory. Yellow = log insight. Green = retire.",
    colSpan: "md:col-span-1",
  },
  {
    icon: RotateCcw,
    title: "Spaced Repetition",
    description: "Problems come back at exactly 3 and 7 days. You don't forget what you learn.",
    colSpan: "md:col-span-1",
  },
  {
    icon: GitFork,
    title: "Pattern Flowchart",
    description: "A visual decision tree to identify which algorithm to use before writing a line.",
    colSpan: "md:col-span-1",
  },
  {
    icon: BrainCircuit,
    title: "The Mental Game",
    description: "Pre-exam rituals, stuck protocols, and edge case checklists. For when your brain goes blank.",
    colSpan: "md:col-span-1",
  },
];

export default function SystemOverview() {
  return (
    <section className="py-24 bg-[#111] border-b border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            The 5 Pillars of LeetBug
          </h2>
          <p className="text-lg text-white/50 max-w-2xl">
            A complete methodology to rewire how you learn data structures and algorithms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group flex flex-col p-8 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-emerald-500/30 hover:bg-white/5 transition-all duration-300 ${pillar.colSpan}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
              </div>
              <p className="text-white/60 leading-relaxed text-base flex-1">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
