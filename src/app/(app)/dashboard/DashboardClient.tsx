"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/actions/getDashboardStats";
import { toast } from "sonner";
import Link from "next/link";

import {
  CalendarDays,
  Target,
  Flame,
  RotateCcw,
  TrendingUp,
  ExternalLink,
  Star,
  Trophy,
} from "lucide-react";

import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";

interface DashboardStats {
  daysCompleted: number;
  totalDays: number;
  confidenceCounts: { RED: number; YELLOW: number; GREEN: number };
  streak: number;
  dueToday: number;
  weeklyDone: number;
  weeklyTarget: number;
  currentDay: number;
  todayProblems: Array<{
    id: string;
    leetcodeNumber: number;
    title: string;
    difficulty: "EASY" | "MEDIUM";
    url: string;
    pattern: { name: string };
  }>;
  patternMastery: Array<{
    id: string;
    number: number;
    name: string;
    totalProblems: number;
    solved: number;
    greenCount: number;
    mastery: number;
  }>;
  totalLogs: number;
  isReviewDay: boolean;
  isReviewDayBlocked: boolean;
}

export default function DashboardClient() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => getDashboardStats(new Date().getTimezoneOffset()),
  });

  if (error) throw error;
  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  const handleCompleteReviewDay = async () => {
    try {
      const { markReviewDayComplete } = await import("@/actions/markReviewDayComplete");
      await markReviewDayComplete(stats.currentDay);
      toast.success("Review day complete! Unlocked new problems. 🚀");
      await queryClient.invalidateQueries();
    } catch (e: any) {
      toast.error(e.message || "Failed to complete review day.");
    }
  };
  const progress = Math.round((stats.daysCompleted / stats.totalDays) * 100);
  const totalConfidence =
    stats.confidenceCounts.RED +
    stats.confidenceCounts.YELLOW +
    stats.confidenceCounts.GREEN;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      {stats.isReviewDay && stats.isReviewDayBlocked && (
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 animate-pulse-glow shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-amber-400">STOP. It&apos;s Day {stats.currentDay}: Review Day.</h2>
              <p className="mt-1 text-sm text-white/70">
                You cannot progress to new material. You must stop, consolidate your knowledge, and clear your Spaced Repetition queue.
              </p>
            </div>
            <Link
              href="/spaced-repetition"
              className="whitespace-nowrap rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Clear Queue Now ({stats.dueToday} Due)
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Your LeetCode training command center
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Days Completed"
          value={`${stats.daysCompleted}/${stats.totalDays}`}
          subtitle={`${progress}% through the plan`}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          title="Current Streak"
          value={stats.streak}
          subtitle={stats.streak > 0 ? "Keep going! 🔥" : "Start today!"}
          icon={<Flame className="h-5 w-5" />}
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          subtitle="Spaced repetition items"
          icon={<RotateCcw className="h-5 w-5" />}
        />
        <StatCard
          title="Total Sessions"
          value={stats.totalLogs}
          subtitle="Practice log entries"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Problem */}
          <div className="glass-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Problem — Day {stats.currentDay}
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                31-Day Plan
              </span>
            </div>
            
            {stats.isReviewDayBlocked ? (
              <div className="rounded-xl border border-white/5 bg-black/20 p-8 text-center">
                <RotateCcw className="mx-auto h-8 w-8 text-amber-500/50 mb-3" />
                <p className="text-base font-medium text-amber-400">Locked</p>
                <p className="text-sm text-white/40 mt-1">Clear your Spaced Repetition queue to unlock Day {stats.currentDay + 1}.</p>
              </div>
            ) : stats.isReviewDay && !stats.isReviewDayBlocked ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
                <div>
                  <Trophy className="mx-auto h-8 w-8 text-emerald-400 mb-3" />
                  <p className="text-base font-medium text-white/90">Queue Cleared! ✨</p>
                  <p className="text-sm text-white/50 mt-1">You have successfully consolidated your knowledge for Day {stats.currentDay}.</p>
                </div>
                <button
                  onClick={handleCompleteReviewDay}
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Proceed to Day {stats.currentDay + 1}
                </button>
              </div>
            ) : stats.todayProblems.length > 0 ? (
              <div className="space-y-3">
                {stats.todayProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] p-4 transition-all hover:border-emerald-500/30 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-white/30">
                        #{problem.leetcodeNumber}
                      </span>
                      <div>
                        <p className="font-medium text-white">
                          {problem.title}
                        </p>
                        <p className="text-xs text-white/40">
                          {problem.pattern.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          problem.difficulty === "EASY"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <Link
                        href={problem.url}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-white/40 py-6">
                {stats.daysCompleted >= 31
                  ? "🎉 You've completed the 31-day plan!"
                  : "No problems scheduled for today"}
              </p>
            )}
          </div>

          {/* Pattern Mastery Heatmap */}
          <div className="glass-card">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Pattern Mastery
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {stats.patternMastery.map((pattern) => (
                <Link
                  href={`/patterns/${pattern.id}`}
                  key={pattern.id}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-[#1a1a1a] p-3 transition-all hover:border-emerald-500/30 hover:bg-white/5"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                    style={{
                      backgroundColor:
                        pattern.mastery >= 80
                          ? "oklch(0.723 0.219 149.579 / 20%)"
                          : pattern.mastery >= 40
                            ? "oklch(0.795 0.184 86.047 / 20%)"
                            : pattern.mastery > 0
                              ? "oklch(0.637 0.237 25.331 / 20%)"
                              : "oklch(1 0 0 / 5%)",
                      color:
                        pattern.mastery >= 80
                          ? "oklch(0.623 0.188 159.805)"
                          : pattern.mastery >= 40
                            ? "oklch(0.795 0.184 86.047)"
                            : pattern.mastery > 0
                              ? "oklch(0.637 0.237 25.331)"
                              : "oklch(1 0 0 / 30%)",
                    }}
                  >
                    {pattern.mastery}%
                  </div>
                  <span className="text-center text-[11px] font-medium text-white/60 group-hover:text-white/80">
                    {pattern.name}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {pattern.solved}/{pattern.totalProblems}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="glass-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Weekly Progress
              </h2>
              <span className="text-sm text-white/50">
                {stats.weeklyDone}/{stats.weeklyTarget} problems
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{
                  width: `${Math.min(100, (stats.weeklyDone / stats.weeklyTarget) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-white/30">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Progress Ring */}
          <div className="glass-card flex flex-col items-center">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
              31-Day Progress
            </h2>
            <ProgressRing
              progress={progress}
              size={160}
              strokeWidth={10}
              label={`${stats.daysCompleted}`}
              sublabel={`of ${stats.totalDays} days`}
            />
            <div className="mt-4 flex w-full items-center justify-center">
              <Link
                href="/roadmap"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                View Roadmap
                <TrendingUp className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Confidence Breakdown */}
          <div className="glass-card">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
              Confidence Breakdown
            </h2>
            {totalConfidence > 0 ? (
              <div className="space-y-3">
                {[
                  {
                    label: "Clean Solve",
                    emoji: "🟢",
                    count: stats.confidenceCounts.GREEN,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Struggled",
                    emoji: "🟡",
                    count: stats.confidenceCounts.YELLOW,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Needed Help",
                    emoji: "🔴",
                    count: stats.confidenceCounts.RED,
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span>{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-medium text-white/80">
                          {item.count}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{
                            width: `${(item.count / totalConfidence) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-white/40 py-4">
                No practice sessions yet
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/practice-log"
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white/70 transition-all hover:border-emerald-500/30 hover:bg-white/5 hover:text-white"
              >
                <Star className="h-4 w-4 text-emerald-400" />
                Log Practice Session
              </Link>
              <Link
                href="/spaced-repetition"
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white/70 transition-all hover:border-emerald-500/30 hover:bg-white/5 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 text-emerald-400" />
                Review Due Items
              </Link>
              <Link
                href="/patterns"
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white/70 transition-all hover:border-emerald-500/30 hover:bg-white/5 hover:text-white"
              >
                <Target className="h-4 w-4 text-emerald-400" />
                Study Patterns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-[200px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
          <Skeleton className="h-[200px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
          <Skeleton className="h-[150px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
          <Skeleton className="h-[250px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
          <Skeleton className="h-[200px] rounded-xl border border-white/5 bg-[#1a1a1a]" />
        </div>
      </div>
    </div>
  );
}
