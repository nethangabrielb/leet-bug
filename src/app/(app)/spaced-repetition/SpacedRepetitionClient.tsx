"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getActiveRepetitions, getClearedRepetitions } from "@/actions/manageRepetition";
import { getAllProblemsWithPatterns } from "@/actions/getProblems";

import { useState } from "react";
import { Clock, Trophy, Play, ExternalLink } from "lucide-react";
import Link from "next/link";

import Modal from "@/components/Modal";
import Timer from "@/components/Timer";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { updateRepetitionResult } from "@/actions/manageRepetition";

type RepItem = {
  id: string;
  firstAttemptDate: Date | string;
  firstResult: "RED" | "YELLOW" | "GREEN";
  resolveDate: Date | string | null;
  resolveResult: "RED" | "YELLOW" | "GREEN" | null;
  status: "ACTIVE" | "CLEARED";
  clearedDate: Date | string | null;
  problem: {
    id: string;
    leetcodeNumber: number;
    title: string;
    difficulty: "EASY" | "MEDIUM";
    url: string;
    pattern: { name: string };
  };
};

type ProblemItem = {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: "EASY" | "MEDIUM";
  pattern: { name: string };
};

export default function SpacedRepetitionClient() {
  const queryClient = useQueryClient();
  const { data: active, isLoading: isLoadingActive, error: errorActive } = useQuery({
    queryKey: ["activeRepetitions"],
    queryFn: () => getActiveRepetitions(),
  });
  
  const { data: cleared, isLoading: isLoadingCleared, error: errorCleared } = useQuery({
    queryKey: ["clearedRepetitions"],
    queryFn: () => getClearedRepetitions(),
  });
  
  const { data: problems, isLoading: isLoadingProblems, error: errorProblems } = useQuery({
    queryKey: ["allProblems"],
    queryFn: () => getAllProblemsWithPatterns(),
  });

  const [tab, setTab] = useState<"active" | "cleared">("active");
  const [solvingItem, setSolvingItem] = useState<RepItem | null>(null);

  if (errorActive) throw errorActive;
  if (errorCleared) throw errorCleared;
  if (errorProblems) throw errorProblems;

  if (isLoadingActive || isLoadingCleared || isLoadingProblems || !active || !cleared || !problems) {
    return <SpacedRepetitionSkeleton />;
  }
  const now = new Date();

  const handleResult = async (repId: string, result: "RED" | "YELLOW" | "GREEN") => {
    try {
      await updateRepetitionResult({ repetitionId: repId, result });
      setSolvingItem(null);
      toast.success(result === "GREEN" ? "Awesome! Pattern cleared. 🎉" : "Progress recorded. Keep at it! 💪");
      await queryClient.invalidateQueries();
    } catch {
      toast.error("Failed to save your progress.");
    }
  };

  const getDaysUntil = (date: Date | string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Spaced Repetition</h1>
        <p className="mt-1 text-sm text-white/50">Solving a problem once teaches the pattern. Solving it again makes it stick.</p>
      </div>

      <div className="flex gap-1 rounded-xl bg-white/[0.03] p-1">
        <button onClick={() => setTab("active")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${tab === "active" ? "bg-emerald-500/15 text-emerald-300 shadow-sm" : "text-white/40 hover:text-white/60"}`}>
          <Clock className="h-4 w-4" />Active Queue ({active.length})
        </button>
        <button onClick={() => setTab("cleared")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${tab === "cleared" ? "bg-emerald-500/15 text-emerald-300 shadow-sm" : "text-white/40 hover:text-white/60"}`}>
          <Trophy className="h-4 w-4" />Cleared ✅ ({cleared.length})
        </button>
      </div>

      {tab === "active" && (
        <div className="space-y-3">
          {active.length > 0 ? active.map((item) => {
            const daysUntil = getDaysUntil(item.resolveDate);
            const isDue = daysUntil !== null && daysUntil <= 0;
            return (
              <div key={item.id} className={`glass-card flex items-center gap-4 ${isDue ? "!border-emerald-500/20 animate-pulse-glow" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/30">#{item.problem.leetcodeNumber}</span>
                    <p className="truncate text-sm font-medium text-white/90">{item.problem.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{item.problem.pattern.name} • First attempt: {new Date(item.firstAttemptDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <ConfidenceBadge level={item.firstResult} size="sm" />
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDue ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.05] text-white/50"}`}>
                  {daysUntil === null ? "No date" : isDue ? "Due now!" : `${daysUntil}d left`}
                </span>
                <button onClick={() => setSolvingItem(item)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/20">
                  <Play className="h-4 w-4 ml-0.5" />
                </button>
              </div>
            );
          }) : (
            <div className="glass-card flex flex-col items-center py-12">
              <Clock className="mb-3 h-8 w-8 text-white/20" />
              <p className="text-lg font-medium text-white/50">Queue is empty</p>
              <p className="mt-1 text-sm text-white/30">🔴 and 🟡 problems from your practice log will show up here</p>
            </div>
          )}
        </div>
      )}

      {tab === "cleared" && (
        <div className="space-y-3">
          {cleared.length > 0 ? cleared.map((item) => (
            <div key={item.id} className="glass-card flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><Trophy className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white/90">#{item.problem.leetcodeNumber} — {item.problem.title}</p>
                <p className="text-xs text-white/40">{item.problem.pattern.name} • Cleared: {item.clearedDate ? new Date(item.clearedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</p>
              </div>
              <span className="text-lg">🟢</span>
            </div>
          )) : (
            <div className="glass-card flex flex-col items-center py-12">
              <Trophy className="mb-3 h-8 w-8 text-white/20" />
              <p className="text-lg font-medium text-white/50">No cleared items yet</p>
              <p className="mt-1 text-sm text-white/30">Your mastered problems will appear here</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={!!solvingItem} onClose={() => setSolvingItem(null)} title={solvingItem ? `Re-solve: ${solvingItem.problem.title}` : ""} size="lg">
        {solvingItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{solvingItem.problem.pattern.name}</p>
                <p className="text-xs text-white/30">No peeking at your old solution!</p>
              </div>
              <Link href={solvingItem.problem.url} target="_blank" className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20">
                <ExternalLink className="h-3 w-3" />Open on LeetCode
              </Link>
            </div>
            <div className="flex justify-center rounded-xl border border-white/5 bg-[#1a1a1a] p-6">
              <Timer initialMinutes={solvingItem.problem.difficulty === "EASY" ? 10 : 20} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">How did it go?</h3>
              <div className="flex gap-3">
                {([
                  { key: "RED" as const, emoji: "🔴", label: "Still struggling", sub: "→ +3 days" },
                  { key: "YELLOW" as const, emoji: "🟡", label: "Getting closer", sub: "→ +4 days" },
                  { key: "GREEN" as const, emoji: "🟢", label: "Clean solve!", sub: "→ Cleared ✅" },
                ]).map((opt) => (
                  <button key={opt.key} onClick={() => handleResult(solvingItem.id, opt.key)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] ${opt.key === "GREEN" ? "hover:border-emerald-500/30 hover:bg-emerald-500/5" : ""}`}>
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-sm font-medium text-white/80">{opt.label}</span>
                    <span className="text-[10px] text-white/30">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SpacedRepetitionSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-[400px] max-w-full" />
      </div>
      <div className="flex gap-1 rounded-xl bg-white/[0.03] p-1">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl border border-white/5 bg-[#1a1a1a]" />
        ))}
      </div>
    </div>
  );
}
