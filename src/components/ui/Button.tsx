"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "gold" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  gold: "btn-gold",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "gold",
      size = "md",
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "btn",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}

        {children}

        {!loading && iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
