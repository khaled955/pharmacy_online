import { ShieldCheck } from "lucide-react";

export default function AuthMobileLogo() {
  return (
    <div className="mb-8 flex items-center gap-2 lg:hidden">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg
          bg-teal-600 dark:bg-teal-700"
      >
        <ShieldCheck className="h-4 w-4 text-white" />
      </div>

      <span className="text-base font-bold text-gray-900 dark:text-white">
        MedBox
      </span>
    </div>
  );
}
