"use client";
import { AUTH_REDIRECT_DURATION } from "@/lib/constants/auth";
import { LoginFields } from "@/lib/schemas/auth/login.schema";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  // Hooks
  const searchParams = useSearchParams();

  //Variables
  const rawCallbackUrl = searchParams.get("callbackUrl");

  //Security: prevent open redirect
  const callbackUrl =
    rawCallbackUrl && rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/";

  const {
    mutate: onLogin,
    error: loginError,
    isPending: loginIsPending,
  } = useMutation({
    mutationFn: async (loginFormValues: LoginFields) => {
      const payload = await signIn("credentials", {
        email: loginFormValues.email,
        password: loginFormValues.password,
        redirect: false,
      });

      if (!payload?.ok) {
        throw new Error("Invalid email or password");
      }
      return payload;
    },
    onSuccess: () => {
      toast.success("Login successful! Redirecting...", {
        duration: AUTH_REDIRECT_DURATION,
        onAutoClose: () => {
          // full page reload to update the session
          window.location.href = callbackUrl;
        },
      });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  return { onLogin, loginError, loginIsPending };
}
