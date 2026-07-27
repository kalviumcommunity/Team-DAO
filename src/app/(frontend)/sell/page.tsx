"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { ListingForm } from "@/frontend/components/common/ListingForm";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";
import { apiRequest } from "@/frontend/lib/api";

export default function SellPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess("Listing submitted successfully.");
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
          <p className="rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-surface">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-2xl border border-success/20 bg-success-container/40 px-4 py-3 text-sm text-on-surface">
            {success}
          </p>
        ) : null}

        <ListingForm onSubmit={handleSubmit} submitting={submitting} />
      </main>

      <Footer />
    </>
  );
}
