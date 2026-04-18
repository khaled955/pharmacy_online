"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type ForgotPasswordEmailInput,
  useForgotPasswordEmailSchema,
} from "@/lib/schemas/auth/forgot-password.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: SubmitHandler<ForgotPasswordEmailInput>;
  isPending: boolean;
  errorMessage?: string;
}

export default function ForgotPasswordEmailStep({ onSubmit, isPending, errorMessage }: Props) {
  const form = useForm<ForgotPasswordEmailInput>({
    defaultValues: { email: "" },
    resolver: zodResolver(useForgotPasswordEmailSchema()),
  });

  return (
    <>
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <Button type="submit" isLoading={isPending}>
          Send verification code
        </Button>
      </form>
    </>
  );
}
