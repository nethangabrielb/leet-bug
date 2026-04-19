"use client";

import { motion } from "motion/react";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TrafficLightSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium mb-6">
            <span className="flex gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </span>
            The Core Protocol
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Stop pretending you &quot;got it&quot;.
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            The rewrite-from-memory step is what separates people who remember algorithms from people who just memorize syntax.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* RED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col p-8 rounded-2xl bg-gradient-to-b from-red-500/10 to-transparent border border-red-500/20 relative group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t-2xl" />
            <div className="mb-6 flex items-center justify-between">
              <span className="text-4xl">🔴</span>
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Couldn&apos;t Solve It</h3>
            <p className="text-white/70 leading-relaxed font-medium mb-6 flex-1">
              Good. Read the solution, close the tab, and <strong className="text-red-400">rewrite it from memory</strong>. The app automatically queues it for your Spaced Repetition review in exactly 3 days.
            </p>
          </motion.div>

          {/* YELLOW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col p-8 rounded-2xl bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 rounded-t-2xl" />
            <div className="mb-6 flex items-center justify-between">
              <span className="text-4xl">🟡</span>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Struggled</h3>
            <p className="text-white/70 leading-relaxed font-medium mb-6 flex-1">
              Solved it but it was messy? Write down the key insight. Review the top 3 discussion solutions. The app queues it for review in 7 days to reinforce the optimal approach.
            </p>
          </motion.div>

          {/* GREEN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col p-8 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-2xl" />
            <div className="mb-6 flex items-center justify-between">
              <span className="text-4xl">🟢</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Clean Solve</h3>
            <p className="text-white/70 leading-relaxed font-medium mb-6 flex-1">
              You correctly identified the pattern and executed cleanly. Log it, retire the problem, and move on.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
