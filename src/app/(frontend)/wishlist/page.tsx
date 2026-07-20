import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { WishlistCard } from "@/frontend/components/product/WishlistCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { WISHLIST_ITEMS } from "@/frontend/lib/mock-data";

export default function WishlistPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-[1200px] flex-grow px-container-margin pb-section-gap pt-[calc(120px)]">
        <FadeInSection as="header" className="mx-auto mb-[60px] max-w-2xl text-center">
          <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-sage-gray">
            SAVED FOR LATER
          </p>
          <h1 className="mb-4 font-display text-[48px] font-light leading-[1.1] text-on-surface">
            Your wishlist
          </h1>
          <p className="font-body-sm text-body-sm text-sage-gray">
            We check stock every 30 seconds so you don&apos;t miss out.
          </p>
        </FadeInSection>

        <FadeInSection stagger className="flex flex-col gap-[30px]">
          {WISHLIST_ITEMS.map((item) => (
            <StaggerItem key={item.id}>
              <WishlistCard item={item} />
            </StaggerItem>
          ))}
        </FadeInSection>
      </main>

      <Footer />
    </>
  );
}
