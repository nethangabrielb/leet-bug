"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { motion } from "motion/react";
import Link from "next/link";
import { Brain, LineChart, Code2, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-cyan-400 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LeetBug</span>
          </div>

          <div className="flex items-center gap-4">
            {!isPending && !session ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-40 max-w-7xl mx-auto p-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Master Algorithmic Patterns
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-white/60"
        >
          Conquer the Interview. <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Scientifically.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-white/50 mb-12"
        >
          Stop grinding randomly. We use spaced repetition, pattern mastery, and
          focused logging to ensure you truly understand data structures and
          algorithms.
        </motion.p>

        {/* Auth State Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {isPending ? (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : session ? (
              <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email[0].toUpperCase()}
                  </div>
                  <p className="text-white/70 text-sm">
                    You are logged in as <br />
                    <span className="font-semibold text-white">{session.user.email}</span>
                  </p>
                </div>

                <div className="flex gap-4 w-full">
                  <Link
                    href="/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all group/btn"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all text-white/70 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 relative z-10">
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-white/90 rounded-xl font-medium transition-all"
                >
                  Start Your Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-all"
                >
                  Log into existing account
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"
        >
          {[
            {
              icon: Brain,
              title: "Spaced Repetition",
              desc: "Algorithms automatically schedule reviews exactly when you're about to forget them.",
              color: "text-purple-400"
            },
            {
              icon: LineChart,
              title: "Pattern Mastery",
              desc: "Don't just solve problems blindly. See your true mastery levels across 10 core patterns.",
              color: "text-indigo-400"
            },
            {
              icon: Code2,
              title: "Daily Consistency",
              desc: "Track daily check-ins, build streaks, and stay motivated with detailed logging.",
              color: "text-cyan-400"
            }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors group">
              <feat.icon className={`w-8 h-8 ${feat.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
