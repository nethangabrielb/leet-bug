import CodeBlock from "@/components/CodeBlock";

const progressionData = [
  {
    week: "Week 1",
    description:
      'Mostly 🔴s. You look at solutions for most problems. You feel dumb. This is normal.',
  },
  {
    week: "Week 2",
    description:
      "Mix of 🔴 and 🟡. You start recognizing patterns before coding. Implementation still rough.",
  },
  {
    week: "Week 3",
    description:
      "Mostly 🟡 and 🟢 on Easys. Mediums sometimes click, sometimes don't.",
  },
  {
    week: "Week 4",
    description:
      "Mostly 🟢. The patterns feel automatic. You're debugging logic, not guessing approaches.",
  },
];

export default function PracticeGuidePage() {
  return (
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Practice Guide</h1>
          <p className="mt-1 text-sm text-white/50">
            How to practice, the 🔴🟡🟢 system, spaced repetition, and edge
            cases.
          </p>
        </div>

        {/* How to Practice */}
        <div className="glass-card">
          <h2 className="mb-4 text-lg font-semibold text-white">
            How to Practice a Problem
          </h2>
          <div className="space-y-3">
            {[
              "Read the problem twice. Don't touch the keyboard yet.",
              "Identify the pattern. Use the flowchart. Ask: have I seen this shape before?",
              "Talk through your approach out loud before coding.",
              "Write the solution. Don't optimize first — get it working.",
              "Test with edge cases: empty input, single element, negative numbers, zero.",
              "After submitting — look at top solutions for a cleaner approach.",
              'Write one line in your Practice Log: "Problem X — used [pattern] because [reason]."',
              "Rate yourself 🔴🟡🟢 and follow the protocol below.",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-[#1a1a1a] p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <p className="text-sm text-white/70">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Sections */}
        <div className="space-y-4">
          {/* Red */}
          <div className="glass-card !border-red-500/10">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">🔴</span>
              <h2 className="text-lg font-semibold text-red-400">
                Couldn&apos;t Solve It
              </h2>
            </div>
            <p className="mb-3 text-xs text-white/40">
              This is not failure. In Week 1–2, expect 50–70% 🔴s. That&apos;s
              normal.
            </p>
            <ol className="space-y-2 text-sm text-white/70">
              <li>1. Look at the solution — read it line by line.</li>
              <li>2. Close the solution tab.</li>
              <li>3. Rewrite it from memory immediately. From scratch.</li>
              <li>4. Log it as 🔴 in your Spaced Repetition Queue.</li>
              <li>5. Re-solve from zero in 3 days.</li>
            </ol>
          </div>

          {/* Yellow */}
          <div className="glass-card !border-yellow-500/10">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">🟡</span>
              <h2 className="text-lg font-semibold text-yellow-400">
                Solved but Struggled
              </h2>
            </div>
            <ol className="space-y-2 text-sm text-white/70">
              <li>1. Check the top 2–3 solutions on the discuss tab.</li>
              <li>
                2. Identify what made theirs cleaner — different data structure?
                Simpler loop?
              </li>
              <li>
                3. Write down the key difference: &quot;Could have used a Set
                instead of nested loop.&quot;
              </li>
              <li>4. Log it as 🟡. These are secondary spaced repetition targets.</li>
              <li>5. Optional: Re-solve with the cleaner approach now.</li>
            </ol>
          </div>

          {/* Green */}
          <div className="glass-card !border-emerald-500/10">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">🟢</span>
              <h2 className="text-lg font-semibold text-emerald-400">
                Clean Solve
              </h2>
            </div>
            <ol className="space-y-2 text-sm text-white/70">
              <li>1. Still check top solutions — there might be a new approach.</li>
              <li>2. Log it as 🟢. Note the pattern. Move on. You&apos;re dangerous.</li>
              <li>
                3. No need to re-solve unless it&apos;s a ⭐ problem.
              </li>
            </ol>
          </div>
        </div>

        {/* Progression Timeline */}
        <div className="glass-card">
          <h2 className="mb-4 text-lg font-semibold text-white">
            The Real Progression
          </h2>
          <div className="space-y-3">
            {progressionData.map((item) => (
              <div
                key={item.week}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-[#1a1a1a] p-3"
              >
                <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400">
                  {item.week}
                </span>
                <p className="text-sm text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-white/60">
            The 🔴s are not shame — they&apos;re your map of what to review.
            Track them. They become 🟡s. The 🟡s become 🟢s.
          </p>
        </div>

        {/* Edge Cases */}
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">
            Edge Cases to Always Consider
          </h2>
          <CodeBlock
            code={`- Empty array []
- Single element [x]
- All same elements [1,1,1]
- Negative numbers [-1, -2]
- Zero (0)
- Very large numbers
- Decimal/float values
- Empty string ""
- Case sensitivity (uppercase vs lowercase)
- null / undefined inputs (especially linked list head)
- Single node linked list
- Array of length 1 with target not found (binary search)`}
            language="text"
            title="Always Check These"
          />
        </div>
      </div>
  );
}
