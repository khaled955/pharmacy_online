"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";

import {
  type ForgotPasswordOtpInput,
  useForgotPasswordOtpSchema,
} from "@/lib/schemas/auth/forgot-password.schema";
import { Button } from "@/components/ui/button";
import { OTP_CONFIG } from "@/lib/constants/auth.constant";

interface Props {
  devOtp: string | null;
  countDown: number;
  isResending: boolean;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: SubmitHandler<ForgotPasswordOtpInput>;
  onResend: () => void;
  onChangeEmail: () => void;
}

export default function ForgotPasswordOtpStep({
  devOtp,
  countDown,
  isResending,
  isPending,
  errorMessage,
  onSubmit,
  onResend,
  onChangeEmail,
}: Props) {
  const form = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(useForgotPasswordOtpSchema()),
  });

  return (
    <div className="space-y-5">
      {devOtp && (
        <div
          className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-center
            dark:border-yellow-700 dark:bg-yellow-950"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-yellow-600 dark:text-yellow-400">
            Dev Mode — Your OTP
          </p>
          <p className="mt-1 text-3xl font-bold tracking-[0.5em] text-yellow-800 dark:text-yellow-300">
            {devOtp}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="text-center">
        <div
          className="mb-3 inline-flex h-14 w-14 items-center justify-center
            rounded-2xl bg-teal-50 dark:bg-teal-900/40"
        >
          <KeyRound className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...form.register("otp")}
            type="text"
            inputMode="numeric"
            maxLength={OTP_CONFIG.LENGTH}
            placeholder={"_ ".repeat(OTP_CONFIG.LENGTH).trim()}
            className={`w-full rounded-xl border-2 bg-gray-50 py-3 text-center text-2xl
              font-bold tracking-[0.5em] outline-none transition-all
              focus:border-teal-500 focus:ring-2 focus:ring-teal-500
              dark:bg-gray-800 dark:text-white dark:placeholder-gray-600
              ${
                form.formState.errors.otp
                  ? "border-red-400 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
          />
          {form.formState.errors.otp && (
            <p className="mt-1 text-center text-xs text-red-500">
              {form.formState.errors.otp.message}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={isPending}>
          Verify code
        </Button>
      </form>

      <div className="space-y-1 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the code?
        </p>
        {countDown > 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Resend in{" "}
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              {countDown}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700
              disabled:opacity-50 dark:text-teal-400"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        Wrong email?{" "}
        <button
          type="button"
          onClick={onChangeEmail}
          className="font-semibold text-teal-600 hover:text-teal-700
            dark:text-teal-400 dark:hover:text-teal-300"
        >
          Change it
        </button>
      </p>
    </div>
  );
}
