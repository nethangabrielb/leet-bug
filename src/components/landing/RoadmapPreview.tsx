"use client";

import { motion } from "motion/react";
import { Lock, Swords, Sparkles, BookOpen } from "lucide-react";

const weeks = [
  {
    title: "Week 1",
    theme: "Foundation",
    topics: "Math, Arrays, Hashing",
    status: "active",
  },
  {
    title: "Week 2",
    theme: "Building Up",
    topics: "Strings, Two Pointers, Stacks",
    status: "locked",
  },
  {
    title: "Week 3",
    theme: "Leveling Up",
    topics: "Sliding Window, Binary Search, Sorting",
    status: "locked",
  },
  {
    title: "Week 4",
    theme: "Going Deep",
    topics: "Greedy, Linked Lists, Trees",
    status: "locked",
  },
  {
    title: "Week 5",
    theme: "Boss Battles 🔥",
    topics: "Interview simulations",
    status: "locked",
  },
];

export default function RoadmapPreview() {
  return (
    <section className="py-24 bg-[#111] border-y border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            The 31-Day Roadmap
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            A curated path. No decision fatigue. You don&apos;t pick what to study—you just show up and run the module.
          </p>
        </motion.div>

        <div className="space-y-4">
          {weeks.map((week, i) => (
            <motion.div
              key={week.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border ${
                week.status === "active"
                  ? "bg-white/5 border-emerald-500/30"
                  : "bg-[#0a0a0a] border-white/5 text-white/40"
              }`}
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold ${
                  week.status === "active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5"
                }`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${week.status === "active" ? "text-white" : ""}`}>
                    {week.theme}
                  </h3>
                  <p className={week.status === "active" ? "text-white/60" : "text-white/30"}>
                    {week.topics}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center md:justify-end">
                {week.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                    <Sparkles className="w-4 h-4" /> Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {i === 4 ? <Swords className="w-5 h-5 text-amber-500/50" /> : <Lock className="w-4 h-4" />}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-start"
        >
          <BookOpen className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-indigo-200/80 leading-relaxed font-medium">
            <strong className="text-indigo-300">Days 7, 14, 21, and 28 are hardcoded Review Days.</strong> The app literally won&apos;t let you progress to new material. You are forced to stop, consolidate your knowledge, and clear your Spaced Repetition queue.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
