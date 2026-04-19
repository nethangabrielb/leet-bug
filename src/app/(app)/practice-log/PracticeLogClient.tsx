"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getPracticeLogs, getAllProblemsWithPatterns } from "@/actions/getProblems";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Filter } from "lucide-react";

import Modal from "@/components/Modal";
import LogForm, { type LogFormData } from "@/components/LogForm";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { logPractice } from "@/actions/logPractice";

type PracticeLogEntry = {
  id: string;
  day: number | null;
  date: Date | string;
  timeTaken: number | null;
  timeLimit: number | null;
  solved: "YES" | "NO" | "PARTIAL";
  confidence: "RED" | "YELLOW" | "GREEN";
  patternUsed: string | null;
  trippedUp: string | null;
  keyInsight: string | null;
  problem: {
    id: string;
    leetcodeNumber: number;
    title: string;
    difficulty: "EASY" | "MEDIUM";
    pattern: { id: string; name: string };
  };
};

type Problem = {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: "EASY" | "MEDIUM";
  pattern: { id: string; name: string };
};

interface Props {
  logs: PracticeLogEntry[];
  problems: Problem[];
}

export default function PracticeLogClient() {
  const { data: logs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["practiceLogs"],
    queryFn: () => getPracticeLogs(),
  });
  
  const { data: problems, isLoading: isLoadingProblems } = useQuery({
    queryKey: ["allProblems"],
    queryFn: () => getAllProblemsWithPatterns(),
  });

  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterConfidence, setFilterConfidence] = useState<string>("ALL");

  if (isLoadingLogs || isLoadingProblems || !logs || !problems) {
    return <PracticeLogSkeleton />;
  }

  const filtered = filterConfidence === "ALL" ? logs : logs.filter((l) => l.confidence === filterConfidence);

  const handleSubmit = async (data: LogFormData) => {
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
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Practice Log</h1>
          <p className="mt-1 text-sm text-white/50">Track every attempt. The 🔴s become 🟡s. The 🟡s become 🟢s.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25">
          <Plus className="h-4 w-4" />New Entry
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-white/30" />
        {["ALL", "RED", "YELLOW", "GREEN"].map((c) => (
          <button key={c} onClick={() => setFilterConfidence(c)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filterConfidence === c ? "bg-violet-500/15 text-violet-300" : "bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60"}`}>
            {c === "ALL" ? "All" : c === "RED" ? "🔴 Red" : c === "YELLOW" ? "🟡 Yellow" : "🟢 Green"}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/30">{filtered.length} entries</span>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((log) => {
            const isExpanded = expandedId === log.id;
            const date = new Date(log.date);
            return (
              <div key={log.id} className="glass-card !p-0 overflow-hidden">
                <button onClick={() => setExpandedId(isExpanded ? null : log.id)} className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-white/[0.02]">
                  {log.day && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">D{log.day}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">#{log.problem.leetcodeNumber} — {log.problem.title}</p>
                    <p className="text-xs text-white/40">{log.problem.pattern.name} • {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} {log.timeTaken && `• ${log.timeTaken} min`}</p>
                  </div>
                  <ConfidenceBadge level={log.confidence} size="sm" />
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${log.problem.difficulty === "EASY" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}>{log.problem.difficulty}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-white/30" /> : <ChevronDown className="h-4 w-4 text-white/30" />}
                </button>
                {isExpanded && (
                  <div className="border-t border-white/[0.06] bg-white/[0.01] px-4 py-3 space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-xs text-white/40">Solved:</span> <span className="text-white/80">{log.solved}</span></div>
                      <div><span className="text-xs text-white/40">Pattern:</span> <span className="text-white/80">{log.patternUsed || log.problem.pattern.name}</span></div>
                    </div>
                    {log.trippedUp && <div className="text-sm"><span className="text-xs text-white/40">What tripped you up:</span><p className="text-white/70">{log.trippedUp}</p></div>}
                    {log.keyInsight && <div className="text-sm"><span className="text-xs text-white/40">Key insight:</span><p className="text-white/70">{log.keyInsight}</p></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center py-12">
          <p className="text-lg font-medium text-white/50">No entries yet</p>
          <p className="mt-1 text-sm text-white/30">Start logging your practice sessions</p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Practice Session" size="lg">
        <LogForm problems={problems} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}

function PracticeLogSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl border border-white/[0.06] bg-white/[0.02]" />
        ))}
      </div>
    </div>
  );
}
