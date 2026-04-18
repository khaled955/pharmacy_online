"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import { LoginFields, useLoginSchema } from "@/lib/schemas/auth/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../_hooks/use-login";
import { cn } from "@/lib/utils/tailwind-merge";

export default function LoginForm() {
  // Mutation
  const { loginError, loginIsPending, onLogin } = useLogin();

  // RHF
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitted, isValid },
  } = useForm<LoginFields>({
    resolver: zodResolver(useLoginSchema()),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handler
  const onSubmit: SubmitHandler<LoginFields> = (values) => {
    onLogin(values);
  };

  return (
    <div className="w-full max-w-md">
      {/* ── Logo + headings ── */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 shadow-lg dark:bg-teal-700">
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
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Email ── */}
          <Input
            error={errors.email?.message}
            label="Email"
            type="email"
            placeholder="Enter Email"
            {...register("email")}
          />
          {/* forget-password */}
          <div className="mb-1.5 flex items-center justify-end">
            <Link
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className={cn(
                "text-xs font-medium text-teal-600 hover:text-teal-700",
                "dark:text-teal-400 dark:hover:text-teal-300",
              )}
            >
              Forgot password?
            </Link>
          </div>
          {/* password */}
          <Input
            error={errors.password?.message}
            label="Password"
            type="password"
            placeholder="Enter Password"
            {...register("password")}
          />

          {/* ── Submit ── */}
          <Button
            isLoading={loginIsPending}
            type="submit"
            serverError={loginError?.message}
            disabled={!isValid && isSubmitted}
          >
            Login
          </Button>
        </form>

        {/* ── Footer ── */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Dont have an account?
          <Link
            href={AUTH_ROUTES.REGISTER}
            className={cn(
              "font-semibold text-teal-600 hover:text-teal-700",
              "dark:text-teal-400 dark:hover:text-teal-300",
            )}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
