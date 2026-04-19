"use client";

import { motion } from "motion/react";
import { Sunrise, Zap, RefreshCw, Moon } from "lucide-react";

const blocks = [
  {
    icon: Sunrise,
    title: "Morning Warm-Up",
    time: "15 min",
    desc: "Wake the brain. Zero new learning. Just run an easy problem you've fully mastered.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Zap,
    title: "Core Practice",
    time: "35–50 min",
    desc: "Attack the daily Roadmap module. Mandatory timers applied based on difficulty.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: RefreshCw,
    title: "Spaced Repetition",
    time: "15–20 min",
    desc: "Clear out the Red and Yellow backlog that the algorithm has queued for today.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Moon,
    title: "Evening Reflection",
    time: "10 min",
    desc: "Mentally dump your key insights. Log your 'Aha!' moments for the day. Close the laptop.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
];

export default function DailyRoutine() {
  return (
    <section className="py-24 bg-[#111] border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            The Daily Routine
          </h2>
          <p className="text-xl text-emerald-400 font-medium">
            ~75 to 95 minutes a day.
          </p>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mt-2">
            Enough to make real progress. Not enough to burn out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-orange-500/20 via-emerald-500/20 to-indigo-500/20 -z-10" />

          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative group hover:border-white/20 transition-colors"
            >
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${block.bg} ${block.color} group-hover:scale-110 transition-transform`}>
                <block.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{block.title}</h3>
              <div className="text-xs font-mono px-3 py-1 rounded bg-white/5 text-white/60 mb-4 inline-block">
                {block.time}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                {block.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
