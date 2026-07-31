"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { ListingForm } from "@/frontend/components/common/ListingForm";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";
import { apiRequest, getLocalSellerListings, saveLocalSellerListings } from "@/frontend/lib/api";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/frontend/components/common/Button";

export default function SellPage() {
  const [createdListing, setCreatedListing] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      setError(null);

      let createdItem: any = null;
      try {
        const res = await apiRequest<{ listing: any }>("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        createdItem = res.listing;
      } catch {
        // Fallback local listing item
        createdItem = {
          id: `seller-item-${Date.now()}`,
          title: payload.title || "Listed Item",
          description: payload.description || "",
          price: Number(payload.price) || 0,
          condition: payload.condition || "GOOD",
          category: payload.category || "Books",
          stock: Number(payload.stock) || 1,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          buyers: [],
        };
      }

      // Add to local seller listings
      if (createdItem) {
        const currentLocal = getLocalSellerListings();
        const formattedLocal = {
          id: createdItem.id,
          title: createdItem.title || payload.title,
          description: createdItem.description || payload.description,
          price: typeof createdItem.price === "number" ? createdItem.price : parseFloat(createdItem.price || payload.price || "0"),
          condition: String(createdItem.condition || payload.condition || "GOOD"),
          category: String(createdItem.category || payload.category || "Books"),
          stock: typeof createdItem.stock === "number" ? createdItem.stock : Number(payload.stock || 1),
          status: createdItem.status || "ACTIVE",
          createdAt: createdItem.createdAt || new Date().toISOString(),
          buyers: [],
        };
        saveLocalSellerListings([formattedLocal, ...currentLocal]);
      }

      setCreatedListing(createdItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit listing.");
    } finally {
      setSubmitting(false);
    }
  };

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

        {error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        ) : null}

        {createdListing ? (
          <FadeInSection className="flex flex-col items-center rounded-3xl border border-primary/20 bg-primary-container/30 p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-background shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-stone-charcoal animate-pulse" />
              <h2 className="font-display text-2xl font-normal text-stone-charcoal">
                Seller Dashboard Unlocked!
              </h2>
            </div>

            <p className="mb-6 max-w-md font-body-sm text-sm text-sage-gray">
              Your item <strong className="text-stone-charcoal font-semibold">&quot;{createdListing.title}&quot;</strong> has been listed successfully. You can now manage prices, control stock quantity, track orders, and view prospective buyers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link href="/sell/manage" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-background py-3.5 px-6 rounded-full font-medium"
                >
                  Go to Seller Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => setCreatedListing(null)}
                className="w-full sm:w-auto font-body-sm text-sm font-medium text-sage-gray hover:text-stone-charcoal transition-colors px-4 py-3"
              >
                List another item
              </button>
            </div>
          </FadeInSection>
        ) : (
          <ListingForm onSubmit={handleSubmit} submitting={submitting} />
        )}
      </main>

      <Footer />
    </>
  );
}
