"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { OTP_CONFIG } from "@/lib/constants/auth";
import { type ForgotPasswordOtpInput } from "@/lib/schemas/auth/forgot-password.schema";

type RegisterOtpFormProps = {
  otpRegister: UseFormRegister<ForgotPasswordOtpInput>;
  otpErrors: FieldErrors<ForgotPasswordOtpInput>;
  verifyError: string | null;
  isVerifying: boolean;
  onOtpSubmit: () => void;
};

export default function RegisterOtpForm({
  otpRegister,
  otpErrors,
  verifyError,
  isVerifying,
  onOtpSubmit,
}: RegisterOtpFormProps) {
  return (
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

      <Button
        type="submit"
        isLoading={isVerifying}
        serverError={verifyError ?? undefined}
      >
        Verify email
      </Button>
    </form>
  );
}
