import type { ReactNode } from "react";
import { cn } from "@/frontend/lib/cn";

type BadgeVariant = "lime" | "dark" | "outline" | "verified" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  lime: "bg-lime-accent text-on-background",
  dark: "bg-on-surface text-white",
  outline: "border border-on-surface text-on-surface",
  verified: "bg-forest-depth text-white",
  muted: "border border-silver-border text-sage-gray",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

/** Small uppercase pill used for "Trending", "Verified by CAC", "Only 1 left", condition tags, etc. */
export function Badge({ children, variant = "lime", icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[10px] px-3 py-1.5 font-label-caps text-[12px] font-bold uppercase transition-colors duration-200",
        variantClasses[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
