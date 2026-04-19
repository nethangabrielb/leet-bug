"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Column: Copy */}
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 mb-6"
          >
            <Terminal className="w-3 h-3" />
            <span>systemctl start training</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white"
          >
            Stop grinding. <br />
            <span className="text-emerald-500">Start training.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed"
          >
            A structured 31-day LeetCode system with spaced repetition, confidence tracking, and anti-panic interview prep. Built for beginners who want a system, not a grind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-lg font-bold rounded-xl transition-all group w-full sm:w-auto"
            >
              Start the 31-Day Plan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Stylized Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex-1 w-full max-w-lg md:max-w-none hidden md:block"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#111] overflow-hidden shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-xs font-mono text-white/40 ml-4">roadmap.sh</div>
            </div>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-white/40">Week 1</span>
                  <span className="text-white/80">Arrays & Hashing</span>
                </div>
                <span className="px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-400">MASTERY 100%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10 border-l-2 border-l-yellow-500">
                <div className="flex items-center gap-3">
                  <span className="text-white/40">Week 2</span>
                  <span className="text-white/80">Two Pointers & Stack</span>
                </div>
                <span className="px-2 py-1 rounded text-[10px] bg-yellow-500/20 text-yellow-400">REVIEW DUE</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-white/40">Week 3</span>
                  <span className="text-white/80">Sliding Window & Binary Search</span>
                </div>
                <span className="text-white/30 text-xs">Locked</span>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 border-dashed">
                <div className="text-xs text-white/40 mb-2">SPACED REPETITION QUEUE</div>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 text-xs">#121</div>
                  <div className="h-8 flex-1 rounded bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500 text-xs">#20</div>
                  <div className="h-8 flex-[2] rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xs">Queue Empty</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
