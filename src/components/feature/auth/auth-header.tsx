import { cn } from "@/lib/utils/tailwind-merge";
import { ShieldCheck } from "lucide-react";

type AuthHeaderProps = {
  title: string;
  description: string;
  className?: string;
};

export default function AuthHeader({
  title,
  description,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 shadow-lg dark:bg-teal-700">
        <ShieldCheck className="h-8 w-8 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
