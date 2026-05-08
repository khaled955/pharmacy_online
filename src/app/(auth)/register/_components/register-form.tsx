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
  type PendingUser,
} from "../_hooks/use-register";
import { useAvatarUpload } from "../_hooks/use-avatar-upload";

import {
  useForgotPasswordOtpSchema,
  type ForgotPasswordOtpInput,
} from "@/lib/schemas/auth/forgot-password.schema";
import useRegisterSchema, {
  type RegisterFormValues,
} from "@/lib/schemas/auth/register.schema";
import {
  AUTH_ROUTES,
  OTP_CONFIG,
  REGISTER_STEPS,
} from "@/lib/constants/auth.constant";
import type { RegisterResponseData, RegisterStep } from "@/lib/types/auth";

import AuthHeader from "@/components/feature/auth/auth-header";
import RegisterStepIndicator from "./register-step-indicator";
import RegisterInfoStep from "./register-info-step";
import RegisterOtpStep from "./register-otp-step";

export default function RegisterForm() {
  // Navigation
  const router = useRouter();

  // State
  const [step, setStep] = useState<RegisterStep>(REGISTER_STEPS.FORM);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);

  // Mutations
  const { onRegister, regiseterError, regiseterIsPending, registerReset } =
    useRegister();
  const verifyMutation = useVerifyRegisterOtp();
  const resendMutation = useResendRegisterOtp();

  // Form & validation — Step 1: registration info
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

  // Form & validation — Step 2: OTP
  const {
    register: otpRegister,
    handleSubmit: otpHandleSubmit,
    reset: otpReset,
    formState: { errors: otpErrors },
  } = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(useForgotPasswordOtpSchema()),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Hooks
  const {
    avatarPreview,
    isAvatarUploading,
    avatarUploadProgress,
    handleAvatarChange,
    handleAvatarRemove,
  } = useAvatarUpload(setValue, resetField);

  // Variables
  const isFormStep = step === REGISTER_STEPS.FORM;

  const verifyError =
    verifyMutation.data && !verifyMutation.data.status
      ? verifyMutation.data.message
      : null;

  const headerTitle = isFormStep ? "Create account" : "Verify your email";
  const headerDescription = isFormStep
    ? "Join our pharmacy platform today"
    : `We sent a ${OTP_CONFIG.LENGTH}-digit code to ${registeredEmail}`;

  // Functions
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

  return (
    <section className="w-full max-w-md">
      {/* header */}
      <AuthHeader title={headerTitle} description={headerDescription} />

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <RegisterStepIndicator step={step} />

        {isFormStep ? (
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
        ) : (
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
