"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Upload, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useRegister } from "./_hooks/use-register"
import type { RegisterInput } from "@/lib/schemas/auth/register.schema"
import { registerSchema } from "@/lib/schemas/auth/register.schema"
import { RegisterResponseData } from "@/lib/types/auth"

// Verify OTP service
async function verifyOtp(email: string, otp: string) {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  })
  return res.json()
}

// Resend OTP service
async function resendOtp(email: string) {
  const res = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  return res.json()
}

export default function RegisterPage() {
  const router = useRouter()

  // Steps
  const [step, setStep] = useState<"register" | "otp">("register")
  const [registeredEmail, setRegisteredEmail] = useState("")

  // OTP state
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Mutations
  const { mutate: registerUser, isPending: isRegistering, data: registerData } = useRegister()

  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
    onSuccess: (data) => {
      if (data.status) {
        router.push("/login?verified=true")
      }
    }
  })

  const resendMutation = useMutation({
    mutationFn: (email: string) => resendOtp(email),
    onSuccess: (data) => {
      if (data.status && data.data?.otp) {
        setDevOtp(data.data.otp)
      }
    }
  })

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  })

  // Handlers
  function onSubmit(values: RegisterInput) {
    registerUser(values, {
      onSuccess: (data) => {
        if (data.status) {
          setRegisteredEmail(values.email)
          // Store dev OTP if present
          const responseData = data.data as RegisterResponseData
          if (responseData?.otp) {
            setDevOtp(responseData.otp)
          }
          setStep("otp")
        }
      }
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
    verifyMutation.mutate({ email: registeredEmail, otp })
  }

  function handleResendOtp() {
    resendMutation.mutate(registeredEmail)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === "register" ? "Create account" : "Verify your email"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === "register"
              ? "Join our pharmacy platform"
              : `We sent a 5-digit code to ${registeredEmail}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${step === "register" ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-600"}`}>
              1
            </div>
            <div className={`h-0.5 w-12 transition-all ${step === "otp" ? "bg-teal-600" : "bg-gray-200"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${step === "otp" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              2
            </div>
          </div>

          {/* ── STEP 1: Register Form ── */}
          {step === "register" && (
            <>
              {/* Server error */}
              {registerData && !registerData.status && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{registerData.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Avatar */}
                <div className="flex justify-center mb-2">
                  <label className="cursor-pointer group relative">
                    <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all
                      ${avatarPreview ? "border-teal-400" : "border-gray-300 hover:border-teal-400 bg-gray-50"}`}>
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="avatar"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400 group-hover:text-teal-500" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register("first_name")}
                        placeholder="Ahmed"
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all
                          focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                          ${errors.first_name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register("last_name")}
                        placeholder="Ali"
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all
                          focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                          ${errors.last_name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("phone")}
                      placeholder="05xxxxxxxx"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition-all
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("confirm_password")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition-all
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        ${errors.confirm_password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl
                    transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-60 mt-2"
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : "Create account"}
                </button>

              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === "otp" && (
            <div className="space-y-5">

              {/* Dev mode OTP */}
              {devOtp && (
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-xl text-center">
                  <p className="text-yellow-600 text-xs font-medium uppercase tracking-wide">
                    🔧 Dev Mode — Your OTP
                  </p>
                  <p className="text-yellow-800 text-3xl font-bold tracking-[0.5em] mt-1">
                    {devOtp}
                  </p>
                </div>
              )}

              {/* Verify error */}
              {verifyMutation.data && !verifyMutation.data.status && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{verifyMutation.data.message}</p>
                </div>
              )}

              {/* Resend success */}
              {resendMutation.data?.status && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">✅ New OTP sent successfully</p>
                </div>
              )}

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 rounded-2xl mb-3">
                  <KeyRound className="w-7 h-7 text-teal-600" />
                </div>
                <p className="text-sm text-gray-500">Enter the 5-digit code sent to</p>
                <p className="font-semibold text-gray-800">{registeredEmail}</p>
              </div>

              {/* OTP Input */}
              <div>
                <input
                  type="text"
                  maxLength={5}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="_ _ _ _ _"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] border-2 border-gray-200
                    rounded-xl py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    bg-gray-50"
                />
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 5 || verifyMutation.isPending}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl
                  transition-all duration-200 text-sm shadow-md disabled:opacity-60"
              >
                {verifyMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : "Verify email"}
              </button>

              {/* Resend */}
              <p className="text-center text-sm text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={resendMutation.isPending}
                  className="text-teal-600 hover:text-teal-700 font-semibold disabled:opacity-50"
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