"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, usePrefersReducedMotion } from "@/frontend/lib/motion";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  /** Stagger direct children instead of animating this element as a single block. */
  stagger?: boolean;
  as?: "section" | "div" | "header";
}

/**
 * Fades a section up into place the first time it enters the viewport.
 * Wrap groups of children with `stagger` and pair with <StaggerItem> for
 * cascaded reveals (e.g. product grids, form fields, footer links).
 */
export function FadeInSection({
  children,
  className,
  stagger = false,
  as = "section",
}: FadeInSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger ? staggerContainer : fadeUp}
    >
      {children}
    </MotionTag>
  );
}

/** Child of a `stagger` FadeInSection — inherits the parent's stagger timing. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
