"use client";
import { ArrowLeft } from "lucide-react";

type RegisterOtpBackButtonProps = {
  onBack: () => void;
};

export default function RegisterOtpBackButton({
  onBack,
}: RegisterOtpBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700
        dark:text-gray-400 dark:hover:text-gray-200"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
