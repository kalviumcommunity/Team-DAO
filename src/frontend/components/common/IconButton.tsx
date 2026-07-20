"use client";

import type { HTMLMotionProps } from "framer-motion";
import { MotionButton } from "@/frontend/components/motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "outline" | "plain" | "danger-hover";
  size?: "sm" | "md";
}

const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10 md:w-12 md:h-12" };

const variantClasses = {
  outline: "border border-silver-border text-on-surface hover:bg-surface-container-low",
  plain: "text-on-surface hover:bg-surface-container-low",
  "danger-hover":
    "text-sage-gray hover:text-error border border-transparent hover:border-error hover:bg-error-container",
};

/** Circular icon-only button used for wishlist hearts, delete actions, and qty steppers. */
export function IconButton({
  children,
  variant = "outline",
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionButton
      type="button"
      whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors duration-200",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
