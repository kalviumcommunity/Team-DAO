"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, UserCircle2, LogOut } from "lucide-react";
import { Button } from "@/frontend/components/common/Button";
import { cn } from "@/frontend/lib/cn";
import { clearAuthToken, getAuthToken, getCurrentUser } from "@/frontend/lib/api";

export interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Books", href: "/books" },
  { label: "Electronics", href: "/electronics" },
  { label: "Stationery", href: "/stationery" },
  { label: "Sell", href: "/sell" },
];

interface NavbarProps {
  links?: NavLink[];
  activeHref?: string;
  /** Suppress the desktop link cluster for linear/transactional screens (checkout success, login). */
  minimal?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  role?: string;
}

/**
 * Top navigation shared by every page. Starts transparent (so it sits over
 * hero imagery), gains a blurred background once the page scrolls, and
 * hides itself on scroll-down / reveals on scroll-up like Vercel/Linear.
 */
export function Navbar({ links = DEFAULT_LINKS, activeHref, minimal = false }: NavbarProps) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (token) {
        setIsAuthenticated(true);
        getCurrentUser()
          .then((res) => {
            if (res?.user) {
              setUser(res.user);
            }
          })
          .catch(() => {
            clearAuthToken();
            setIsAuthenticated(false);
            setUser(null);
          });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

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
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex-shrink-0 font-display text-heading-sm text-on-surface">
            stuCart
          </Link>
        </div>

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

        <div className="flex flex-1 flex-shrink-0 items-center justify-end gap-4">
          {!minimal && (
            <>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden text-on-surface transition-transform duration-150 hover:scale-110 hover:text-primary sm:block"
              >
                <Heart className="h-6 w-6" />
              </Link>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="User profile"
                    className="flex items-center gap-2 rounded-full border border-silver-border bg-cream-paper p-1.5 text-on-surface shadow-xs transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  >
                    <UserCircle2 className="h-7 w-7 text-primary" />
                    {user?.name && (
                      <span className="hidden text-sm font-medium md:inline-block max-w-[120px] truncate pr-1">
                        {user.name}
                      </span>
                    )}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-silver-border bg-cream-paper p-3 shadow-lg z-50">
                      {user && (
                        <div className="border-b border-silver-border pb-2 mb-2 px-2">
                          <p className="font-subheading text-sm font-bold text-on-surface">{user.name}</p>
                          <p className="font-body-sm text-xs text-sage-gray truncate">{user.email}</p>
                          {user.college && (
                            <p className="font-body-sm text-xs text-sage-gray/80 truncate">{user.college}</p>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          clearAuthToken();
                          setIsAuthenticated(false);
                          setUser(null);
                          setMenuOpen(false);
                          router.push("/");
                          router.refresh();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-error transition-colors hover:bg-error-container/20 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden font-subheading text-subheading text-primary transition-colors duration-200 hover:opacity-80 sm:block"
                  >
                    Sign in
                  </Link>
                  <Button 
                    variant="primary" 
                    className="px-6 py-2 text-body-md"
                    onClick={() => router.push('/signup')}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </>
          )}
          {minimal && <UserCircle2 className="h-7 w-7 text-on-surface" />}
        </div>
      </div>
    </motion.header>
  );
}
