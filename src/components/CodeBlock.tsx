"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
}

export default function CodeBlock({ code, language = "javascript", title, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[oklch(0.11_0.005_285)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          {title && <span className="ml-2 text-xs font-medium text-white/40">{title}</span>}
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-white/30">{language}</span>
        </div>
        {showCopy && (
          <button onClick={copyToClipboard}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white/60">
            {copied ? (<><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>) : (<><Copy className="h-3 w-3" /><span>Copy</span></>)}
          </button>
        )}
      </div>
      <pre className="custom-scrollbar overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-white/80">{code}</code>
      </pre>
    </div>
  );
}
