"use client"

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE  (/login)
// Authenticates via Supabase signInWithPassword through the loginAction service.
// Redirects to home on success; shows an inline error on failure.
// ─────────────────────────────────────────────────────────────────────────────

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react"

import { useLogin } from "./_hooks/use-login"
import { loginSchema, type LoginInput } from "@/lib/schemas/auth/login.schema"
import { AUTH_ROUTES } from "@/lib/constants/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: login, isPending, data } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(values: LoginInput) {
    login(values, {
      onSuccess: (res) => {
        // Redirect to home dashboard on successful authentication
        if (res.status) router.push("/")
      },
    })
  }

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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sign in to your pharmacy account
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl
            dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Server error */}
          {data && !data.status && (
            <div
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3
                dark:border-red-800 dark:bg-red-950"
            >
              <p className="text-sm text-red-600 dark:text-red-400">
                {data.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── Email ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all
                    focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                    dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                    ${
                      errors.email
                        ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  href={AUTH_ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-medium text-teal-600 hover:text-teal-700
                    dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none transition-all
                    focus:border-teal-500 focus:ring-2 focus:ring-teal-500
                    dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                    ${
                      errors.password
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* ── Submit ── */}
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href={AUTH_ROUTES.REGISTER}
              className="font-semibold text-teal-600 hover:text-teal-700
                dark:text-teal-400 dark:hover:text-teal-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
