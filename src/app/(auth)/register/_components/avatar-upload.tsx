"use client";

import * as React from "react";
import Image from "next/image";
import { LoaderCircle, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

type AvatarUploadProps = {
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  className?: string;
  inputId?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
};

export default function AvatarUpload({
  preview,
  onChange,
  onRemove,
  isUploading = false,
  uploadProgress = 0,
  className,
  inputId = "avatar-upload",
  disabled = false,
  label = "Profile photo",
  helperText = "Upload a clear profile picture",
}: AvatarUploadProps) {
  // Ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  // Variables
  const hasPreview = Boolean(preview);
  const safeProgress = Math.max(0, Math.min(100, uploadProgress));

  //   Handlers
  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (disabled || isUploading) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onRemove();
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      </div>

      <div className="relative">
        <label
          htmlFor={inputId}
          className={cn(
            "group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all",
            "focus-within:ring-2 focus-within:ring-teal-500/30",
            hasPreview
              ? "border-teal-400 bg-white dark:bg-gray-900"
              : "border-gray-300 bg-gray-50 hover:border-teal-400 dark:border-gray-600 dark:bg-gray-800",
            (disabled || isUploading) && "cursor-not-allowed opacity-70",
          )}
        >
          {hasPreview ? (
            <>
              <Image
                src={preview!}
                alt="avatar preview"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity",
                  "group-hover:opacity-100",
                  isUploading && "opacity-100",
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1 text-white">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    <span className="text-[11px] font-medium">
                      {safeProgress}%
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-white">
                    <Upload className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Change</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {isUploading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin text-teal-500" />
                  <span className="text-xs text-teal-500">{safeProgress}%</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
                  <span className="text-xs text-gray-400 group-hover:text-teal-500">
                    Photo
                  </span>
                </>
              )}
            </div>
          )}
        </label>

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
          disabled={disabled || isUploading}
        />

        {hasPreview && (
          <button
            type="button"
            aria-label="Remove avatar"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className={cn(
              "absolute -right-1 -top-1 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition",
              "border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600",
              "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-red-950 dark:hover:text-red-400",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {isUploading ? (
              <X className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}

        {isUploading && (
          <div className="mt-3 w-24">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-300"
                style={{ width: `${safeProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
