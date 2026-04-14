"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD FORM
// Three steps rendered in a single component — no navigation between them.
//   Step 1 — email:        user enters their email address
//   Step 2 — otp:          user enters the 5-digit code sent to that email
//   Step 3 — new_password: user sets a new password (authorised by httpOnly cookie)
//
// Resend cooldown: stored in localStorage so it survives page reloads.
// If the user re-submits the same email while the timer is still active,
// we skip the API call and jump straight to the OTP step.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";

import {
  useSendForgotPasswordOtp,
  useVerifyForgotPasswordOtp,
  useResetPassword,
} from "../_hooks/use-forgot-password";
import {
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordEmailInput,
  type ForgotPasswordOtpInput,
  type ForgotPasswordNewPasswordInput,
} from "@/lib/schemas/auth/forgot-password.schema";
import {
  AUTH_ROUTES,
  FORGOT_PASSWORD_STEPS,
  OTP_CONFIG,
  OTP_COOL_DOWN_KEY,
  OTP_EMAIL_KEY,
  OTP_TYPES,
  COOL_DOWN_TIME,
  type ForgotPasswordStep,
} from "@/lib/constants/auth";
import { sendOtpAction } from "@/lib/auth/send-otp.action";
import { useLocalStorage } from "@/hooks/shared/use-local-storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ── Step order ────────────────────────────────────────────────────────────────
const STEP_ORDER: ForgotPasswordStep[] = [
  FORGOT_PASSWORD_STEPS.EMAIL,
  FORGOT_PASSWORD_STEPS.OTP,
  FORGOT_PASSWORD_STEPS.NEW_PASSWORD,
];

function stepIndex(step: ForgotPasswordStep) {
  return STEP_ORDER.indexOf(step);
}

// ── Alert helpers ─────────────────────────────────────────────────────────────
function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
      <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPasswordForm() {
  const router = useRouter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<ForgotPasswordStep>(FORGOT_PASSWORD_STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // ── Cooldown — persisted in localStorage so it survives page reloads ──────
  const {
    storedValue: otpCooldown,
    setValue: setCooldown,
    removeValue: removeCooldown,
  } = useLocalStorage<string | null>(OTP_COOL_DOWN_KEY, null);

  const {
    storedValue: storedEmail,
    setValue: setStoredEmail,
    removeValue: removeStoredEmail,
  } = useLocalStorage<string | null>(OTP_EMAIL_KEY, null);

  const [countDown, setCountDown] = useState(() => {
    if (!otpCooldown) return 0;
    return Math.max(
      Math.floor((new Date(otpCooldown).getTime() - Date.now()) / 1000),
      0,
    );
  });

  useEffect(() => {
    if (!otpCooldown) return;
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          removeCooldown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldown]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mutations ─────────────────────────────────────────────────────────────
  const sendOtp = useSendForgotPasswordOtp();
  const verifyOtp = useVerifyForgotPasswordOtp();
  const resetPassword = useResetPassword();

  // ── Forms (one per step) ──────────────────────────────────────────────────
  const emailForm = useForm<ForgotPasswordEmailInput>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  const otpForm = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(forgotPasswordOtpSchema),
  });

  const passwordForm = useForm<ForgotPasswordNewPasswordInput>({
    resolver: zodResolver(forgotPasswordNewPasswordSchema),
  });

  // ── Step 1 submit: send OTP ───────────────────────────────────────────────
  const onEmailSubmit: SubmitHandler<ForgotPasswordEmailInput> = (values) => {
    const timerActive = !!otpCooldown && new Date(otpCooldown) > new Date();
    const isSameEmail = values.email === storedEmail;

    if (isSameEmail && timerActive) {
      setEmail(values.email);
      setStep(FORGOT_PASSWORD_STEPS.OTP);
      return;
    }

    if (!isSameEmail && timerActive) {
      removeCooldown();
      removeStoredEmail();
    }

    sendOtp.mutate(values, {
      onSuccess: (data) => {
        if (!data.status) return;
        const expireTime = new Date(Date.now() + COOL_DOWN_TIME);
        setCooldown(expireTime.toISOString());
        setStoredEmail(values.email);
        setCountDown(COOL_DOWN_TIME / 1000);
        setEmail(values.email);
        if (data.data?.otp) setDevOtp(data.data.otp);
        setStep(FORGOT_PASSWORD_STEPS.OTP);
        sendOtp.reset();
      },
    });
  };

  // ── Step 2 submit: verify OTP ─────────────────────────────────────────────
  const onOtpSubmit: SubmitHandler<ForgotPasswordOtpInput> = (values) => {
    verifyOtp.mutate(
      { email, input: values },
      {
        onSuccess: (data) => {
          if (!data.status) return;
          setStep(FORGOT_PASSWORD_STEPS.NEW_PASSWORD);
          verifyOtp.reset();
          setDevOtp(null);
        },
      },
    );
  };

  // ── Step 2: resend OTP ────────────────────────────────────────────────────
  async function handleResendOtp() {
    setIsResending(true);
    try {
      const res = await sendOtpAction({ email, type: OTP_TYPES.FORGOT_PASSWORD });
      if (res.status) {
        const expireTime = new Date(Date.now() + COOL_DOWN_TIME);
        setCooldown(expireTime.toISOString());
        setCountDown(COOL_DOWN_TIME / 1000);
        if (res.data?.otp) setDevOtp(res.data.otp);
      }
    } finally {
      setIsResending(false);
    }
  }

  // ── Step 3 submit: reset password ─────────────────────────────────────────
  const onPasswordSubmit: SubmitHandler<ForgotPasswordNewPasswordInput> = (values) => {
    resetPassword.mutate(values, {
      onSuccess: (data) => {
        if (!data.status) return;
        removeCooldown();
        removeStoredEmail();
        setResetSuccess(true);
        setTimeout(() => router.push(AUTH_ROUTES.LOGIN), 2000);
      },
    });
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const currentIndex = stepIndex(step);

  const stepMeta: Record<ForgotPasswordStep, { title: string; subtitle: string }> = {
    [FORGOT_PASSWORD_STEPS.EMAIL]: {
      title: "Forgot your password?",
      subtitle: "Enter your email and we'll send you a verification code",
    },
    [FORGOT_PASSWORD_STEPS.OTP]: {
      title: "Check your email",
      subtitle: `We sent a ${OTP_CONFIG.LENGTH}-digit code to ${email}`,
    },
    [FORGOT_PASSWORD_STEPS.NEW_PASSWORD]: {
      title: "Set new password",
      subtitle: "Choose a strong password for your account",
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
        {/* ── Logo + headings ── */}
        <div className="mb-8 text-center">
          <div
            className="mb-4 inline-flex h-16 w-16 items-center justify-center
              rounded-2xl bg-teal-600 shadow-lg dark:bg-teal-700"
          >
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stepMeta[step].title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {stepMeta[step].subtitle}
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl
            dark:border-gray-800 dark:bg-gray-900"
        >
          {/* ── Step indicator ── */}
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

          {/* ════════════════════════════════════════════════════════════════
              STEP 1 — EMAIL
          ════════════════════════════════════════════════════════════════ */}
          {step === FORGOT_PASSWORD_STEPS.EMAIL && (
            <>
              {sendOtp.data && !sendOtp.data.status && (
                <ErrorAlert message={sendOtp.data.message} />
              )}

              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-5"
              >
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register("email")}
                />

                <Button type="submit" isLoading={sendOtp.isPending}>
                  Send verification code
                </Button>
              </form>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 2 — OTP
          ════════════════════════════════════════════════════════════════ */}
          {step === FORGOT_PASSWORD_STEPS.OTP && (
            <div className="space-y-5">
              {/* Dev-mode OTP badge */}
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

              {verifyOtp.data && !verifyOtp.data.status && (
                <ErrorAlert message={verifyOtp.data.message} />
              )}

              <div className="text-center">
                <div
                  className="mb-3 inline-flex h-14 w-14 items-center justify-center
                    rounded-2xl bg-teal-50 dark:bg-teal-900/40"
                >
                  <KeyRound className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
              </div>

              <form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="space-y-4"
              >
                {/* OTP input — special large centered style */}
                <div>
                  <input
                    {...otpForm.register("otp")}
                    type="text"
                    inputMode="numeric"
                    maxLength={OTP_CONFIG.LENGTH}
                    placeholder={"_ ".repeat(OTP_CONFIG.LENGTH).trim()}
                    className={`w-full rounded-xl border-2 bg-gray-50 py-3 text-center text-2xl
                      font-bold tracking-[0.5em] outline-none transition-all
                      focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                      dark:bg-gray-800 dark:text-white dark:placeholder-gray-600
                      ${
                        otpForm.formState.errors.otp
                          ? "border-red-400 dark:border-red-700"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="mt-1 text-center text-xs text-red-500">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button type="submit" isLoading={verifyOtp.isPending}>
                  Verify code
                </Button>
              </form>

              {/* Resend — shows countdown while cooldown is active */}
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
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700
                      disabled:opacity-50 dark:text-teal-400"
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </button>
                )}
              </div>

              {/* Change email */}
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => setStep(FORGOT_PASSWORD_STEPS.EMAIL)}
                  className="font-semibold text-teal-600 hover:text-teal-700
                    dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Change it
                </button>
              </p>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 3 — NEW PASSWORD
          ════════════════════════════════════════════════════════════════ */}
          {step === FORGOT_PASSWORD_STEPS.NEW_PASSWORD && (
            <div className="space-y-5">
              {resetSuccess ? (
                <SuccessAlert message="Password updated! Redirecting to login…" />
              ) : (
                <>
                  {resetPassword.data && !resetPassword.data.status && (
                    <ErrorAlert message={resetPassword.data.message} />
                  )}

                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <Input
                      label="New password"
                      type="password"
                      mood="create"
                      placeholder="Min. 8 characters"
                      error={passwordForm.formState.errors.password?.message}
                      {...passwordForm.register("password")}
                    />

                    <Input
                      label="Confirm password"
                      type="password"
                      placeholder="••••••••"
                      error={passwordForm.formState.errors.confirm_password?.message}
                      {...passwordForm.register("confirm_password")}
                    />

                    <Button type="submit" isLoading={resetPassword.isPending}>
                      Update password
                    </Button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* ── Back to login ── */}
          <div className="mt-6 text-center">
            <Link
              href={AUTH_ROUTES.LOGIN}
              className="inline-flex items-center gap-1 text-sm text-gray-500
                hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </div>
        </div>
    </div>
  );
}
