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
        // base
        "flex items-start gap-2 rounded-xl border p-3 text-sm",

        // light mode
        "border-red-200 bg-red-50 text-red-600",

        "dark:border-red-800 dark:bg-red-950 dark:text-red-400",

        "animate-in fade-in slide-in-from-top-1 duration-200",

        className,
      )}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
