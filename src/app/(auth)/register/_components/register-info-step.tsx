"use client";
import Link from "next/link";
import { Phone } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import { RegisterFormValues } from "@/lib/schemas/auth/register.schema";
import AvatarUpload from "./avatar-upload";

interface RegisterInfoStepProps {
  formRegister: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  isLoading: boolean;
  serverError: string | null;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarRemove: () => void;
  isAvatarUploading?: boolean;
  avatarUploadProgress?: number;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitted: boolean;
}

export default function RegisterInfoStep({
  formRegister,
  errors,
  isLoading,
  serverError,
  avatarPreview,
  isValid,
  isSubmitted,
  onAvatarChange,
  onAvatarRemove,
  isAvatarUploading = false,
  avatarUploadProgress = 0,
  onSubmit,
}: RegisterInfoStepProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Avatar photo */}
        <AvatarUpload
          preview={avatarPreview}
          onChange={onAvatarChange}
          onRemove={onAvatarRemove}
          isUploading={isAvatarUploading}
          uploadProgress={avatarUploadProgress}
        />

        <div className="grid grid-cols-2 gap-3">
          {/* first-name */}
          <Input
            label="First name"
            type="text"
            placeholder="khaled"
            error={errors.first_name?.message}
            {...formRegister("first_name")}
          />
          {/* last-name */}
          <Input
            label="Last name"
            type="text"
            placeholder="mansour"
            error={errors.last_name?.message}
            {...formRegister("last_name")}
          />
        </div>
        {/* email-address */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...formRegister("email")}
        />
        {/* phone-number */}
        <Input
          label="Phone number"
          type="tel"
          placeholder="05xxxxxxxx"
          error={errors.phone?.message}
          startIcon={<Phone size={16} strokeWidth={1.75} />}
          {...formRegister("phone")}
        />
        {/* password */}
        <Input
          label="Password"
          type="password"
          mood="create"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          {...formRegister("password")}
        />
        {/* confirm-password */}
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...formRegister("confirm_password")}
        />
        {/* submit-button */}
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={(!isValid && isSubmitted) || isAvatarUploading}
          serverError={serverError ?? undefined}
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
