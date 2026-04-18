"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
  className?: string;
}

export default function Timer({
  initialMinutes = 20,
  onComplete,
  className = "",
}: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const initialTotal = initialMinutes * 60;
  const progress = ((initialTotal - totalSeconds) / initialTotal) * 100;

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) return;

    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds, onComplete]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(initialMinutes * 60);
  }, [initialMinutes]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const isLow = totalSeconds < 60;
  const isWarning = totalSeconds < 300 && totalSeconds >= 60;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(1 0 0 / 5%)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke={isLow ? "oklch(0.637 0.237 25.331)" : isWarning ? "oklch(0.795 0.184 86.047)" : "oklch(0.541 0.281 293.009)"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${progress * 2.765} 276.5`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-2xl font-bold ${isLow ? "text-red-400" : isWarning ? "text-yellow-400" : "text-white"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            {isRunning ? "running" : totalSeconds === 0 ? "done" : "paused"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setIsRunning(!isRunning)} disabled={totalSeconds === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 transition-all hover:bg-violet-500/30 disabled:opacity-40">
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <button onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/40 transition-all hover:bg-white/[0.1] hover:text-white/70">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
