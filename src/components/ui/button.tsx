import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

const buttonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "cursor-pointer select-none",

    // Shape
    "rounded-2xl font-semibold",

    // Transition
    "transition-all duration-200 ease-out",

    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",

    // Disabled
    "disabled:pointer-events-none disabled:opacity-50",

    // Active
    "active:scale-[0.97]",

    // Icons
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:bg-primary/90 hover:shadow-md",
          "dark:hover:bg-primary/80",
        ),

        destructive: cn(
          "bg-destructive text-white",
          "shadow-sm",
          "hover:bg-destructive/90 hover:shadow-md",
        ),

        outline: cn(
          "border border-border bg-background",
          "text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
        ),

        secondary: cn(
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
        ),

        ghost: cn("text-primary bg-transparent", "hover:bg-primary/10"),

        link: cn(
          "text-primary underline-offset-4",
          "hover:underline hover:text-primary/80",
        ),
      },

      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-3 text-xs rounded-lg",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Types
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: () => React.ReactNode;
  serverError?: string;
}

// Server Error UI

function ServerError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2",
        "rounded-xl px-4 py-3 text-sm font-medium",
        "border border-destructive/30 bg-destructive/10 text-destructive",
        "animate-in fade-in slide-in-from-top-1 duration-200",
      )}
    >
      <TriangleAlert className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// Button

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    icon,
    isLoading,
    children,
    disabled,
    serverError,
    type = "button",
    ...props
  },
  ref,
) {
  const renderIcon = () => {
    if (isLoading) {
      return <LoaderCircle className="size-4 animate-spin opacity-80" />;
    }

    if (icon) {
      return (
        <span
          className={cn(
            "absolute inset-e-2 top-1/2 -translate-y-1/2",
            "flex items-center justify-center",
            "size-7 rounded-full",
            "bg-background/80 backdrop-blur",
            "border border-border",
            "transition-all duration-200",
            "group-hover:scale-110",
          )}
        >
          {icon()}
        </span>
      );
    }

    return null;
  };

  const buttonContent = (
    <>
      <span
        className={cn("flex items-center justify-center gap-2", icon && "pe-6")}
      >
        {children}
      </span>

      {renderIcon()}
    </>
  );

  //Submit variant with error
  if (type === "submit") {
    return (
      <div className="flex w-full flex-col gap-2">
        <button
          ref={ref}
          type="submit"
          disabled={isLoading || disabled}
          className={cn(
            "group w-full",
            buttonVariants({ variant, size }),
            className,
          )}
          {...props}
        >
          {buttonContent}
        </button>

        {serverError && <ServerError message={serverError} />}
      </div>
    );
  }

  // ─── Default button ───
  return (
    <button
      ref={ref}
      type={type}
      disabled={isLoading || disabled}
      className={cn("group", buttonVariants({ variant, size }), className)}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
