"use client";

import type { HTMLMotionProps } from "framer-motion";
import { MotionButton } from "@/frontend/components/motion";
import type { ElementType, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

type ButtonVariant = "primary" | "dark" | "outline" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  /** Render as a different element, e.g. Next.js `Link`, while keeping the same styling. */
  as?: ElementType;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-lime-gradient text-on-background hover:opacity-90",
  dark: "bg-stone-charcoal text-white hover:bg-opacity-90",
  outline: "bg-transparent border border-on-surface text-on-surface hover:bg-surface-container-low",
  ghost: "bg-transparent text-primary hover:bg-primary-container/10",
};

/**
 * Shared CTA button. Adds a subtle lift + scale on hover, an icon slide when
 * an `icon` is supplied, and a pressed (scale-down) state on click — all
 * skipped automatically when the user prefers reduced motion.
 */
export function Button({
  variant = "primary",
  icon,
  as: Component = MotionButton,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: disabled ? undefined : { y: -2, scale: 1.02 },
        whileTap: disabled ? undefined : { scale: 0.97 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

  return (
    <Component
      className={cn(
        "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 py-4 font-body-md font-medium transition-colors duration-200",
        variantClasses[variant],
        fullWidth && "w-full",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      disabled={disabled}
      {...motionProps}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <span className="inline-flex transition-transform duration-200 ease-out group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </Component>
  );
}
