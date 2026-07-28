"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { Button } from "@/frontend/components/common/Button";
import { WishlistCard } from "@/frontend/components/product/WishlistCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { addToCartItem, getAuthToken, getWishlistItems, removeWishlistItem } from "@/frontend/lib/api";
import type { WishlistItem } from "@/types";

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isUnauthenticated = !getAuthToken() || error === "Unauthorized";

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      if (!getAuthToken()) {
        setLoading(false);
        setError("Unauthorized");
        return;
      }

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

        {isUnauthenticated ? (
          <div className="mx-auto max-w-md rounded-2xl border border-silver-border bg-cream-paper p-8 text-center shadow-xs">
            <Heart className="mx-auto mb-4 h-12 w-12 text-primary opacity-70" />
            <h2 className="mb-2 font-display text-2xl font-light text-on-surface">
              Log in to see the wishlist
            </h2>
            <p className="mb-6 font-body-sm text-sage-gray">
              Please sign in or create an account to view and manage your saved items.
            </p>
            <Button variant="primary" className="w-full" onClick={() => router.push("/login")}>
              Log in
            </Button>
          </div>
        ) : (
          <>
            {error && error !== "Unauthorized" ? (
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
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
