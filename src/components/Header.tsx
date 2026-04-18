"use client";

import { useRouter } from "next/navigation";

import { LogOut, User, Flame } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[oklch(0.13_0.005_285)]/80 px-6 backdrop-blur-xl">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 px-3 py-1.5 text-xs font-semibold text-orange-400">
          <Flame className="h-3.5 w-3.5" />
          <span>Streak</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
            <User className="h-4 w-4 text-white" />
          </div>
          {session?.user && (
            <span className="hidden text-sm font-medium text-white/70 sm:inline">
              {session.user.name || session.user.email}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
          id="logout-button"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
