import Link from "next/link";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";

const FOOTER_LINKS = ["About", "Terms", "Privacy", "Support", "Careers"];

/** Shared footer used across all marketing and transactional pages. */
export function Footer() {
  return (
    <FadeInSection as="div" className="mt-auto w-full">
      <footer className="w-full border-t border-silver-border bg-surface-container-high py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-container-margin md:flex-row">
          <Link href="/" className="font-display text-heading-sm text-on-surface">
            stuCart
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 font-caption text-caption">
            {FOOTER_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="text-on-surface-variant underline opacity-80 transition-all hover:text-primary hover:opacity-100"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="font-caption text-caption text-on-surface">
            © 2024 stuCart Editorial. All rights reserved.
          </div>
        </div>
      </footer>
    </FadeInSection>
  );
}
