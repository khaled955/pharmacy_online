"use client";
import { loginAction } from "@/lib/auth/login.action";
import { LoginFields } from "@/lib/schemas/auth/login.schema";
import { AuthResponse, LoginResponseData } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
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
  } = useMutation<AuthResponse<LoginResponseData>, Error, LoginFields>({
    mutationFn: async (loginFormValues) => {
      const response = await loginAction(loginFormValues);

      if (!response.status) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
        onAutoClose: () => {
          // redirect to callbackUrl or homepage
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
