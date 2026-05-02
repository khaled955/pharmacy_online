"use client";

import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";

import {
  useSendForgotPasswordOtp,
  useVerifyForgotPasswordOtp,
  useResetPassword,
} from "../_hooks/use-forgot-password";
import {
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
} from "@/lib/constants/auth.constant";
import { sendOtpAction } from "@/lib/auth/send-otp.action";
import { useLocalStorage } from "@/hooks/shared/use-local-storage";
import ForgotPasswordStepIndicator from "./forgot-password-step-indicator";
import ForgotPasswordEmailStep from "./forgot-password-email-step";
import ForgotPasswordOtpStep from "./forgot-password-otp-step";
import ForgotPasswordNewPasswordStep from "./forgot-password-new-password-step";
import { ForgotPasswordStep } from "@/lib/types/auth";

// ── Step meta — subtitle for OTP step includes the email so it's computed at render time
function getStepMeta(step: ForgotPasswordStep, email: string) {
  const meta: Record<ForgotPasswordStep, { title: string; subtitle: string }> =
    {
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
  return meta[step];
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPasswordForm() {
  const router = useRouter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<ForgotPasswordStep>(
    FORGOT_PASSWORD_STEPS.EMAIL,
  );
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
      const res = await sendOtpAction({
        email,
        type: OTP_TYPES.FORGOT_PASSWORD,
      });
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
  const onPasswordSubmit: SubmitHandler<ForgotPasswordNewPasswordInput> = (
    values,
  ) => {
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

  const { title, subtitle } = getStepMeta(step, email);

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
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl
          dark:border-gray-800 dark:bg-gray-900"
      >
        <ForgotPasswordStepIndicator currentStep={step} />

        {step === FORGOT_PASSWORD_STEPS.EMAIL && (
          <ForgotPasswordEmailStep
            onSubmit={onEmailSubmit}
            isPending={sendOtp.isPending}
            errorMessage={
              sendOtp.data && !sendOtp.data.status
                ? sendOtp.data.message
                : undefined
            }
          />
        )}

        {step === FORGOT_PASSWORD_STEPS.OTP && (
          <ForgotPasswordOtpStep
            devOtp={devOtp}
            countDown={countDown}
            isResending={isResending}
            isPending={verifyOtp.isPending}
            errorMessage={
              verifyOtp.data && !verifyOtp.data.status
                ? verifyOtp.data.message
                : undefined
            }
            onSubmit={onOtpSubmit}
            onResend={handleResendOtp}
            onChangeEmail={() => setStep(FORGOT_PASSWORD_STEPS.EMAIL)}
          />
        )}

        {step === FORGOT_PASSWORD_STEPS.NEW_PASSWORD && (
          <ForgotPasswordNewPasswordStep
            isPending={resetPassword.isPending}
            errorMessage={
              resetPassword.data && !resetPassword.data.status
                ? resetPassword.data.message
                : undefined
            }
            resetSuccess={resetSuccess}
            onSubmit={onPasswordSubmit}
          />
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
