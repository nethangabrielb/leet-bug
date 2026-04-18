interface ConfidenceBadgeProps {
  level: "RED" | "YELLOW" | "GREEN";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const config = {
  RED: { emoji: "🔴", label: "Struggled", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20" },
  YELLOW: { emoji: "🟡", label: "Solved with difficulty", bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/20" },
  GREEN: { emoji: "🟢", label: "Clean solve", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
};

export default function ConfidenceBadge({ level, size = "md", showLabel = false }: ConfidenceBadgeProps) {
  const c = config[level];
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]}`}>
      <span>{c.emoji}</span>
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}
