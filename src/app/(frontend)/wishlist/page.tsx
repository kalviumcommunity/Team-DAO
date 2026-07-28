"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Heart, X } from "lucide-react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { Button } from "@/frontend/components/common/Button";
import { WishlistCard } from "@/frontend/components/product/WishlistCard";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";
import {
  addToCartItem,
  getAuthToken,
  getWishlistItems,
  pollWishlistStockStatus,
  removeWishlistItem,
  saveLocalWishlist,
} from "@/frontend/lib/api";
import type { WishlistItem } from "@/types";

interface ToastNotification {
  type: "success" | "error";
  message: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const isUnauthenticated = !getAuthToken() || error === "Unauthorized";

  // Initial Wishlist Fetching
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

  // 30-Second Stock Polling Hook (Active Wishlist Items Only)
  useEffect(() => {
    if (!items || items.length === 0) return;

    const intervalId = setInterval(async () => {
      try {
        const updated = await pollWishlistStockStatus(items);
        setItems(updated);
      } catch {
        // Silent polling handling
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [items]);

  const handleRemove = async (id: string) => {
    const targetItem = items.find((i) => i.id === id);
    const previousItems = [...items];
    setItems((current) => current.filter((item) => item.id !== id));

    try {
      await removeWishlistItem(id);
      setToast({
        type: "success",
        message: `"${targetItem?.name || "Item"}" removed from wishlist.`,
      });
    } catch (err) {
      setItems(previousItems);
      saveLocalWishlist(previousItems);
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Unable to remove item from wishlist.",
      });
    }
  };

  // Optimistic Move-to-Cart Flow & Out-of-Stock Validation
  const handleMoveToCart = async (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    // Requirement 4: Out-of-Stock Pre-Validation
    if (targetItem.stock === "out-of-stock" || targetItem.availableStock === 0) {
      setToast({
        type: "error",
        message: "This item is out of stock and cannot be added to your cart.",
      });
      return;
    }

    // Requirement 3: Optimistic Removal from Wishlist
    const previousItems = [...items];
    setItems((current) => current.filter((item) => item.id !== id));

    try {
      await addToCartItem(id, 1, targetItem);
      await removeWishlistItem(id);
      setToast({
        type: "success",
        message: `"${targetItem.name}" moved to cart successfully!`,
      });
    } catch (err) {
      // Rollback state on error
      setItems(previousItems);
      saveLocalWishlist(previousItems);
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to move item to cart. Restored to wishlist.",
      });
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

        {/* Toast Notification Banner */}
        {toast && (
          <div
            className={`mx-auto mb-6 flex max-w-2xl items-center justify-between rounded-2xl border px-4 py-3 shadow-sm transition-all duration-300 ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              <span className="font-body-sm text-sm font-medium">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-full p-1 transition-colors hover:bg-black/5 cursor-pointer"
            >
              <X className="h-4 w-4 opacity-70" />
            </button>
          </div>
        )}

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

            <div className="flex flex-col gap-[30px]">
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
                  <div key={item.id}>
                    <WishlistCard
                      item={item}
                      onRemove={handleRemove}
                      onAddToCart={handleMoveToCart}
                    />
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
