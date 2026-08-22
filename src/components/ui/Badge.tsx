import type { ReactNode } from "react";

type BadgeVariant = "gold" | "green" | "red" | "orange" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:   "badge-gold",
  green:  "badge-green",
  red:    "badge-red",
  orange: "badge-orange",
  gray:   "badge-gray",
};

export default function Badge({
  variant = "gold",
  children,
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {dot && (
        <span
          className={[
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "gold"   ? "bg-gold-400"  : "",
            variant === "green"  ? "bg-green-400"  : "",
            variant === "red"    ? "bg-red-400"    : "",
            variant === "orange" ? "bg-amber-400"  : "",
            variant === "gray"   ? "bg-gray-400"   : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}
      {children}
    </span>
  );
}
