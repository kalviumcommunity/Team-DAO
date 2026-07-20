import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { ListingForm } from "@/frontend/components/common/ListingForm";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";

export default function SellPage() {
  return (
    <>
      <Navbar activeHref="/sell" />

      <main className="mx-auto flex max-w-3xl flex-col gap-12 px-container-margin py-16 pt-[calc(72px+2rem)]">
        <FadeInSection as="header" className="flex flex-col items-center gap-4 text-center">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            BECOME A SELLER
          </span>
          <h1 className="font-display text-[48px] font-light leading-tight text-on-surface">
            List an item
          </h1>
          <p className="mx-auto max-w-md font-body-sm text-body-sm text-on-surface-variant">
            Sell it, or exchange it for something you need.
          </p>
        </FadeInSection>

        <ListingForm />
      </main>

      <Footer />
    </>
  );
}
