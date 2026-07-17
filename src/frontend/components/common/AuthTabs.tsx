"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

const TABS = ["Login", "Sign up"] as const;
type Tab = (typeof TABS)[number];

export function AuthTabs({ onChange }: { onChange?: (tab: Tab) => void }) {
  const [active, setActive] = useState<Tab>("Login");
  const prefersReducedMotion = usePrefersReducedMotion();

  const select = (tab: Tab) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex w-full rounded-full border border-surface-variant bg-surface-container-low p-1">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => select(tab)}
            className={cn(
              "relative flex-1 rounded-full px-4 py-2 text-center font-body-sm text-stone-charcoal transition-colors",
              !isActive && "hover:bg-surface"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="auth-tab-pill"
                className="absolute inset-0 rounded-full bg-lime-gradient shadow-sm"
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
              />
            )}
            <span className={cn("relative z-10", isActive && "font-medium")}>{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
