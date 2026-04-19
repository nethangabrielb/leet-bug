import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PatternsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const patterns = await prisma.pattern.findMany({
    include: {
      problems: {
        include: {
          practiceLogs: { where: { userId: session.user.id }, orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { number: "asc" },
  });

  const patternCards = patterns.map((p) => {
    const total = p.problems.length;
    const solved = p.problems.filter((pr) => pr.practiceLogs.length > 0).length;
    const green = p.problems.filter((pr) => pr.practiceLogs.length > 0 && pr.practiceLogs[0].confidence === "GREEN").length;
    const mastery = total > 0 ? Math.round((green / total) * 100) : 0;
    return { ...p, total, solved, green, mastery };
  });

  return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Core Patterns</h1>
          <p className="mt-1 text-sm text-white/50">These 10 patterns cover the vast majority of junior-level coding assessments. Master these and you&apos;re dangerous.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patternCards.map((pattern) => (
            <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="glass-card-hover group">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-lg font-bold text-violet-400 transition-colors group-hover:from-violet-500/30 group-hover:to-indigo-500/30">{pattern.number}</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: pattern.mastery >= 80 ? "oklch(0.723 0.219 149.579 / 20%)" : pattern.mastery >= 40 ? "oklch(0.795 0.184 86.047 / 20%)" : pattern.mastery > 0 ? "oklch(0.637 0.237 25.331 / 20%)" : "oklch(1 0 0 / 5%)",
                    color: pattern.mastery >= 80 ? "oklch(0.723 0.219 149.579)" : pattern.mastery >= 40 ? "oklch(0.795 0.184 86.047)" : pattern.mastery > 0 ? "oklch(0.637 0.237 25.331)" : "oklch(1 0 0 / 30%)",
                  }}>{pattern.mastery}%</div>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white group-hover:gradient-text">{pattern.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/40">{pattern.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="text-xs text-white/30">{pattern.solved}/{pattern.total} solved</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${pattern.total > 0 ? (pattern.solved / pattern.total) * 100 : 0}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
  );
}
