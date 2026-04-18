"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type ForgotPasswordNewPasswordInput,
  useForgotPasswordNewPasswordSchema,
} from "@/lib/schemas/auth/forgot-password.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  isPending: boolean;
  errorMessage?: string;
  resetSuccess: boolean;
  onSubmit: SubmitHandler<ForgotPasswordNewPasswordInput>;
}

export default function ForgotPasswordNewPasswordStep({
  isPending,
  errorMessage,
  resetSuccess,
  onSubmit,
}: Props) {
  const form = useForm<ForgotPasswordNewPasswordInput>({
    resolver: zodResolver(useForgotPasswordNewPasswordSchema()),
  });

  if (resetSuccess) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
        <p className="text-sm text-green-600 dark:text-green-400">
          Password updated! Redirecting to login…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          mood="create"
          placeholder="Min. 8 characters"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={form.formState.errors.confirm_password?.message}
          {...form.register("confirm_password")}
        />

        <Button type="submit" isLoading={isPending}>
          Update password
        </Button>
      </form>
    </div>
  );
}
