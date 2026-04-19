import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      <p className="text-sm font-medium text-white/50">Loading...</p>
    </div>
  );
}
