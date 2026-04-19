"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { Brain, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

// New Landing Page Components
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SystemOverview from "@/components/landing/SystemOverview";
import TrafficLightSection from "@/components/landing/TrafficLightSection";
import RoadmapPreview from "@/components/landing/RoadmapPreview";
import SkipSection from "@/components/landing/SkipSection";
import DailyRoutine from "@/components/landing/DailyRoutine";
import FooterCTA from "@/components/landing/FooterCTA";

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 font-sans">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Brain className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-lg font-bold tracking-tight">LeetBug</span>
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
                  className="text-sm font-medium px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors hidden sm:block"
                >
                  Get Started Free
                </Link>
              </>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-4 py-2 bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-white/50 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main>
        <Hero />
        <ProblemSection />
        <SystemOverview />
        <TrafficLightSection />
        <RoadmapPreview />
        <SkipSection />
        <DailyRoutine />
      </main>

      {/* Reusable Footer CTA */}
      <FooterCTA />
      
    </div>
  );
}
