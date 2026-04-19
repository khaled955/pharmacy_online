import { cn } from "@/lib/utils/tailwind-merge";
import { TriangleAlert } from "lucide-react";

type ServerErrorMessageProps = {
  message?: string | null;
  className?: string;
};

export default function ServerErrorMessage({
  message,
  className,
}: ServerErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border p-3.5 text-sm",
        "border-destructive/25 bg-destructive/8 text-destructive",
        "dark:border-destructive/30 dark:bg-destructive/12",
        "animate-in fade-in slide-in-from-top-1 duration-200",
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
