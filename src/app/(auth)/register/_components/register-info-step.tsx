import Image from "next/image";
import Link from "next/link";
import { Phone, Upload } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import { RegisterFormValues } from "@/lib/schemas/auth/register.schema";

interface RegisterInfoStepProps {
  formRegister: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  isLoading: boolean;
  serverError: string | null;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (e?: any) => void;
}

export default function RegisterInfoStep({
  formRegister,
  errors,
  isLoading,
  serverError,
  avatarPreview,
  onAvatarChange,
  onSubmit,
}: RegisterInfoStepProps) {
  return (
    <>
      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Avatar upload */}
        <div className="mb-2 flex justify-center">
          <label className="group relative cursor-pointer">
            <div
              className={`flex h-20 w-20 items-center justify-center overflow-hidden
                rounded-full border-2 border-dashed transition-all
                ${
                  avatarPreview
                    ? "border-teal-400"
                    : "border-gray-300 bg-gray-50 hover:border-teal-400 dark:border-gray-600 dark:bg-gray-800"
                }`}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="avatar preview"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
                  <span className="text-xs text-gray-400">Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </label>
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            type="text"
            placeholder="Ahmed"
            error={errors.first_name?.message}
            {...formRegister("first_name")}
          />
          <Input
            label="Last name"
            type="text"
            placeholder="Ali"
            error={errors.last_name?.message}
            {...formRegister("last_name")}
          />
        </div>

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...formRegister("email")}
        />

        {/* Phone */}
        <Input
          label="Phone number"
          type="text"
          placeholder="05xxxxxxxx"
          error={errors.phone?.message}
          startIcon={<Phone size={16} strokeWidth={1.75} />}
          {...formRegister("phone")}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          mood="create"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          {...formRegister("password")}
        />

        {/* Confirm password */}
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...formRegister("confirm_password")}
        />

        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
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
