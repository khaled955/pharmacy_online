"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, Search, User } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { PASSWORD_PATTERN } from "@/lib/constants/auth";

type NativeInputProps = React.ComponentProps<"input">;

type InputProps = NativeInputProps & {
  inputClassName?: string;
  wrapperClassName?: string;
  startIcon?: React.ReactNode;
  label?: string;
  error?: string;
  mood?: "create" | "login";
  passwordLabels?: {
    show: string;
    hide: string;
  };
};

// Styles

const fieldWrapperClasses = "flex w-full flex-col gap-1.5";

const labelClasses =
  "text-sm font-medium leading-none text-foreground/90 text-start";

const errorTextClasses =
  "text-xs font-medium leading-none text-destructive text-start";

const sharedTransitionClasses = "transition-all duration-200 ease-out";

const wrapperBaseClasses = cn(
  "relative flex h-12 w-full items-center overflow-hidden rounded-2xl border",
  "bg-background/95 backdrop-blur-sm",
  "border-border/70 shadow-sm",
  "hover:border-primary/35 hover:bg-background",
  "focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10",
  "dark:bg-background/60 dark:border-border/70",
  "dark:hover:border-primary/40 dark:focus-within:border-primary/60 dark:focus-within:ring-primary/15",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
  sharedTransitionClasses,
);

const wrapperErrorClasses = cn(
  "border-destructive/80 hover:border-destructive focus-within:border-destructive focus-within:ring-destructive/10",
  "dark:border-destructive/80 dark:hover:border-destructive dark:focus-within:border-destructive dark:focus-within:ring-destructive/15",
);

const innerInputClasses = cn(
  "h-full w-full border-0 bg-transparent",
  "px-3 text-sm md:text-[15px]",
  "text-foreground placeholder:text-muted-foreground/80",
  "outline-none ring-0 shadow-none",
  "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
  "disabled:cursor-not-allowed",
  "text-start",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent]",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:currentColor]",
  "[&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_transparent]",
  "[&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_transparent]",
);

const plainInputClasses = cn(
  "flex h-12 w-full rounded-2xl border",
  "bg-background/95 backdrop-blur-sm",
  "border-border/70 px-4 py-2",
  "text-sm md:text-[15px]",
  "text-foreground placeholder:text-muted-foreground/80",
  "shadow-sm outline-none ring-0",
  "hover:border-primary/35",
  "focus:border-primary/60 focus:ring-4 focus:ring-primary/10",
  "focus:outline-none focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "text-start",
  sharedTransitionClasses,
);

const iconClasses = cn(
  "shrink-0 text-muted-foreground/80",
  sharedTransitionClasses,
);

// Helpers

function generateStrongPassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "#?!@$%^&*-";
  const all = upper + lower + digits + special;

  const rand = (str: string) => str[Math.floor(Math.random() * str.length)];

  const required = [rand(upper), rand(lower), rand(digits), rand(special)];
  const rest = Array.from({ length: 8 }, () => rand(all));

  const password = [...required, ...rest]
    .sort(() => Math.random() - 0.5)
    .join("");

  return PASSWORD_PATTERN.test(password) ? password : generateStrongPassword();
}

function getPasswordLabels(custom?: InputProps["passwordLabels"]) {
  if (custom) return custom;

  return {
    show: "Show password",
    hide: "Hide password",
  };
}

function getGeneratePasswordText() {
  return "Generate strong password";
}

function getDefaultIcon(type?: string) {
  switch (type) {
    case "search":
      return <Search size={16} strokeWidth={1.75} />;
    case "email":
      return <Mail size={16} strokeWidth={1.75} />;
    case "text":
      return <User size={16} strokeWidth={1.75} />;
    default:
      return null;
  }
}

// Field Wrapper

type FieldWrapperProps = {
  id?: string;
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

function FieldWrapper({
  id,
  label,
  error,
  children,
  className,
}: FieldWrapperProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className={cn(fieldWrapperClasses, className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(labelClasses)}
        >
          {label}
        </label>
      )}

      {children}

      {error && (
        <p id={errorId} className={errorTextClasses}>
          {error}
        </p>
      )}
    </div>
  );
}

// Password Input

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      wrapperClassName,
      disabled,
      passwordLabels,
      onBlur,
      label,
      error,
      mood = "login",
      id: externalId,
      onChange,
      type: _type,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const isMouseDownRef = React.useRef(false);

    const generatedId = React.useId();
    const inputId = externalId ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    const labels = getPasswordLabels(passwordLabels);
    const generatePasswordText = getGeneratePasswordText();

    void _type;

    // Keep focus state stable when clicking action buttons inside the field
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isMouseDownRef.current) {
        setIsFocused(false);
      }

      isMouseDownRef.current = false;
      onBlur?.(e);
    };

    // Generate a strong password and dispatch a native input event
    const handleGenerate = () => {
      const password = generateStrongPassword();
      setShowPassword(true);

      const nativeInput = document.getElementById(
        inputId,
      ) as HTMLInputElement | null;

      if (!nativeInput) return;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;

      nativeInputValueSetter?.call(nativeInput, password);
      nativeInput.dispatchEvent(new Event("input", { bubbles: true }));
    };

    return (
      <FieldWrapper
        id={inputId}
        label={label}
        error={error}
        className={wrapperClassName}
      >
        <div
          className="flex w-full flex-col gap-1"
          onMouseDown={() => {
            isMouseDownRef.current = true;
          }}
        >
          <div className="relative flex w-full items-center">
            <div
              className={cn(
                wrapperBaseClasses,
                "w-full",
                error && wrapperErrorClasses,
                className,
              )}
            >
              <span className={cn(iconClasses, "ps-4")}>
                <Lock size={16} strokeWidth={1.75} />
              </span>

              <input
                {...props}
                id={inputId}
                ref={ref}
                type={showPassword ? "text" : "password"}
                data-slot="input"
                disabled={disabled}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                aria-invalid={!!error}
                aria-describedby={errorId}
                className={cn(innerInputClasses, "px-3 pe-11", inputClassName)}
              />
            </div>

            <button
              type="button"
              disabled={disabled}
              tabIndex={-1}
              aria-controls={inputId}
              aria-label={showPassword ? labels.hide : labels.show}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((prev) => !prev)}
              className={cn(
                "absolute inset-e-3 top-1/2 -translate-y-1/2",
                "inline-flex size-8 items-center justify-center rounded-full",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-accent/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                "disabled:pointer-events-none",
                sharedTransitionClasses,
              )}
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.75} />
              ) : (
                <Eye size={16} strokeWidth={1.75} />
              )}
            </button>
          </div>

          {mood === "create" && (
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isFocused
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={disabled}
                  onClick={handleGenerate}
                  className={cn(
                    "mt-1 inline-flex items-center gap-1.5 rounded-md",
                    "text-xs font-medium text-start",
                    "text-muted-foreground hover:text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                    "disabled:pointer-events-none disabled:opacity-50",
                    sharedTransitionClasses,
                  )}
                >
                  <span className="text-base leading-none">✦</span>
                  <span>{generatePasswordText}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

// Main Input

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      wrapperClassName,
      type = "text",
      disabled,
      startIcon,
      passwordLabels,
      mood,
      label,
      error,
      id: externalId,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = externalId ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    if (type === "password") {
      return (
        <PasswordInput
          ref={ref}
          id={inputId}
          type="password"
          mood={mood}
          disabled={disabled}
          label={label}
          error={error}
          className={className}
          inputClassName={inputClassName}
          wrapperClassName={wrapperClassName}
          passwordLabels={passwordLabels}
          {...props}
        />
      );
    }

    const icon = startIcon ?? getDefaultIcon(type);

    if (icon) {
      return (
        <FieldWrapper
          id={inputId}
          label={label}
          error={error}
          className={wrapperClassName}
        >
          <div
            className={cn(
              wrapperBaseClasses,
              error && wrapperErrorClasses,
              className,
            )}
          >
            <span className={cn(iconClasses, "ps-4")}>{icon}</span>

            <input
              ref={ref}
              id={inputId}
              type={type}
              data-slot="input"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={errorId}
              className={cn(innerInputClasses, "px-3", inputClassName)}
              {...props}
            />
          </div>
        </FieldWrapper>
      );
    }

    return (
      <FieldWrapper
        id={inputId}
        label={label}
        error={error}
        className={wrapperClassName}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          data-slot="input"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            plainInputClasses,
            error && wrapperErrorClasses,
            className,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";

export { Input };
