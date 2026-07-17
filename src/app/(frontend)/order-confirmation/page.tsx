"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/frontend/components/common/Button";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";

const ORDER_ITEM = {
  name: "Linen Blend Overshirt",
  price: "$45.00",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB21Ls8naHIgkVS0lKrzSkQPByLaCa11bcaLJa89LAzcZz6DeEuxlzlcyfBmPPDxIHYcNrcXZernJI24bJybv3wmWxJi8fIQdKRLCYt8Rxii7EsizSYCkfmbYU61CI2iyNjs2n1Wcq7B1WMD9lRr1T8TWgn7LyZEZIuPkW0WrId2bjv3N2YWHjzO-sLI7iNXCbYbex6at-LjBH0JQQFtficYYitgrI3uS5iHXMKRNPaj2wH8EOLyQcoKOLvX6773qPGahk3PXp1-yD6",
  imageAlt: "Folded linen blend overshirt on a light surface",
};

export default function OrderConfirmationPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <main className="flex flex-grow items-center justify-center bg-mint-wash p-container-margin py-section-gap">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-[600px] flex-col items-center rounded-[24px] bg-cream-paper p-[30px] shadow-ambient"
      >
        <motion.div
          initial={prefersReducedMotion ? undefined : { scale: 0 }}
          animate={prefersReducedMotion ? undefined : { scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "backOut" }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#a3fda7]"
        >
          <Check className="h-8 w-8 text-on-background" />
        </motion.div>

        <h1
          className="mb-3 text-center text-on-background"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            fontSize: 40,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          Order placed
        </h1>
        <p className="mb-8 max-w-[400px] text-center font-body-md text-body-md text-sage-gray">
          Your order has been confirmed. The seller will be notified.
        </p>

        <div className="mb-6 w-full rounded-[10px] bg-warm-mist p-4">
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
              <Image src={ORDER_ITEM.image} alt={ORDER_ITEM.imageAlt} fill className="object-cover" />
            </div>
            <div className="flex-grow">
              <p className="text-[14px] text-on-surface">{ORDER_ITEM.name}</p>
            </div>
            <p className="text-[14px] text-on-surface">{ORDER_ITEM.price}</p>
          </div>
          <div className="mb-4 h-px w-full bg-silver-border" />
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-on-surface">Total</p>
            <p className="text-[14px] font-bold text-on-surface">{ORDER_ITEM.price}</p>
          </div>
        </div>

        <p className="mb-8 font-caption text-caption text-sage-gray">Order #ST-10492</p>

        <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
          <Button variant="primary">View order</Button>
          <Button variant="dark">Continue shopping</Button>
        </div>
      </motion.div>
    </main>
  );
}
