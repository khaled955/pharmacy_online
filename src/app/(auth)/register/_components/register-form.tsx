"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useRegister,
  useVerifyRegisterOtp,
  useResendRegisterOtp,
} from "../_hooks/use-register";

import {
  useForgotPasswordOtpSchema,
  type ForgotPasswordOtpInput,
} from "@/lib/schemas/auth/forgot-password.schema";
import {
  AUTH_ROUTES,
  OTP_CONFIG,
  REGISTER_STEPS,
} from "@/lib/constants/auth.constant";
import type { RegisterResponseData, RegisterStep } from "@/lib/types/auth";
import useRegisterSchema, {
  RegisterFormValues,
} from "@/lib/schemas/auth/register.schema";

import RegisterStepIndicator from "./register-step-indicator";
import RegisterInfoStep from "./register-info-step";
import RegisterOtpStep from "./register-otp-step";
import AuthHeader from "@/components/feature/auth/auth-header";

type PendingUser = {
  first_name: string;
  last_name: string;
  phone?: string | null;
  password: string;
  avatar: File | null;
};

export default function RegisterForm() {
  // Navigation
  const router = useRouter();

  // State
  const [step, setStep] = useState<RegisterStep>(REGISTER_STEPS.FORM);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);

  // Mutations
  const { onRegister, regiseterError, regiseterIsPending, registerReset } =
    useRegister();
  const verifyMutation = useVerifyRegisterOtp();
  const resendMutation = useResendRegisterOtp();

  // Step 1 — registration form
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitted, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(useRegisterSchema()),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      avatar: null,
    },
  });

  // Step 2 — OTP form
  const {
    register: otpRegister,
    handleSubmit: otpHandleSubmit,
    reset: otpReset,
    formState: { errors: otpErrors },
  } = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(useForgotPasswordOtpSchema()),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  // Handlers

  const onSubmit: SubmitHandler<RegisterFormValues> = (values) => {
    onRegister(values, {
      onSuccess: (data) => {
        if (!data.status) {
          toast.error(data.message);
          return;
        }

        const payload = data.data as RegisterResponseData;

        setRegisteredEmail(values.email);

        if (payload?.otp) setDevOtp(payload.otp);

        setPendingUser({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone ?? null,
          password: values.password,
          avatar: values.avatar ?? null,
        });

        toast.success("OTP sent to your email");
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
          if (!data.status) {
            toast.error(data.message);
            return;
          }

          router.push(`${AUTH_ROUTES.LOGIN}?verified=true`);
        },
      },
    );
  };

  const onResend = () => {
    resendMutation.mutate(registeredEmail, {
      onSuccess: (data) => {
        if (data.status) {
          toast.success("New code sent!");
          if (data.data?.otp) setDevOtp(data.data.otp);
        } else {
          toast.error(data.message);
        }
      },
    });
  };

  const onBack = () => {
    registerReset();
    verifyMutation.reset();
    resendMutation.reset();
    otpReset();
    setDevOtp(null);
    setStep(REGISTER_STEPS.FORM);
  };

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("avatar", file, { shouldValidate: true, shouldDirty: true });
    setAvatarPreview(URL.createObjectURL(file));

    // Mock upload progress until real upload is connected
    setIsAvatarUploading(true);
    setAvatarUploadProgress(0);

    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;
      setAvatarUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsAvatarUploading(false);
      }
    }, 150);
  }

  function handleAvatarRemove() {
    resetField("avatar");
    setAvatarPreview(null);
    setAvatarUploadProgress(0);
    setIsAvatarUploading(false);
  }

  
  const verifyError =
    verifyMutation.data && !verifyMutation.data.status
      ? verifyMutation.data.message
      : null;

  return (
    <section className="w-full max-w-md">
      {/* header */}
      <AuthHeader
        title={
          step === REGISTER_STEPS.FORM ? "Create account" : "Verify your email"
        }
        description={
          step === REGISTER_STEPS.FORM
            ? "Join our pharmacy platform today"
            : `We sent a ${OTP_CONFIG.LENGTH}-digit code to ${registeredEmail}`
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <RegisterStepIndicator step={step} />

        {step === REGISTER_STEPS.FORM && (
          <RegisterInfoStep
            formRegister={formRegister}
            errors={errors}
            isLoading={regiseterIsPending}
            serverError={regiseterError?.message}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            onAvatarRemove={handleAvatarRemove}
            isAvatarUploading={isAvatarUploading}
            avatarUploadProgress={avatarUploadProgress}
            onSubmit={handleSubmit(onSubmit)}
            isValid={isValid}
            isSubmitted={isSubmitted}
          />
        )}

        {step === REGISTER_STEPS.OTP && (
          <RegisterOtpStep
            registeredEmail={registeredEmail}
            devOtp={devOtp}
            verifyError={verifyError}
            isVerifying={verifyMutation.isPending}
            isResending={resendMutation.isPending}
            otpRegister={otpRegister}
            otpErrors={otpErrors}
            onOtpSubmit={otpHandleSubmit(onOtpSubmit)}
            onResend={onResend}
            onBack={onBack}
          />
        )}
      </div>
    </section>
  );
}
