"use client";

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER FORM
// Two-step flow:
//   Step 1 — form:  personal details + password
//   Step 2 — otp:   5-digit email verification code
// On successful OTP verification the user is redirected to login.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck, Upload, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  useRegister,
  useVerifyRegisterOtp,
  useResendRegisterOtp,
} from "../_hooks/use-register";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth/register.schema";
import {
  forgotPasswordOtpSchema,
  type ForgotPasswordOtpInput,
} from "@/lib/schemas/auth/forgot-password.schema";
import {
  AUTH_ROUTES,
  OTP_CONFIG,
  REGISTER_STEPS,
  type RegisterStep,
} from "@/lib/constants/auth";
import type { RegisterResponseData } from "@/lib/types/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PendingUser = {
  first_name: string;
  last_name: string;
  phone?: string | null;
  password: string;
  avatar_url: string | null;
};

export default function RegisterForm() {
  const router = useRouter();

  // ── Step state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<RegisterStep>(REGISTER_STEPS.FORM);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const {
    mutate: registerUser,
    isPending: isRegistering,
    data: registerData,
  } = useRegister();

  const verifyMutation = useVerifyRegisterOtp();
  const resendMutation = useResendRegisterOtp();

  // ── Forms ───────────────────────────────────────────────────────────────────
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const {
    register: otpRegister,
    handleSubmit: otpHandleSubmit,
    reset: otpReset,
    formState: { errors: otpErrors },
  } = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(forgotPasswordOtpSchema),
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<RegisterInput> = (values) => {
    registerUser(values, {
      onSuccess: (data) => {
        if (!data.status) return;
        setRegisteredEmail(values.email);
        const payload = data.data as RegisterResponseData;
        if (payload?.otp) setDevOtp(payload.otp);
        setPendingUser({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone ?? null,
          password: values.password,
          avatar_url: payload.avatar_url ?? null,
        });
        setStep(REGISTER_STEPS.OTP);
      },
    });
  };

  const onOtpSubmit: SubmitHandler<ForgotPasswordOtpInput> = ({ otp }) => {
    if (!pendingUser) return;
    verifyMutation.mutate(
      { email: registeredEmail, otp, pending: pendingUser },
      {
        onSuccess: (data) => {
          if (!data.status) return;
          setStep(REGISTER_STEPS.FORM);
          setRegisteredEmail("");
          setPendingUser(null);
          setDevOtp(null);
          setAvatarPreview(null);
          resetForm();
          otpReset();
          router.push(`${AUTH_ROUTES.LOGIN}?verified=true`);
        },
      },
    );
  };

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
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
            {step === REGISTER_STEPS.FORM ? "Create account" : "Verify your email"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {step === REGISTER_STEPS.FORM
              ? "Join our pharmacy platform today"
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
                {/* ── Avatar upload ── */}
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
                          alt="avatar preview"
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

                {/* ── First + Last name ── */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First name"
                    type="text"
                    placeholder="Ahmed"
                    error={errors.first_name?.message}
                    {...formRegister("first_name")}
                  />
                  <Input
                    label="Last name"
                    type="text"
                    placeholder="Ali"
                    error={errors.last_name?.message}
                    {...formRegister("last_name")}
                  />
                </div>

                {/* ── Email ── */}
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...formRegister("email")}
                />

                {/* ── Phone ── */}
                <Input
                  label="Phone number"
                  type="text"
                  placeholder="05xxxxxxxx"
                  error={errors.phone?.message}
                  startIcon={<Phone size={16} strokeWidth={1.75} />}
                  {...formRegister("phone")}
                />

                {/* ── Password ── */}
                <Input
                  label="Password"
                  type="password"
                  mood="create"
                  placeholder="Min. 8 characters"
                  error={errors.password?.message}
                  {...formRegister("password")}
                />

                {/* ── Confirm password ── */}
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirm_password?.message}
                  {...formRegister("confirm_password")}
                />

                <Button type="submit" isLoading={isRegistering}>
                  Create account
                </Button>
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

              <form onSubmit={otpHandleSubmit(onOtpSubmit)} className="space-y-4">
                {/* OTP input — special large centered style */}
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

                <Button type="submit" isLoading={verifyMutation.isPending}>
                  Verify email
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => resendMutation.mutate(registeredEmail)}
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
  );
}
