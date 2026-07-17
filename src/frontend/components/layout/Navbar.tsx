"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, UserCircle2 } from "lucide-react";
import { Button } from "@/frontend/components/common/Button";
import { cn } from "@/frontend/lib/cn";

export interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Books", href: "/books" },
  { label: "Electronics", href: "/product" },
  { label: "Stationery", href: "#" },
  { label: "Sell", href: "/sell" },
  { label: "Exchange", href: "#" },
];

interface NavbarProps {
  links?: NavLink[];
  activeHref?: string;
  /** Suppress the desktop link cluster for linear/transactional screens (checkout success, login). */
  minimal?: boolean;
}

/**
 * Top navigation shared by every page. Starts transparent (so it sits over
 * hero imagery), gains a blurred background once the page scrolls, and
 * hides itself on scroll-down / reveals on scroll-up like Vercel/Linear.
 */
export function Navbar({ links = DEFAULT_LINKS, activeHref, minimal = false }: NavbarProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
    setScrolled(latest > 24);
  });

  return (
    <motion.header
      animate={{ y: hidden ? -88 : 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "bg-mint-wash/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-container-margin">
        <Link href="/" className="flex-shrink-0 font-display text-heading-sm text-on-surface">
          stuCart
        </Link>

        {!minimal && (
          <nav className="hidden items-center gap-8 font-body-sm md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "transition-colors duration-200",
                  activeHref === link.href
                    ? "border-b-2 border-primary pb-1 font-bold text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-shrink-0 items-center gap-4">
          {!minimal && (
            <>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden text-on-surface transition-transform duration-150 hover:scale-110 hover:text-primary sm:block"
              >
                <Heart className="h-6 w-6" />
              </Link>
              <Link
                href="/login"
                className="hidden font-subheading text-subheading text-primary transition-colors duration-200 hover:opacity-80 sm:block"
              >
                Sign in
              </Link>
              <Button variant="primary" className="px-6 py-2 text-body-md">
                Join Now
              </Button>
            </>
          )}
          {minimal && <UserCircle2 className="h-7 w-7 text-on-surface" />}
        </div>
      </div>
    </motion.header>
  );
}
