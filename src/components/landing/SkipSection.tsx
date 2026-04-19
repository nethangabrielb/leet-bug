"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

const skippedTopics = [
  "Dynamic Programming",
  "Graph BFS/DFS on Matrices",
  "Priority Queues / Heaps",
  "Tries & Segment Trees",
  "Hard Problems",
];

export default function SkipSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            What You <span className="text-red-500 line-through decoration-4 opacity-80">WON&apos;T</span> Study
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Knowing what to skip is half the battle. Juniors don&apos;t need these. LeetBug won&apos;t waste your time on them.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {skippedTopics.map((topic, i) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111] border border-red-500/10 overflow-hidden"
            >
              {/* Strike-through line */}
              <div className="absolute left-4 right-4 h-[2px] top-1/2 -translate-y-1/2 bg-red-500/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              
              <X className="w-5 h-5 text-red-500/50" />
              <span className="text-lg font-medium text-white/40 line-through decoration-red-500/30 decoration-2">
                {topic}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
