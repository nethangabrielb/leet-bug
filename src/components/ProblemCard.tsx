import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";

interface ProblemCardProps {
  leetcodeNumber: number;
  title: string;
  difficulty: "EASY" | "MEDIUM";
  url: string;
  patternName?: string;
  isStarred?: boolean;
  dayInPlan?: number | null;
  confidence?: "RED" | "YELLOW" | "GREEN" | null;
  onClick?: () => void;
  compact?: boolean;
}

export default function ProblemCard({
  leetcodeNumber,
  title,
  difficulty,
  url,
  patternName,
  isStarred,
  dayInPlan,
  confidence,
  onClick,
  compact = false,
}: ProblemCardProps) {
  const diffColor =
    difficulty === "EASY"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  const confidenceEmoji =
    confidence === "GREEN"
      ? "🟢"
      : confidence === "YELLOW"
        ? "🟡"
        : confidence === "RED"
          ? "🔴"
          : null;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="glass-card-hover flex w-full items-center gap-3 !p-3 text-left"
      >
        <span className="font-mono text-xs text-white/30">#{leetcodeNumber}</span>
        <span className="flex-1 truncate text-sm font-medium text-white/90">
          {title}
        </span>
        {isStarred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${diffColor}`}
        >
          {difficulty}
        </span>
        {confidenceEmoji && <span className="text-sm">{confidenceEmoji}</span>}
      </button>
    );
  }

  return (
    <div
      className="glass-card-hover group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-xs text-white/30">
              #{leetcodeNumber}
            </span>
            {dayInPlan && (
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                Day {dayInPlan}
              </span>
            )}
            {isStarred && (
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            )}
          </div>
          <h3 className="text-base font-semibold text-white/90 group-hover:text-white">
            {title}
          </h3>
          {patternName && (
            <p className="mt-1 text-xs text-white/40">{patternName}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${diffColor}`}
          >
            {difficulty}
          </span>
          {confidenceEmoji && (
            <span className="text-lg">{confidenceEmoji}</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-emerald-400 transition-colors hover:text-emerald-300"
        >
          <ExternalLink className="h-3 w-3" />
          Open on LeetCode
        </Link>
      </div>
    </div>
  );
}
