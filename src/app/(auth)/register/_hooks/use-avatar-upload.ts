"use client";

import { useState } from "react";
import type { UseFormSetValue, UseFormResetField } from "react-hook-form";
import type { RegisterFormValues } from "@/lib/schemas/auth/register.schema";

interface UseAvatarUploadReturn {
  avatarPreview: string | null;
  isAvatarUploading: boolean;
  avatarUploadProgress: number;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarRemove: () => void;
}

export function useAvatarUpload(
  setValue: UseFormSetValue<RegisterFormValues>,
  resetField: UseFormResetField<RegisterFormValues>,
): UseAvatarUploadReturn {
  // State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);

  // Functions
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

  return {
    avatarPreview,
    isAvatarUploading,
    avatarUploadProgress,
    handleAvatarChange,
    handleAvatarRemove,
  };
}
