"use client"

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD PAGE  (/forgot-password)
// Three steps rendered in a single route — no navigation between them.
//   Step 1 — email:        user enters their email address
//   Step 2 — otp:          user enters the 5-digit code sent to that email
//   Step 3 — new_password: user sets a new password (authorised by httpOnly cookie)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, KeyRound, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react"

import {
  useSendForgotPasswordOtp,
  useVerifyForgotPasswordOtp,
  useResetPassword,
} from "./_hooks/use-forgot-password"
import {
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordEmailInput,
  type ForgotPasswordOtpInput,
  type ForgotPasswordNewPasswordInput,
} from "@/lib/schemas/auth/forgot-password.schema"
import {
  AUTH_ROUTES,
  FORGOT_PASSWORD_STEPS,
  OTP_CONFIG,
  type ForgotPasswordStep,
} from "@/lib/constants/auth"
import { sendOtpAction } from "@/lib/auth/auth-service"
import { OTP_TYPES } from "@/lib/constants/auth"

// ── Step indicator helper ─────────────────────────────────────────────────────
const STEP_ORDER: ForgotPasswordStep[] = [
  FORGOT_PASSWORD_STEPS.EMAIL,
  FORGOT_PASSWORD_STEPS.OTP,
  FORGOT_PASSWORD_STEPS.NEW_PASSWORD,
]

function stepIndex(step: ForgotPasswordStep) {
  return STEP_ORDER.indexOf(step)
}

// ── Error alert ───────────────────────────────────────────────────────────────
function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  )
}

// ── Success alert ─────────────────────────────────────────────────────────────
function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
      <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
    </div>
  )
}

// ── Spinner button ────────────────────────────────────────────────────────────
function SubmitButton({
  isPending,
  label,
  pendingLabel,
}: {
  isPending: boolean
  label: string
  pendingLabel: string
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="mt-2 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold
        text-white shadow-md transition-all duration-200
        hover:bg-teal-700 hover:shadow-lg
        disabled:cursor-not-allowed disabled:opacity-60
        dark:bg-teal-700 dark:hover:bg-teal-600"
    >
      {isPending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const router = useRouter()

  // ── Shared state carried across steps ────────────────────────────────────
  const [step, setStep] = useState<ForgotPasswordStep>(FORGOT_PASSWORD_STEPS.EMAIL)
  const [email, setEmail] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // ── Mutations ─────────────────────────────────────────────────────────────
  const sendOtp = useSendForgotPasswordOtp()
  const verifyOtp = useVerifyForgotPasswordOtp()
  const resetPassword = useResetPassword()

  // Resend OTP mutation — separate instance so it has independent pending state
  const resendOtp = {
    isPending: false, // controlled manually via sendOtpAction
    trigger: async () => {
      const res = await sendOtpAction({ email, type: OTP_TYPES.FORGOT_PASSWORD })
      if (res.status && res.data?.otp) setDevOtp(res.data.otp)
    },
  }

  // ── Forms (one per step) ──────────────────────────────────────────────────
  const emailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  })

  const otpForm = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(forgotPasswordOtpSchema),
  })

  const passwordForm = useForm<ForgotPasswordNewPasswordInput>({
    resolver: zodResolver(forgotPasswordNewPasswordSchema),
  })

  // ── Step 1 submit: send OTP ───────────────────────────────────────────────
  function onEmailSubmit(values: ForgotPasswordEmailInput) {
    sendOtp.mutate(values, {
      onSuccess: (data) => {
        if (!data.status) return
        setEmail(values.email)
        if (data.data?.otp) setDevOtp(data.data.otp)
        setStep(FORGOT_PASSWORD_STEPS.OTP)
        sendOtp.reset()
      },
    })
  }

  // ── Step 2 submit: verify OTP ─────────────────────────────────────────────
  function onOtpSubmit(values: ForgotPasswordOtpInput) {
    verifyOtp.mutate(
      { email, input: values },
      {
        onSuccess: (data) => {
          if (!data.status) return
          setStep(FORGOT_PASSWORD_STEPS.NEW_PASSWORD)
          verifyOtp.reset()
          setDevOtp(null)
        },
      },
    )
  }

  // ── Step 3 submit: reset password ─────────────────────────────────────────
  function onPasswordSubmit(values: ForgotPasswordNewPasswordInput) {
    resetPassword.mutate(values, {
      onSuccess: (data) => {
        if (!data.status) return
        setResetSuccess(true)
        // Redirect to login after a short delay so user sees success message
        setTimeout(() => router.push(AUTH_ROUTES.LOGIN), 2000)
      },
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const currentIndex = stepIndex(step)

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
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br
        from-teal-50 via-white to-cyan-50 p-4
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      {...emailForm.register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all
                        focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                        dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                        ${
                          emailForm.formState.errors.email
                            ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700"
                        }`}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <SubmitButton
                  isPending={sendOtp.isPending}
                  label="Send verification code"
                  pendingLabel="Sending..."
                />
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

              {/* Icon + context */}
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

                <SubmitButton
                  isPending={verifyOtp.isPending}
                  label="Verify code"
                  pendingLabel="Verifying..."
                />
              </form>

              {/* Resend link */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={resendOtp.trigger}
                  disabled={resendOtp.isPending}
                  className="font-semibold text-teal-600 hover:text-teal-700
                    disabled:opacity-50 dark:text-teal-400"
                >
                  Resend
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
                    {/* New password */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          {...passwordForm.register("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none
                            transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                            dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                            ${
                              passwordForm.formState.errors.password
                                ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                                : "border-gray-200 bg-gray-50 dark:border-gray-700"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          {passwordForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          {...passwordForm.register("confirm_password")}
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none
                            transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                            dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                            ${
                              passwordForm.formState.errors.confirm_password
                                ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                                : "border-gray-200 bg-gray-50 dark:border-gray-700"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirm_password && (
                        <p className="mt-1 text-xs text-red-500">
                          {passwordForm.formState.errors.confirm_password.message}
                        </p>
                      )}
                    </div>

                    <SubmitButton
                      isPending={resetPassword.isPending}
                      label="Update password"
                      pendingLabel="Updating..."
                    />
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
    </div>
  )
}
