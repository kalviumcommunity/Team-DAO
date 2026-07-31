"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function FilterChip({ label, active = false, onClick, onRemove, className }: FilterChipProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 font-body-sm text-[13px] font-medium transition-colors cursor-pointer select-none",
        active
          ? "bg-primary-container text-on-background shadow-xs"
          : "border border-stone-charcoal/40 text-stone-charcoal hover:border-stone-charcoal hover:bg-surface-container-low",
        className
      )}
    >
      <span>{label}</span>
      {active && onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove filter"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      )}
    </motion.button>
  );
}
