"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface SegmentedControlProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function SegmentedControl({ options, defaultValue, onChange }: SegmentedControlProps) {
  const [active, setActive] = useState(defaultValue ?? options[0]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const select = (option: string) => {
    setActive(option);
    onChange?.(option);
  };

  return (
    <div className="flex rounded-full border border-silver-border bg-cream-paper p-1">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => select(option)}
            className={cn(
              "relative flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
              isActive ? "text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="segmented-control-pill"
                className="absolute inset-0 rounded-full bg-lime-gradient shadow-sm"
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
