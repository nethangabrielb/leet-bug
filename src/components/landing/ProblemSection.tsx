"use client";

import { motion } from "motion/react";

export default function ProblemSection() {
  return (
    <section className="py-32 bg-[#0a0a0a] relative flex justify-center">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-10 leading-tight">
            The 500-Problem Grind <br className="hidden md:block"/>
            <span className="text-white/40">is a trap.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6 text-xl md:text-2xl text-white/70 font-medium leading-relaxed max-w-3xl mx-auto"
        >
          <p>
            You open LeetCode. You filter by &quot;Easy&quot;. You solve 40 random problems across arrays, strings, and trees over two weeks. You feel productive.
          </p>
          <p className="text-white">
            A month later, you step into a technical interview.
          </p>
          <p>
            The interviewer asks a Two Pointers question. You stare at the screen. You know you&apos;ve solved something like this before, but your mind goes completely blank. You freeze.
          </p>
          <p className="text-red-400">
            You fail the interview and conclude you&apos;re just &quot;bad at algorithms.&quot;
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="mt-16 pt-16 border-t border-white/10"
        >
          <p className="text-2xl font-bold text-white">
            You don&apos;t lack skill. <span className="text-emerald-500">You lack a system.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
