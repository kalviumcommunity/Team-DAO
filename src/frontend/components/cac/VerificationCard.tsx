"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { VerificationListing } from "@/types";
import { Button } from "@/frontend/components/common/Button";
import { cardHover, usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

export function VerificationCard({ listing }: { listing: VerificationListing }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVerified = listing.status === "verified";

  return (
    <motion.div
      initial="rest"
      whileHover={prefersReducedMotion || isVerified ? undefined : "hover"}
      animate="rest"
      variants={cardHover}
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 md:flex-row",
        isVerified ? "opacity-75" : "hover:border-eucalyptus/30"
      )}
    >
      <div className="h-[140px] w-full shrink-0 overflow-hidden rounded-xl bg-surface-container md:w-[140px]">
        <div className="relative h-full w-full">
          <Image
            src={listing.image}
            alt={listing.imageAlt}
            fill
            sizes="140px"
            className={cn("object-cover", isVerified && "grayscale-[20%]")}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-heading-sm text-heading-sm text-stone-charcoal">{listing.name}</h3>
            <span
              className={cn(
                "hidden rounded-squircle px-2 py-1 text-[11px] font-bold uppercase md:inline-block",
                isVerified ? "bg-forest-depth text-white" : "border border-silver-border text-sage-gray"
              )}
            >
              {isVerified ? "Verified" : "Pending"}
            </span>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-silver-border px-2 py-0.5 text-[11px] font-medium text-stone-charcoal">
              {listing.condition}
            </span>
          </div>
          <p className="mb-4 line-clamp-2 font-body-sm text-body-sm text-sage-gray">
            {listing.description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-surface-dim">
            <div className="relative h-full w-full">
              <Image src={listing.seller.avatar} alt={listing.seller.avatarAlt} fill className="object-cover" />
            </div>
          </div>
          <span className="font-body-sm text-body-sm font-medium text-stone-charcoal">
            {listing.seller.name}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-row items-end justify-end gap-3 border-t border-silver-border/30 pt-4 md:mt-0 md:w-[120px] md:flex-col md:border-t-0 md:pt-0">
        <span
          className={cn(
            "mr-auto rounded-squircle px-2 py-1 text-[11px] font-bold uppercase md:hidden",
            isVerified ? "bg-forest-depth text-white" : "border border-silver-border text-sage-gray"
          )}
        >
          {isVerified ? "Verified" : "Pending"}
        </span>

        {isVerified ? (
          <Button variant="primary" disabled fullWidth className="cursor-not-allowed bg-warm-mist text-sage-gray">
            Reviewed
          </Button>
        ) : (
          <>
            <Button variant="primary" fullWidth className="py-2 text-[14px]">
              Verify
            </Button>
            <Button variant="outline" fullWidth className="border-eucalyptus py-2 text-[14px]">
              Reject
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
