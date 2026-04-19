"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

export default function FooterCTA() {
  return (
    <footer className="relative bg-[#0a0a0a] overflow-hidden pt-32 pb-12 border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
            You don&apos;t need 500 problems.
            <br />
            <span className="text-emerald-500">You need the right 31 days.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-lg font-bold rounded-xl transition-all group w-full sm:w-auto shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]"
            >
              Start the 31-Day Plan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Minimal Footer Links */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 text-sm text-white/40">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span>Built with focus.</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Open Source.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="https://github.com/nethangabrielb/leet-bug" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" />
              Source Code
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
