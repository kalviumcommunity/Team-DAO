"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { WishlistCard } from "@/frontend/components/product/WishlistCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { addToCartItem, getWishlistItems, removeWishlistItem } from "@/frontend/lib/api";
import type { WishlistItem } from "@/types";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      try {
        setLoading(true);
        setError(null);
        const wishlistItems = await getWishlistItems();
        if (isMounted) {
          setItems(wishlistItems);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load your wishlist.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await removeWishlistItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove item from wishlist.");
    }
  };

  const handleAddToCart = async (id: string) => {
    try {
      await addToCartItem(id, 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add item to cart.");
    }
  };

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

        {error ? (
          <p className="mb-6 rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-surface">
            {error}
          </p>
        ) : null}

        <FadeInSection stagger className="flex flex-col gap-[30px]">
          {loading ? (
            <p className="rounded-2xl border border-silver-border bg-cream-paper px-4 py-6 text-center text-sage-gray">
              Loading your wishlist...
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-2xl border border-silver-border bg-cream-paper px-4 py-6 text-center text-sage-gray">
              Your wishlist is empty right now.
            </p>
          ) : (
            items.map((item) => (
              <StaggerItem key={item.id}>
                <WishlistCard item={item} onRemove={handleRemove} onAddToCart={handleAddToCart} />
              </StaggerItem>
            ))
          )}
        </FadeInSection>
      </main>

      <Footer />
    </>
  );
}
