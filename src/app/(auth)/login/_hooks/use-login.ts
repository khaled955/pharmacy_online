"use client";
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
  } = useMutation<void, Error, LoginFields>({
    mutationFn: async (loginFormValues) => {
      const result = await signIn("credentials", {
        email: loginFormValues.email,
        password: loginFormValues.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }
    },
    onSuccess: () => {
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
        onAutoClose: () => {
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
