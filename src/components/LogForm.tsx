"use client";

import { useState } from "react";

interface LogFormProps {
  problems: Array<{
    id: string;
    leetcodeNumber: number;
    title: string;
    difficulty: "EASY" | "MEDIUM";
    pattern: { name: string };
  }>;
  onSubmit: (data: LogFormData) => Promise<void>;
  onCancel?: () => void;
  defaultProblemId?: string;
  defaultDay?: number;
}

export interface LogFormData {
  problemId: string;
  day: number | null;
  timeTaken: number | null;
  timeLimit: number | null;
  solved: "YES" | "NO" | "PARTIAL";
  confidence: "RED" | "YELLOW" | "GREEN";
  patternUsed: string;
  trippedUp: string;
  keyInsight: string;
}

export default function LogForm({ problems, onSubmit, onCancel, defaultProblemId, defaultDay }: LogFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LogFormData>({
    problemId: defaultProblemId || "",
    day: defaultDay || null,
    timeTaken: null,
    timeLimit: null,
    solved: "NO",
    confidence: "RED",
    patternUsed: "",
    trippedUp: "",
    keyInsight: "",
  });

  const selectedProblem = problems.find((p) => p.id === formData.problemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(formData); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Problem</label>
        <select value={formData.problemId} onChange={(e) => setFormData({ ...formData, problemId: e.target.value })} required
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50">
          <option value="" className="bg-[oklch(0.16_0.005_285)]">Select a problem...</option>
          {problems.map((p) => (
            <option key={p.id} value={p.id} className="bg-[oklch(0.16_0.005_285)]">#{p.leetcodeNumber} — {p.title} ({p.difficulty})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Day #</label>
          <input type="number" min={1} max={31} value={formData.day || ""} onChange={(e) => setFormData({ ...formData, day: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Time (min)</label>
          <input type="number" min={0} value={formData.timeTaken || ""} onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Limit (min)</label>
          <input type="number" min={0} value={formData.timeLimit || (selectedProblem?.difficulty === "EASY" ? 20 : 35) || ""} onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Solved?</label>
        <div className="flex gap-2">
          {(["YES", "NO", "PARTIAL"] as const).map((opt) => (
            <button key={opt} type="button" onClick={() => setFormData({ ...formData, solved: opt })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${formData.solved === opt ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"}`}>
              {opt === "PARTIAL" ? "Partial" : opt === "YES" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Confidence</label>
        <div className="flex gap-2">
          {([{ key: "RED" as const, emoji: "🔴", label: "Struggled" }, { key: "YELLOW" as const, emoji: "🟡", label: "Shaky" }, { key: "GREEN" as const, emoji: "🟢", label: "Clean" }]).map((opt) => (
            <button key={opt.key} type="button" onClick={() => setFormData({ ...formData, confidence: opt.key })}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                formData.confidence === opt.key
                  ? opt.key === "RED" ? "border-red-500/40 bg-red-500/15 text-red-300" : opt.key === "YELLOW" ? "border-yellow-500/40 bg-yellow-500/15 text-yellow-300" : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
              }`}>
              <span>{opt.emoji}</span><span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Pattern Used</label>
        <input type="text" value={formData.patternUsed || selectedProblem?.pattern?.name || ""} onChange={(e) => setFormData({ ...formData, patternUsed: e.target.value })} placeholder="e.g., Two Pointers, Sliding Window"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">What tripped you up?</label>
        <textarea value={formData.trippedUp} onChange={(e) => setFormData({ ...formData, trippedUp: e.target.value })} placeholder='One sentence — or "Nothing, clean solve"' rows={2}
          className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Key Insight</label>
        <textarea value={formData.keyInsight} onChange={(e) => setFormData({ ...formData, keyInsight: e.target.value })} placeholder="One sentence you want to remember" rows={2}
          className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50" />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06]">Cancel</button>
        )}
        <button type="submit" disabled={!formData.problemId || loading}
          className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50">
          {loading ? "Saving..." : "Log Practice"}
        </button>
      </div>
    </form>
  );
}
