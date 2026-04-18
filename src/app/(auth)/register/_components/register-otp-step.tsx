import { KeyRound, ArrowLeft } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { OTP_CONFIG } from "@/lib/constants/auth";
import {
  type ForgotPasswordOtpInput,
} from "@/lib/schemas/auth/forgot-password.schema";

interface RegisterOtpStepProps {
  registeredEmail: string;
  devOtp: string | null;
  verifyError: string | null;
  isVerifying: boolean;
  isResending: boolean;
  otpRegister: UseFormRegister<ForgotPasswordOtpInput>;
  otpErrors: FieldErrors<ForgotPasswordOtpInput>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOtpSubmit: (e?: any) => void;
  onResend: () => void;
  onBack: () => void;
}

export default function RegisterOtpStep({
  registeredEmail,
  devOtp,
  verifyError,
  isVerifying,
  isResending,
  otpRegister,
  otpErrors,
  onOtpSubmit,
  onResend,
  onBack,
}: RegisterOtpStepProps) {
  return (
    <div className="space-y-5">
      {/* Back button — top */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700
          dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Dev-mode OTP badge */}
      {devOtp && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-center dark:border-yellow-700 dark:bg-yellow-950">
          <p className="text-xs font-medium uppercase tracking-wide text-yellow-600 dark:text-yellow-400">
            Dev Mode — Your OTP
          </p>
          <p className="mt-1 text-3xl font-bold tracking-[0.5em] text-yellow-800 dark:text-yellow-300">
            {devOtp}
          </p>
        </div>
      )}

      {/* Context */}
      <div className="text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/40">
          <KeyRound className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter the code sent to
        </p>
        <p className="font-semibold text-gray-800 dark:text-white">
          {registeredEmail}
        </p>
      </div>

      <form onSubmit={onOtpSubmit} className="space-y-4">
        <div>
          <input
            {...otpRegister("otp")}
            type="text"
            inputMode="numeric"
            maxLength={OTP_CONFIG.LENGTH}
            placeholder={"_ ".repeat(OTP_CONFIG.LENGTH).trim()}
            className={`w-full rounded-xl border-2 bg-gray-50 py-3 text-center text-2xl
              font-bold tracking-[0.5em] outline-none transition-all
              focus:border-teal-500 focus:ring-2 focus:ring-teal-500
              dark:bg-gray-800 dark:text-white dark:placeholder-gray-600
              ${
                otpErrors.otp
                  ? "border-red-400 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {otpErrors.otp && (
            <p className="mt-1 text-center text-xs text-red-500">
              {otpErrors.otp.message}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={isVerifying}>
          Verify email
        </Button>

        {/* Server error — below verify button */}
        {verifyError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
            <p className="text-sm text-red-600 dark:text-red-400">{verifyError}</p>
          </div>
        )}
      </form>

      {/* Resend row */}
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
    </div>
  );
}
