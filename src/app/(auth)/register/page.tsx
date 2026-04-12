"use client"

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE  (/register)
// Two-step flow rendered in a single route:
//   Step 1 — register: user fills in personal details + password
//   Step 2 — otp:      user enters the 5-digit verification code sent to email
// On successful OTP verification the user is redirected to login.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ShieldCheck, Upload, KeyRound,
} from "lucide-react"

import { useRegister } from "./_hooks/use-register"
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth/register.schema"
import {
  AUTH_ROUTES,
  MUTATION_KEYS,
  OTP_CONFIG,
  OTP_TYPES,
  REGISTER_STEPS,
  type RegisterStep,
} from "@/lib/constants/auth"
import { verifyRegisterOtpAction, sendOtpAction } from "@/lib/auth/auth-service"
import type { RegisterResponseData } from "@/lib/types/auth"

export default function RegisterPage() {
  const router = useRouter()

  // ── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState<RegisterStep>(REGISTER_STEPS.FORM)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)

  // Holds the registration data between step 1 and OTP verification.
  // The Supabase user is created only after the OTP is confirmed.
  const [pendingUser, setPendingUser] = useState<{
    first_name: string
    last_name: string
    phone?: string | null
    password: string
    avatar_url: string | null
  } | null>(null)

  // ── Password visibility toggles ───────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ── Avatar preview URL ────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: register, isPending: isRegistering, data: registerData } = useRegister()

  // Verify OTP submitted in step 2
  const verifyMutation = useMutation({
    mutationKey: MUTATION_KEYS.VERIFY_OTP,
    mutationFn: ({
      email,
      otp,
      pending,
    }: {
      email: string
      otp: string
      pending: NonNullable<typeof pendingUser>
    }) => verifyRegisterOtpAction(email, otp, pending),
    onSuccess: (data) => {
      if (data.status) {
        // Reset to step 1 before navigating so the router cache restores a clean form
        setStep(REGISTER_STEPS.FORM)
        setOtp("")
        setRegisteredEmail("")
        setPendingUser(null)
        setDevOtp(null)
        setAvatarPreview(null)
        resetForm()
        router.push(`${AUTH_ROUTES.LOGIN}?verified=true`)
      }
    },
  })

  // Resend OTP when user didn't receive it
  const resendMutation = useMutation({
    mutationKey: MUTATION_KEYS.RESEND_OTP,
    mutationFn: (email: string) =>
      sendOtpAction({ email, type: OTP_TYPES.REGISTER }),
    onSuccess: (data) => {
      if (data.status && data.data?.otp) setDevOtp(data.data.otp)
    },
  })

  // ── Register form ─────────────────────────────────────────────────────────
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  // ── Handlers ──────────────────────────────────────────────────────────────

  function onSubmit(values: RegisterInput) {
    register(values, {
      onSuccess: (data) => {
        if (!data.status) return
        setRegisteredEmail(values.email)
        const payload = data.data as RegisterResponseData
        if (payload?.otp) setDevOtp(payload.otp)
        // Store registration data so verify-otp can create the user after confirmation
        setPendingUser({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone ?? null,
          password: values.password,
          avatar_url: payload.avatar_url ?? null,
        })
        setStep(REGISTER_STEPS.OTP)
      },
    })
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setValue("avatar", file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  function handleVerifyOtp() {
    if (!pendingUser) return
    verifyMutation.mutate({ email: registeredEmail, otp, pending: pendingUser })
  }

  function handleResendOtp() {
    resendMutation.mutate(registeredEmail)
  }

  // ── Shared input class helpers ────────────────────────────────────────────
  const inputBase =
    "w-full rounded-xl border py-2.5 text-sm outline-none transition-all " +
    "focus:border-teal-500 focus:ring-2 focus:ring-teal-500 " +
    "dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"

  const inputError = "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
  const inputNormal = "border-gray-200 bg-gray-50 dark:border-gray-700"

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-teal-50 via-white to-cyan-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
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
            {step === REGISTER_STEPS.FORM ? "Create account" : "Verify your email"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {step === REGISTER_STEPS.FORM
              ? "Join our pharmacy platform"
              : `We sent a ${OTP_CONFIG.LENGTH}-digit code to ${registeredEmail}`}
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl
            dark:border-gray-800 dark:bg-gray-900"
        >
          {/* ── Step indicator ── */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
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

          {/* ════════════════════════════════════════════════════════════════
              STEP 1 — REGISTER FORM
          ════════════════════════════════════════════════════════════════ */}
          {step === REGISTER_STEPS.FORM && (
            <>
              {registerData && !registerData.status && (
                <div
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3
                    dark:border-red-800 dark:bg-red-950"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {registerData.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Avatar upload */}
                <div className="mb-2 flex justify-center">
                  <label className="group relative cursor-pointer">
                    <div
                      className={`flex h-20 w-20 items-center justify-center overflow-hidden
                        rounded-full border-2 border-dashed transition-all
                        ${
                          avatarPreview
                            ? "border-teal-400"
                            : "border-gray-300 bg-gray-50 hover:border-teal-400 dark:border-gray-600 dark:bg-gray-800"
                        }`}
                    >
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="avatar"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
                          <span className="text-xs text-gray-400">Photo</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...formRegister("first_name")}
                        placeholder="Ahmed"
                        className={`${inputBase} pl-9 pr-3 ${errors.first_name ? inputError : inputNormal}`}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        {...formRegister("last_name")}
                        placeholder="Ali"
                        className={`${inputBase} pl-9 pr-3 ${errors.last_name ? inputError : inputNormal}`}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      {...formRegister("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`${inputBase} pl-10 pr-4 ${errors.email ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      {...formRegister("phone")}
                      placeholder="05xxxxxxxx"
                      className={`${inputBase} pl-10 pr-4 ${errors.phone ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      {...formRegister("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className={`${inputBase} pl-10 pr-10 ${errors.password ? inputError : inputNormal}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
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
                      {...formRegister("confirm_password")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputBase} pl-10 pr-10
                        ${errors.confirm_password ? inputError : inputNormal}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="mt-2 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold
                    text-white shadow-md transition-all duration-200
                    hover:bg-teal-700 hover:shadow-lg
                    disabled:cursor-not-allowed disabled:opacity-60
                    dark:bg-teal-700 dark:hover:bg-teal-600"
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-semibold text-teal-600 hover:text-teal-700
                    dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 2 — OTP VERIFICATION
          ════════════════════════════════════════════════════════════════ */}
          {step === REGISTER_STEPS.OTP && (
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

              {verifyMutation.data && !verifyMutation.data.status && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 p-3
                    dark:border-red-800 dark:bg-red-950"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {verifyMutation.data.message}
                  </p>
                </div>
              )}

              {resendMutation.data?.status && (
                <div
                  className="rounded-xl border border-green-200 bg-green-50 p-3
                    dark:border-green-800 dark:bg-green-950"
                >
                  <p className="text-sm text-green-600 dark:text-green-400">
                    New code sent successfully
                  </p>
                </div>
              )}

              {/* Context */}
              <div className="text-center">
                <div
                  className="mb-3 inline-flex h-14 w-14 items-center justify-center
                    rounded-2xl bg-teal-50 dark:bg-teal-900/40"
                >
                  <KeyRound className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the code sent to
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {registeredEmail}
                </p>
              </div>

              {/* OTP input */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={OTP_CONFIG.LENGTH}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder={"_ ".repeat(OTP_CONFIG.LENGTH).trim()}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 text-center
                  text-2xl font-bold tracking-[0.5em] outline-none transition-all
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-600"
              />

              {/* Verify button */}
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== OTP_CONFIG.LENGTH || verifyMutation.isPending}
                className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold
                  text-white shadow-md transition-all duration-200
                  hover:bg-teal-700 hover:shadow-lg
                  disabled:cursor-not-allowed disabled:opacity-60
                  dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                {verifyMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </span>
                ) : (
                  "Verify email"
                )}
              </button>

              {/* Resend link */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={resendMutation.isPending}
                  className="font-semibold text-teal-600 hover:text-teal-700
                    disabled:opacity-50 dark:text-teal-400"
                >
                  {resendMutation.isPending ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
