import {
  Brain,
  Wind,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const dontNeedData = [
  { topic: "Dynamic Programming", reason: "Not expected at junior level in most PH companies" },
  { topic: "Graph algorithms (BFS/DFS on graphs)", reason: "Extremely rare in junior OAs" },
  { topic: "Heap / Priority Queue", reason: "Overkill for target roles" },
  { topic: "Tries / Segment Trees", reason: "Senior-level territory" },
  { topic: "Hard problems", reason: "No PH company expects these from juniors" },
  { topic: "More hashing problems", reason: "You already have enough" },
  { topic: "500+ problem grind", reason: "Quality > quantity, always" },
];

export default function MentalGamePage() {
  return (
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">The Mental Game</h1>
          <p className="mt-1 text-sm text-white/50">
            The Wellevate exam wasn&apos;t a skill failure — it was a pressure
            failure. Here&apos;s how to fix that.
          </p>
        </div>

        {/* Pre-Exam Ritual */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Wind className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Pre-Exam Ritual
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                time: "5 min before",
                text: "Close everything except the exam tab. No music. No phone.",
              },
              {
                time: "2 min before",
                text: "Three slow breaths — in for 4 seconds, hold 4, out for 6.",
              },
              {
                time: "Read first problem",
                text: 'Say out loud: "Let me read this carefully. No rush."',
              },
            ].map((step, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    {step.time}
                  </span>
                  <p className="text-sm text-white/70">{step.text}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* When You're Stuck */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Brain className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              When You&apos;re Stuck
            </h2>
          </div>
          <div className="space-y-2">
            {[
              'Say out loud: "I know the output I need. What operation gets me there?"',
              "Run the Pattern Flowchart. Ask each question one by one.",
              "Think about the simplest version first. Can you solve it for n=1? n=2?",
              "Draw it out. Seriously — even on scratch paper.",
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400">
                  {i + 1}
                </span>
                <p className="text-sm text-white/70">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When Running Out of Time */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Running Out of Time
            </h2>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <p>• Verbalize your approach completely before giving up on code.</p>
            <p>
              • A correct verbal solution with incomplete code is almost always
              better than silence.
            </p>
          </div>
        </div>

        {/* 2-Minute Checkpoint */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              The 2-Minute Checkpoint
            </h2>
          </div>
          <p className="mb-3 text-sm text-white/50">
            At the halfway mark of your timer:
          </p>
          <div className="space-y-2 text-sm text-white/70">
            <p>
              • Do I have <em>any</em> working code? → If no, simplify immediately.
            </p>
            <p>
              • Am I overcomplicating this? → Go back to brute force. A working
              O(n²) beats an unfinished O(n).
            </p>
          </div>
        </div>

        {/* What You DON'T Need */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
              <XCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              What You DON&apos;T Need
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Topic
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Why Skip It
                  </th>
                </tr>
              </thead>
              <tbody>
                {dontNeedData.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm font-medium text-white/70">
                      {item.topic}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-white/50">
                      {item.reason}
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
