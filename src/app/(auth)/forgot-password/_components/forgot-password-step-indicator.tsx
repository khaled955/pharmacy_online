import {
  FORGOT_PASSWORD_STEPS,
} from "@/lib/constants/auth.constant";
import { ForgotPasswordStep } from "@/lib/types/auth";

const STEP_ORDER: ForgotPasswordStep[] = [
  FORGOT_PASSWORD_STEPS.EMAIL,
  FORGOT_PASSWORD_STEPS.OTP,
  FORGOT_PASSWORD_STEPS.NEW_PASSWORD,
];

interface Props {
  currentStep: ForgotPasswordStep;
}

export default function ForgotPasswordStepIndicator({ currentStep }: Props) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEP_ORDER.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
              transition-colors
              ${
                i < currentIndex
                  ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400"
                  : i === currentIndex
                    ? "bg-teal-600 text-white dark:bg-teal-700"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
              }`}
          >
            {i + 1}
          </span>
          {i < STEP_ORDER.length - 1 && (
            <span
              className={`h-0.5 w-10 transition-colors
                ${i < currentIndex ? "bg-teal-600 dark:bg-teal-700" : "bg-gray-200 dark:bg-gray-700"}`}
            />
          )}
        </span>
      ))}
    </div>
  );
}
