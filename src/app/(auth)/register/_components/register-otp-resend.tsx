"use client";
type RegisterOtpResendProps = {
  isResending: boolean;
  onResend: () => void;
};

export default function RegisterOtpResend({
  isResending,
  onResend,
}: RegisterOtpResendProps) {
  return (
    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
      Didn&apos;t receive it?{" "}
      <button
        type="button"
        onClick={onResend}
        disabled={isResending}
        className="font-semibold text-teal-600 hover:text-teal-700
          disabled:opacity-50 dark:text-teal-400"
      >
        {isResending ? "Sending..." : "Resend"}
      </button>
    </p>
  );
}
