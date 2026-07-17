"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { staggerContainer, usePrefersReducedMotion, cardHover, floatLoop } from "@/frontend/lib/motion";

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  if (prefersReducedMotion) {
    const { whileHover, whileTap, initial, animate, exit, variants, transition, ...rest } = props as any;
    return <button {...rest}>{children}</button>;
  }

  return (
    <motion.button {...props}>
      {children}
    </motion.button>
  );
}

export function HoverCard({ children, className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    const { whileHover, whileTap, initial, animate, exit, variants, transition, ...rest } = props as any;
    return <div className={className} {...rest}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Floating({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} animate={floatLoop.animate}>
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionImage(props: ComponentPropsWithoutRef<typeof motion.img>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    const { whileHover, whileTap, initial, animate, exit, variants, transition, ...rest } = props as any;
    return <img {...rest} />;
  }

  return <motion.img {...props} />;
}
