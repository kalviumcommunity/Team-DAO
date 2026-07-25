import { Info, ShieldCheck, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/frontend/components/layout/Footer";
import { MobileBottomNav } from "@/frontend/components/layout/MobileBottomNav";
import { VerificationCard } from "@/frontend/components/cac/VerificationCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { VERIFICATION_LISTINGS } from "@/frontend/lib/mock-data";

const pendingCount = VERIFICATION_LISTINGS.filter((l) => l.status === "pending").length;

export default function VerifyPage() {
  return (
    <>
      <header className="sticky top-0 z-50 mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-gutter">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="font-display text-heading-sm font-bold text-stone-charcoal">
            stuCart
          </Link>
        </div>
        <nav className="hidden items-center gap-8 font-body-sm md:flex">
          <Link href="/books" className="text-on-surface-variant transition-colors duration-200 hover:text-primary">
            Books
          </Link>
          <Link href="/product" className="text-on-surface-variant transition-colors duration-200 hover:text-primary">
            Electronics
          </Link>
          <Link href="/stationery" className="text-on-surface-variant transition-colors duration-200 hover:text-primary">
            Stationery
          </Link>
          <Link href="/sell" className="text-on-surface-variant transition-colors duration-200 hover:text-primary">
            Sell
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <ShieldCheck className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-80" />
          <div className="relative flex items-center">
            <UserCircle2 className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-80" />
            <span className="absolute -right-6 -top-2 rounded-[10px] bg-forest-depth px-1.5 py-0.5 text-[10px] font-bold text-white">
              CAC
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-container-margin py-12 md:py-16">
        <FadeInSection as="div" className="mb-10 text-center">
          <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-sage-gray">
            CAMPUS AMBASSADOR
          </p>
          <h1 className="mb-4 font-display text-[48px] font-light leading-[1.1] text-stone-charcoal">
            Pending verifications
          </h1>
          <p className="font-subheading text-subheading text-sage-gray">
            {pendingCount} listings waiting for your review.
          </p>
        </FadeInSection>

        <FadeInSection as="div" className="mb-8 flex items-center gap-3 rounded-squircle bg-warm-mist p-4">
          <Info className="h-5 w-5 text-stone-charcoal" />
          <p className="text-[13px] font-medium text-stone-charcoal">
            Verifying listings earns you CAC reward points.
          </p>
        </FadeInSection>

        <FadeInSection stagger className="space-y-6">
          {VERIFICATION_LISTINGS.map((listing) => (
            <StaggerItem key={listing.id}>
              <VerificationCard listing={listing} />
            </StaggerItem>
          ))}
        </FadeInSection>
      </main>

      <MobileBottomNav />
      <Footer />
    </>
  );
}
