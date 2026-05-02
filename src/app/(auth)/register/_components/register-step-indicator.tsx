import {
  REGISTER_STEPS,
} from "@/lib/constants/auth.constant";
import { RegisterStep } from "@/lib/types/auth";

interface RegisterStepIndicatorProps {
  step: RegisterStep;
}

export default function RegisterStepIndicator({
  step,
}: RegisterStepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      <span
        className={`flex size-8 items-center justify-center rounded-full text-xs font-bold
          ${
            step === REGISTER_STEPS.FORM
              ? "bg-teal-600 text-white dark:bg-teal-700"
              : "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400"
          }`}
      >
        1
      </span>
      <span
        className={`h-0.5 w-12 transition-colors
          ${step === REGISTER_STEPS.OTP ? "bg-teal-600 dark:bg-teal-700" : "bg-gray-200 dark:bg-gray-700"}`}
      />
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
          ${
            step === REGISTER_STEPS.OTP
              ? "bg-teal-600 text-white dark:bg-teal-700"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
          }`}
      >
        2
      </span>
    </div>
  );
}
