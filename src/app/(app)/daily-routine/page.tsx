"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Sun,
  Code2,
  RotateCcw,
  Moon,
  AlertTriangle,
} from "lucide-react";

import { checkInDaily, getTodayCheckIn } from "@/actions/checkInDaily";

const blocks = [
  {
    key: "block1Done" as const,
    icon: Sun,
    title: "Block 1 — Morning Warm-Up",
    duration: "15 min",
    time: "First thing in the morning",
    items: [
      "Review yesterday's log entry. Read the pattern and key insight.",
      "Glance at today's problem. Read the statement only — don't start solving.",
      "Identify the pattern. Run the Pattern Flowchart in your head.",
      "Review the template for that pattern. Read it once, close it.",
    ],
    color: "from-amber-500/20 to-orange-500/20",
    textColor: "text-amber-400",
  },
  {
    key: "block2Done" as const,
    icon: Code2,
    title: "Block 2 — Core Practice",
    duration: "35–50 min",
    time: "Your most focused time of day",
    items: [
      "Set your timer. Easy: 20 min, Medium: 35 min.",
      "Talk through your approach out loud before typing.",
      "Code the solution. Get it working first.",
      "Test with edge cases before submitting.",
      "Follow the 🔴🟡🟢 protocol from Practice Guide.",
    ],
    color: "from-violet-500/20 to-indigo-500/20",
    textColor: "text-violet-400",
  },
  {
    key: "block3Done" as const,
    icon: RotateCcw,
    title: "Block 3 — Spaced Repetition",
    duration: "15–20 min",
    time: "2+ hours after Block 2",
    items: [
      "Check Spaced Repetition Queue. Anything due today?",
      "Solve queued problem from scratch, timed. Easy <10 min, Medium <20 min.",
      "Rate yourself: 🔴→+3d, 🟡→+7d, 🟢→Remove from queue.",
    ],
    color: "from-cyan-500/20 to-blue-500/20",
    textColor: "text-cyan-400",
  },
  {
    key: "block4Done" as const,
    icon: Moon,
    title: "Block 4 — Evening Reflection",
    duration: "10 min",
    time: "End of study day — non-negotiable",
    items: [
      "Fill out today's Practice Log entry. Every field.",
      "Rate your confidence: 🔴 / 🟡 / 🟢",
      'Write one-liner: "Problem X — used [pattern] because [reason]."',
      "Update Spaced Repetition Queue if 🔴 or 🟡 today.",
      "Check tomorrow's problem. Let your brain marinate overnight.",
    ],
    color: "from-purple-500/20 to-pink-500/20",
    textColor: "text-purple-400",
  },
];

const traps = [
  {
    trap: '"I\'ll do 3 problems today to make up for yesterday"',
    bad: "Bingeing leads to shallow learning and burnout",
    fix: "Stick to 1/day. Consistency > volume.",
  },
  {
    trap: "Solving without a timer",
    bad: "No timer = no pressure practice",
    fix: "Always. Set. The. Timer.",
  },
  {
    trap: "Coding in silence",
    bad: "You skip the most important interview skill",
    fix: "Talk out loud, even if you feel weird",
  },
  {
    trap: "Skipping the log",
    bad: "You'll forget what you learned within a week",
    fix: "5 minutes. Just do it.",
  },
  {
    trap: "Watching solutions without re-solving",
    bad: "You'll think you understand when you don't",
    fix: "Close the tab → rewrite from memory",
  },
  {
    trap: "Doing problems out of order",
    bad: "The 31-day plan is sequenced for pattern building",
    fix: "Trust the plan. Follow the order.",
  },
];

export default function DailyRoutinePage() {
  const [checkIn, setCheckIn] = useState({
    block1Done: false,
    block2Done: false,
    block3Done: false,
    block4Done: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getTodayCheckIn().then((data) => {
      if (data) {
        setCheckIn({
          block1Done: data.block1Done,
          block2Done: data.block2Done,
          block3Done: data.block3Done,
          block4Done: data.block4Done,
        });
      }
      setLoaded(true);
    });
  }, []);

  const toggleBlock = async (key: keyof typeof checkIn) => {
    const updated = { ...checkIn, [key]: !checkIn[key] };
    setCheckIn(updated);
    try {
      await checkInDaily(updated);
    } catch {
      toast.error("Failed to save check-in state.");
      // optionally revert state here but error handles it
    }
  };

  const completedBlocks = Object.values(checkIn).filter(Boolean).length;

  return (
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Daily Routine</h1>
            <p className="mt-1 text-sm text-white/50">
              Consistency beats motivation. Show up every day, follow the
              blocks, trust the process.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2">
            <span className="text-2xl font-bold text-violet-400">
              {completedBlocks}
            </span>
            <span className="text-xs text-white/40">/4 blocks</span>
          </div>
        </div>

        {/* Total time */}
        <div className="glass-card flex items-center justify-center gap-4 !py-4">
          <span className="text-sm text-white/50">
            Total daily commitment:
          </span>
          <span className="gradient-text text-lg font-bold">
            ~75–95 minutes
          </span>
        </div>

        {/* Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.key} className="glass-card overflow-hidden !p-0">
              {/* Block header */}
              <button
                onClick={() => toggleBlock(block.key)}
                disabled={!loaded}
                className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${block.color} ${block.textColor}`}
                >
                  <block.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {block.title}
                  </h3>
                  <p className="text-xs text-white/40">
                    {block.duration} • {block.time}
                  </p>
                </div>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${checkIn[block.key]
                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                    : "border-white/10 bg-white/[0.03] text-white/20"
                    }`}
                >
                  {checkIn[block.key] ? "✓" : ""}
                </div>
              </button>

              {/* Checklist */}
              <div className="border-t border-white/[0.06] bg-white/[0.01] px-5 py-4">
                <div className="space-y-2">
                  {block.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <span className={`mt-0.5 text-xs ${block.textColor}`}>
                        •
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Cheat Sheet */}
        <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-violet-400">
            ⚡ Minimum Viable Day (30 min total)
          </h3>
          <div className="space-y-1.5 font-mono text-sm text-white/60">
            <p>
              1. Read today&apos;s problem{" "}
              <span className="text-white/30">[2 min]</span>
            </p>
            <p>
              2. Identify the pattern out loud{" "}
              <span className="text-white/30">[3 min]</span>
            </p>
            <p>
              3. Set timer → solve it{" "}
              <span className="text-white/30">[20 min]</span>
            </p>
            <p>
              4. Log it in Daily Practice Log{" "}
              <span className="text-white/30">[5 min]</span>
            </p>
          </div>
          <p className="mt-3 text-xs text-violet-400/60">
            That&apos;s it. You showed up. That counts.
          </p>
        </div>

        {/* Common Traps */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              Common Traps to Avoid
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Trap
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Why Bad
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Fix
                  </th>
                </tr>
              </thead>
              <tbody>
                {traps.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm font-medium text-white/70">
                      {t.trap}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-red-400/70">
                      {t.bad}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-emerald-400/70">
                      {t.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
