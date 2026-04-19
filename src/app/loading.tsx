import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

export default function RootLoading() {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center",
        "bg-background",
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl",
            "bg-gradient-brand shadow-lg animate-pulse",
          )}
        >
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading MedBox…</p>
      </div>
    </div>
  );
}
