"use client";

import { useState } from "react";
import Link from "next/link";

import {
  GitFork,
  Binary,
  Hash,
  Layers,
  Braces,
  ArrowDownUp,
  TreeDeciduous,
  Link2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

type NodeId =
  | "start"
  | "sorted"
  | "binary_or_two"
  | "counts"
  | "hashmap"
  | "subarray"
  | "sliding"
  | "matching"
  | "stack"
  | "minimum"
  | "greedy"
  | "tree"
  | "recursion"
  | "linked"
  | "linkedlist"
  | "digits"
  | "math";

interface FlowNode {
  id: NodeId;
  question?: string;
  answer?: string;
  pattern?: string;
  patternDesc?: string;
  icon?: React.ReactNode;
  yesTo: NodeId | null;
  noTo: NodeId | null;
  color?: string;
}

const flowchart: Record<NodeId, FlowNode> = {
  start: {
    id: "start",
    question: "Let's identify the pattern. Ready?",
    yesTo: "sorted",
    noTo: null,
  },
  sorted: {
    id: "sorted",
    question: "Is the input SORTED?",
    yesTo: "binary_or_two",
    noTo: "counts",
  },
  binary_or_two: {
    id: "binary_or_two",
    answer: "Binary Search or Two Pointers",
    pattern: "Binary Search / Two Pointers",
    patternDesc:
      "Sorted array → use two pointers moving inward, or binary search halving the search space. O(log n) or O(n) instead of O(n²).",
    icon: <Binary className="h-6 w-6" />,
    color: "from-cyan-500/20 to-blue-500/20",
    yesTo: null,
    noTo: null,
  },
  counts: {
    id: "counts",
    question: "Does it ask about COUNTS / DUPLICATES / LOOKUPS?",
    yesTo: "hashmap",
    noTo: "subarray",
  },
  hashmap: {
    id: "hashmap",
    answer: "HashMap / HashSet",
    pattern: "Arrays & Hashing",
    patternDesc:
      "Use a Map or Set for O(1) lookups. Frequency counters, duplicate detection, \"has this appeared before?\"",
    icon: <Hash className="h-6 w-6" />,
    color: "from-violet-500/20 to-purple-500/20",
    yesTo: null,
    noTo: null,
  },
  subarray: {
    id: "subarray",
    question: "Does it ask about a SUBARRAY or SUBSTRING?",
    yesTo: "sliding",
    noTo: "matching",
  },
  sliding: {
    id: "sliding",
    answer: "Sliding Window",
    pattern: "Sliding Window",
    patternDesc:
      "Maintain a window that expands/shrinks. Fixed size → slide by adding right, removing left. Variable → expand until invalid, then shrink.",
    icon: <Layers className="h-6 w-6" />,
    color: "from-emerald-500/20 to-teal-500/20",
    yesTo: null,
    noTo: null,
  },
  matching: {
    id: "matching",
    question: "Does it involve MATCHING / NESTING / UNDO?",
    yesTo: "stack",
    noTo: "minimum",
  },
  stack: {
    id: "stack",
    answer: "Stack",
    pattern: "Stack & Queue",
    patternDesc:
      "LIFO structure. Push when you see an opener, pop when you see a closer. Also used for \"next greater element\" and expression evaluation.",
    icon: <Braces className="h-6 w-6" />,
    color: "from-amber-500/20 to-orange-500/20",
    yesTo: null,
    noTo: null,
  },
  minimum: {
    id: "minimum",
    question:
      'Does it say "MINIMUM number of X" or involve SCHEDULING?',
    yesTo: "greedy",
    noTo: "tree",
  },
  greedy: {
    id: "greedy",
    answer: "Sort + Greedy",
    pattern: "Sorting + Greedy",
    patternDesc:
      "Sort first, then make locally optimal choices. Often used for interval problems, scheduling, and coin-change variants.",
    icon: <ArrowDownUp className="h-6 w-6" />,
    color: "from-rose-500/20 to-pink-500/20",
    yesTo: null,
    noTo: null,
  },
  tree: {
    id: "tree",
    question: 'Is it a TREE or asks for "ALL combinations"?',
    yesTo: "recursion",
    noTo: "linked",
  },
  recursion: {
    id: "recursion",
    answer: "Recursion / DFS",
    pattern: "Recursion & Basic Trees",
    patternDesc:
      "Break the problem into smaller sub-problems. For trees: base case (null node), then recurse left + right. For combos: backtracking.",
    icon: <TreeDeciduous className="h-6 w-6" />,
    color: "from-lime-500/20 to-green-500/20",
    yesTo: null,
    noTo: null,
  },
  linked: {
    id: "linked",
    question: 'Does it say "head of a linked list"?',
    yesTo: "linkedlist",
    noTo: "digits",
  },
  linkedlist: {
    id: "linkedlist",
    answer: "Linked List Pattern",
    pattern: "Linked Lists",
    patternDesc:
      "Walk the list with a pointer. Common tricks: dummy head node, fast/slow pointers for cycle detection, reverse by rewiring .next pointers.",
    icon: <Link2 className="h-6 w-6" />,
    color: "from-sky-500/20 to-indigo-500/20",
    yesTo: null,
    noTo: null,
  },
  digits: {
    id: "digits",
    question: "Is it about DIGITS / REMAINDERS / CONVERSION?",
    yesTo: "math",
    noTo: null,
  },
  math: {
    id: "math",
    answer: "Math & Modulo",
    pattern: "Math & Modulo",
    patternDesc:
      "Use % for remainders and digit extraction. Math.floor(n/10) removes last digit, n%10 gets last digit. Your best friend for conversion problems.",
    icon: <Calculator className="h-6 w-6" />,
    color: "from-fuchsia-500/20 to-violet-500/20",
    yesTo: null,
    noTo: null,
  },
};

const allSteps: NodeId[] = [
  "sorted",
  "counts",
  "subarray",
  "matching",
  "minimum",
  "tree",
  "linked",
  "digits",
];

export default function FlowchartPage() {
  const [currentNode, setCurrentNode] = useState<NodeId>("start");
  const [history, setHistory] = useState<NodeId[]>([]);

  const node = flowchart[currentNode];
  const isResult = !!node.answer;
  const isStart = currentNode === "start";

  const handleYes = () => {
    if (node.yesTo) {
      setHistory([...history, currentNode]);
      setCurrentNode(node.yesTo);
    }
  };

  const handleNo = () => {
    if (node.noTo) {
      setHistory([...history, currentNode]);
      setCurrentNode(node.noTo);
    }
  };

  const handleReset = () => {
    setCurrentNode("start");
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNode(prev);
    }
  };

  return (
      <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">
            🧭 Pattern Decision Flowchart
          </h1>
          <p className="mt-1 text-sm text-white/50">
            When you see a problem and freeze, run through this. Use it every
            single time until you don&apos;t need it anymore.
          </p>
        </div>

        {/* Interactive Flowchart */}
        <div className="glass-card relative overflow-hidden">
          {/* Progress dots */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {history.map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-violet-500/40"
              />
            ))}
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />
          </div>

          {/* Current Node */}
          <div className="flex flex-col items-center text-center">
            {isResult ? (
              /* ── Answer / Pattern Found ── */
              <div className="animate-slide-up w-full max-w-md">
                <div
                  className={`mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${node.color} text-white`}
                >
                  {node.icon}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Pattern Identified
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {node.answer}
                </h2>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {node.patternDesc}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start Over
                  </button>
                  <Link
                    href="/patterns"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
                  >
                    View Pattern Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Question Node ── */
              <div className="animate-slide-up w-full max-w-lg">
                <div className="mb-6 flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                  <GitFork className="h-6 w-6 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-8">
                  {node.question}
                </h2>
                <div className="flex gap-4 justify-center">
                  {node.yesTo && (
                    <button
                      onClick={handleYes}
                      className="flex-1 max-w-[160px] rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 text-base font-semibold text-emerald-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/10"
                    >
                      Yes ✓
                    </button>
                  )}
                  {node.noTo ? (
                    <button
                      onClick={handleNo}
                      className="flex-1 max-w-[160px] rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 text-base font-semibold text-white/60 transition-all hover:border-white/[0.15] hover:bg-white/[0.06]"
                    >
                      No ✗
                    </button>
                  ) : (
                    /* Last question with no "No" path */
                    node.yesTo && (
                      <button
                        onClick={handleReset}
                        className="flex-1 max-w-[160px] rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 text-base font-medium text-white/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.06]"
                      >
                        None match
                      </button>
                    )
                  )}
                </div>
                {!isStart && (
                  <button
                    onClick={handleBack}
                    className="mt-4 text-xs text-white/30 transition-colors hover:text-white/50"
                  >
                    ← Go back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Full Flowchart Reference (always visible) */}
        <div className="glass-card">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
            Full Flowchart Reference
          </h2>
          <div className="space-y-1 font-mono text-sm">
            {allSteps.map((stepId, i) => {
              const step = flowchart[stepId];
              const result = step.yesTo ? flowchart[step.yesTo] : null;
              const isActive =
                currentNode === stepId ||
                (currentNode === step.yesTo && step.yesTo);

              return (
                <div
                  key={stepId}
                  className={`rounded-lg px-4 py-2.5 transition-all ${
                    isActive
                      ? "border border-violet-500/20 bg-violet-500/5"
                      : "border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-white/20 shrink-0">
                      {i === 0 ? "┌" : i === allSteps.length - 1 ? "└" : "├"}──
                    </span>
                    <div>
                      <span className="text-white/60">{step.question}</span>
                      {result?.answer && (
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-white/20">└── Yes →</span>
                          <span
                            className={`font-semibold ${
                              isActive ? "text-violet-400" : "text-white/80"
                            }`}
                          >
                            {result.answer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-5 text-center">
          <p className="text-sm font-medium text-violet-300">
            💡 Print this out. Tape it next to your monitor. Use it every single
            time until you don&apos;t need it anymore.
          </p>
        </div>
      </div>
  );
}
