"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getProblems } from "@/actions/getProblems";

import { useState } from "react";
import Link from "next/link";

import {
  ExternalLink,
  Star,
  Trophy,
  RotateCcw,
  Swords,
  Lock,
  CheckCircle2,
} from "lucide-react";

import Modal from "@/components/Modal";
import Timer from "@/components/Timer";
import LogForm, { type LogFormData } from "@/components/LogForm";
import { logPractice } from "@/actions/logPractice";

type Problem = {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: "EASY" | "MEDIUM";
  url: string;
  isStarred: boolean;
  dayInPlan: number | null;
  weekInPlan: number | null;
  pattern: { id: string; name: string };
  practiceLogs: Array<{ confidence: "RED" | "YELLOW" | "GREEN" }>;
};

interface RoadmapClientProps {
  problems: Problem[];
}

const weekMeta = [
  { week: 1, title: "Math, Arrays, Hashing", subtitle: "Foundation" },
  { week: 2, title: "Strings, Two Pointers, Stack", subtitle: "Building Up" },
  { week: 3, title: "Sliding Window, Binary Search, Sorting", subtitle: "Leveling Up" },
  { week: 4, title: "Sorting, Greedy, Linked Lists, Trees", subtitle: "Going Deep" },
  { week: 5, title: "Interview Simulations", subtitle: "Boss Battles 🔥" },
];

const reviewDays = [7, 14, 21, 28];
const bossDays = [29, 30, 31];

export default function RoadmapClient() {
  const queryClient = useQueryClient();
  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["roadmapProblems"],
    queryFn: () => getProblems(),
  });

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  if (error) throw error;
  if (isLoading || !problems) {
    return <RoadmapSkeleton />;
  }

  // Group problems by day
  const dayMap: Record<number, Problem[]> = {};
  for (const p of problems) {
    if (p.dayInPlan) {
      if (!dayMap[p.dayInPlan]) dayMap[p.dayInPlan] = [];
      dayMap[p.dayInPlan].push(p);
    }
  }

  // Determine completed days
  const completedDays = new Set<number>();
  for (const p of problems) {
    if (p.dayInPlan && p.practiceLogs.length > 0) {
      completedDays.add(p.dayInPlan);
    }
  }

  const handleLogSubmit = async (data: LogFormData) => {
    try {
      await logPractice({
        problemId: data.problemId,
        day: data.day,
        timeTaken: data.timeTaken,
        timeLimit: data.timeLimit,
        solved: data.solved,
        confidence: data.confidence,
        patternUsed: data.patternUsed,
        trippedUp: data.trippedUp,
        keyInsight: data.keyInsight,
      });
      setSelectedProblem(null);
      toast.success("Progress saved! Great job. 🌟");
      await queryClient.invalidateQueries();
    } catch (e: any) {
      toast.error(e.message || "Failed to save progress.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">31-Day Roadmap</h1>
        <p className="mt-1 text-sm text-white/50">
          Your structured path from zero to confident under pressure
        </p>
      </div>

      {weekMeta.map((week) => (
        <div key={week.week} className="space-y-3">
          {/* Week header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 text-sm font-bold text-emerald-400">
              W{week.week}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{week.title}</h2>
              <p className="text-xs text-white/40">{week.subtitle}</p>
            </div>
          </div>

          {/* Day cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from(
              { length: week.week <= 4 ? 7 : 3 },
              (_, i) => (week.week - 1) * 7 + i + 1
            )
              .filter((d) => d <= 31)
              .map((day) => {
                const isReview = reviewDays.includes(day);
                const isBoss = bossDays.includes(day);
                const isCompleted = completedDays.has(day);
                const dayProblems = dayMap[day] || [];

                return (
                  <div
                    key={day}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${isBoss
                      ? "border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:border-amber-500/40"
                      : isReview
                        ? "border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 hover:border-cyan-500/40"
                        : isCompleted
                          ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/5"
                      }`}
                  >
                    {/* Day number */}
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${isBoss
                          ? "text-amber-400"
                          : isReview
                            ? "text-emerald-400"
                            : isCompleted
                              ? "text-emerald-400"
                              : "text-white/40"
                          }`}
                      >
                        Day {day}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      {isBoss && <Swords className="h-4 w-4 text-amber-400" />}
                      {isReview && <RotateCcw className="h-4 w-4 text-emerald-400" />}
                    </div>

                    {/* Content */}
                    {isReview ? (
                      <p className="text-sm font-medium text-cyan-300">
                        Review Day
                      </p>
                    ) : dayProblems.length > 0 ? (
                      <div className="space-y-2">
                        {dayProblems.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedProblem(p)}
                            className="flex w-full items-start gap-2 text-left"
                          >
                            <span className="mt-0.5 font-mono text-[10px] text-white/20">
                              #{p.leetcodeNumber}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-white/80 group-hover:text-white">
                                {p.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="text-[10px] text-white/30">
                                  {p.pattern.name}
                                </span>
                                {p.isStarred && (
                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                )}
                                {p.practiceLogs[0] && (
                                  <span className="text-xs">
                                    {p.practiceLogs[0].confidence === "GREEN"
                                      ? "🟢"
                                      : p.practiceLogs[0].confidence ===
                                        "YELLOW"
                                        ? "🟡"
                                        : "🔴"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-white/30 italic">
                        {isBoss ? "Full simulation" : "No problems"}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Problem Detail Modal */}
      <Modal
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        title={selectedProblem ? `#${selectedProblem.leetcodeNumber} — ${selectedProblem.title}` : ""}
        size="lg"
      >
        {selectedProblem && (
          <div className="space-y-6">
            {/* Problem info */}
            <div className="flex items-center gap-3">
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ${selectedProblem.difficulty === "EASY"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  }`}
              >
                {selectedProblem.difficulty}
              </span>
              <span className="text-sm text-white/50">
                {selectedProblem.pattern.name}
              </span>
              {selectedProblem.isStarred && (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              )}
              <Link
                href={selectedProblem.url}
                target="_blank"
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <ExternalLink className="h-3 w-3" />
                Open on LeetCode
              </Link>
            </div>

            {/* Timer */}
            <div className="flex justify-center rounded-xl border border-white/5 bg-[#1a1a1a] p-6">
              <Timer
                initialMinutes={
                  selectedProblem.difficulty === "EASY" ? 20 : 35
                }
              />
            </div>

            {/* Quick Log Form */}
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">
                Log Your Attempt
              </h3>
              <LogForm
                problems={[selectedProblem]}
                defaultProblemId={selectedProblem.id}
                defaultDay={selectedProblem.dayInPlan || undefined}
                onSubmit={handleLogSubmit}
                onCancel={() => setSelectedProblem(null)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-[400px] max-w-full" />
      </div>
      {[1, 2, 3].map((week) => (
        <div key={week} className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-64 mb-1 max-w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <Skeleton key={day} className="h-[120px] rounded-xl border border-white/[0.08] bg-white/[0.02]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
