"use client";

import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

/** Tracks the user's `prefers-reduced-motion` setting reactively. */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}

/** Fade + rise used for section-level scroll reveals. Duration stays in the 0.4–0.8s band. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Slightly shorter fade for smaller elements (badges, icons, inline text). */
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Parent wrapper that staggers its direct children's `fadeUp`/`fadeIn` variants. */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Hero-specific stagger: slightly slower cadence so headline > subtext > CTAs read sequentially. */
export const heroStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Gentle up/down float loop for hero imagery. */
export const floatLoop = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Card hover lift, shared by product/wishlist/verification cards. */
export const cardHover = {
  rest: { y: 0, boxShadow: "rgba(0,0,0,0.09) 0px 0px 28px 0px" },
  hover: {
    y: -6,
    boxShadow: "rgba(0,0,0,0.16) 0px 12px 36px 0px",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};
