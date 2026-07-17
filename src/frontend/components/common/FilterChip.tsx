"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
}

export function FilterChip({ label, active = false, onRemove }: FilterChipProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 font-body-sm text-[13px] font-medium transition-colors",
        active
          ? "bg-primary-container text-on-background"
          : "border border-stone-charcoal text-stone-charcoal hover:bg-surface-container-low"
      )}
    >
      {label}
      {active && onRemove && <X className="h-4 w-4" onClick={onRemove} />}
    </motion.button>
  );
}
