import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type ForgotPasswordOtpInput } from "@/lib/schemas/auth/forgot-password.schema";
import RegisterOtpBackButton from "./register-otp-back-button";
import RegisterOtpDevBadge from "./register-otp-dev-badge";
import RegisterOtpContext from "./register-otp-context";
import RegisterOtpForm from "./register-otp-form";
import RegisterOtpResend from "./register-otp-resend";

interface RegisterOtpStepProps {
  registeredEmail: string;
  devOtp: string | null;
  verifyError: string | null;
  isVerifying: boolean;
  isResending: boolean;
  otpRegister: UseFormRegister<ForgotPasswordOtpInput>;
  otpErrors: FieldErrors<ForgotPasswordOtpInput>;
  onOtpSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
  isSubmitted?: boolean;
  isValid?: boolean;
}

export default function RegisterOtpStep({
  registeredEmail,
  devOtp,
  verifyError,
  isVerifying,
  isResending,
  otpRegister,
  otpErrors,
  onOtpSubmit,
  onResend,
  onBack,
}: RegisterOtpStepProps) {
  return (
    <div className="space-y-5">
      <RegisterOtpBackButton onBack={onBack} />

      <RegisterOtpDevBadge devOtp={devOtp} />

      <RegisterOtpContext registeredEmail={registeredEmail} />

      <RegisterOtpForm
        otpRegister={otpRegister}
        otpErrors={otpErrors}
        verifyError={verifyError}
        isVerifying={isVerifying}
        onOtpSubmit={onOtpSubmit}
      />

      <RegisterOtpResend isResending={isResending} onResend={onResend} />
    </div>
  );
}
