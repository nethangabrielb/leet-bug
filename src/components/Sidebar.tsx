"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  Map,
  ClipboardList,
  RotateCcw,
  Puzzle,
  GitFork,
  Code2,
  Brain,
  BookOpen,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "31-Day Roadmap", icon: Map },
  { href: "/practice-log", label: "Practice Log", icon: ClipboardList },
  { href: "/spaced-repetition", label: "Spaced Repetition", icon: RotateCcw },
  { href: "/patterns", label: "Core Patterns", icon: Puzzle },
  { href: "/flowchart", label: "Pattern Flowchart", icon: GitFork },
  { href: "/cheatsheet", label: "JS Cheatsheet", icon: Code2 },
  { href: "/mental-game", label: "Mental Game", icon: Brain },
  { href: "/practice-guide", label: "Practice Guide", icon: BookOpen },
  { href: "/daily-routine", label: "Daily Routine", icon: CalendarClock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={`custom-scrollbar fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/[0.08] bg-[oklch(0.12_0.005_285)] transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-white">
                LeetBug
              </h1>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/15 text-violet-300 shadow-sm shadow-violet-500/10"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    isActive
                      ? "text-violet-400"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-white/[0.08] p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Spacer matching sidebar width */}
      <div
        className={`shrink-0 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      />
    </>
  );
}
