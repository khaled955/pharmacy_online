import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "cursor-pointer select-none",
    "rounded-2xl font-semibold",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
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

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: () => React.ReactNode;
  serverError?: string;
}

function ServerError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "mt-2 flex items-center gap-2",
        "rounded-xl px-4 py-3 text-sm font-medium",
        "border border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      <TriangleAlert className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    icon,
    isLoading = false,
    children,
    disabled,
    serverError,
    type = "button",
    asChild = false,
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
            "flex size-7 items-center justify-center rounded-full",
            "border border-border bg-background/80 backdrop-blur",
            "transition-all duration-200 group-hover:scale-110",
          )}
        >
          {icon()}
        </span>
      );
    }

    return null;
  };

  const content = (
    <>
      <span
        className={cn("flex items-center justify-center gap-2", icon && "pe-6")}
      >
        {children}
      </span>

      {renderIcon()}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      className?: string;
      disabled?: boolean;
    }>;

    return (
      <>
        {React.cloneElement(child, {
          ...props,
          className: cn(
            "group",
            buttonVariants({ variant, size }),
            className,
            child.props.className,
          ),
        })}

        {serverError ? <ServerError message={serverError} /> : null}
      </>
    );
  }

  return (
    <>
      <button
        ref={ref}
        type={type}
        disabled={isLoading || disabled}
        className={cn(
          "group",
          type === "submit" && "w-full",
          buttonVariants({ variant, size }),
          className,
        )}
        {...props}
      >
        {content}
      </button>

      {serverError ? <ServerError message={serverError} /> : null}
    </>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
