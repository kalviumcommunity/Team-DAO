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
    const safeProps = { ...props } as Record<string, unknown>;
    delete safeProps.whileHover;
    delete safeProps.whileTap;
    delete safeProps.initial;
    delete safeProps.animate;
    delete safeProps.exit;
    delete safeProps.variants;
    delete safeProps.transition;
    return <button {...(safeProps as React.ComponentPropsWithoutRef<"button">)}>{children as React.ReactNode}</button>;
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
    const safeProps = { ...props } as Record<string, unknown>;
    delete safeProps.whileHover;
    delete safeProps.whileTap;
    delete safeProps.initial;
    delete safeProps.animate;
    delete safeProps.exit;
    delete safeProps.variants;
    delete safeProps.transition;
    return <div className={className} {...(safeProps as React.ComponentPropsWithoutRef<"div">)}>{children as React.ReactNode}</div>;
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
  const altText = props.alt || "Image";
  const srcUrl = typeof props.src === "string" ? props.src : (props.src as unknown as string) || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600";

  if (prefersReducedMotion) {
    const safeProps = { ...props } as Record<string, unknown>;
    delete safeProps.whileHover;
    delete safeProps.whileTap;
    delete safeProps.initial;
    delete safeProps.animate;
    delete safeProps.exit;
    delete safeProps.variants;
    delete safeProps.transition;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={altText} {...(safeProps as React.ComponentPropsWithoutRef<"img">)} src={srcUrl} />;
  }

  return <motion.img alt={altText} {...props} src={srcUrl} />;
}
