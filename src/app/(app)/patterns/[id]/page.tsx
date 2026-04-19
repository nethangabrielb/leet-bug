import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import CodeBlock from "@/components/CodeBlock";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { ExternalLink, Star, ArrowLeft } from "lucide-react";

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const pattern = await prisma.pattern.findUnique({
    where: { id },
    include: {
      problems: {
        include: { practiceLogs: { where: { userId: session.user.id }, orderBy: { date: "desc" }, take: 1 } },
        orderBy: { leetcodeNumber: "asc" },
      },
    },
  });

  if (!pattern) notFound();

  return (
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <Link href="/patterns" className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70">
          <ArrowLeft className="h-3.5 w-3.5" />Back to Patterns
        </Link>

        <div className="glass-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 text-2xl font-bold text-emerald-400">{pattern.number}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{pattern.name}</h1>
              <p className="text-sm text-white/50">{pattern.description}</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">When to Recognize This Pattern</h2>
          <p className="text-sm leading-relaxed text-white/70">{pattern.recognitionCues}</p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Template</h2>
          <CodeBlock code={pattern.template} language="javascript" title={`${pattern.name} Template`} />
        </div>

        {pattern.flowchartHint && (
          <div className="glass-card">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Pattern Decision Flowchart</h2>
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <p className="font-mono text-sm text-emerald-300">{pattern.flowchartHint}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Problems ({pattern.problems.length})</h2>
          <div className="space-y-2">
            {pattern.problems.map((problem) => {
              const latestLog = problem.practiceLogs[0];
              return (
                <div key={problem.id} className="glass-card-hover flex items-center gap-4 !p-4">
                  <span className="font-mono text-xs text-white/30">#{problem.leetcodeNumber}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white/90">{problem.title}</p>
                      {problem.isStarred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    </div>
                    {problem.dayInPlan && <p className="text-xs text-white/30">Day {problem.dayInPlan} • Week {problem.weekInPlan}</p>}
                  </div>
                  {latestLog && <ConfidenceBadge level={latestLog.confidence} size="sm" />}
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${problem.difficulty === "EASY" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}>{problem.difficulty}</span>
                  <Link href={problem.url} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/20">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}
