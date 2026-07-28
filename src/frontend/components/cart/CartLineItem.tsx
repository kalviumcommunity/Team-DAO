"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { IconButton } from "@/frontend/components/common/IconButton";
import { cardHover, usePrefersReducedMotion } from "@/frontend/lib/motion";

interface CartLineItemProps {
  item: CartItem;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function CartLineItem({ item, onIncrement, onDecrement, onRemove }: CartLineItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const availableStock = item.availableStock ?? 5;
  const isMaxStockReached = item.quantity >= availableStock;
  const isSingleStockAvailable = availableStock === 1;

  // Calculate total price for this line item (unitPrice * quantity)
  const unitPriceValue = Number.parseFloat((item.price || "0").replace(/[^0-9.-]+/g, ""));
  const totalPriceValue = Number.isNaN(unitPriceValue) ? 0 : unitPriceValue * item.quantity;
  const formattedTotalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPriceValue);

  return (
    <motion.div
      initial="rest"
      whileHover={prefersReducedMotion ? undefined : "hover"}
      animate="rest"
      variants={cardHover}
      className="relative flex flex-col items-center gap-6 rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border md:flex-row"
    >
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mint-wash">
        <div className="relative h-full w-full">
          <Image
            src={item.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"}
            alt={item.imageAlt || item.name || "Cart item image"}
            fill
            sizes="96px"
            className="object-cover mix-blend-multiply"
          />
        </div>
      </div>

      <div className="flex-grow text-center md:text-left">
        <h3 className="font-body-md font-medium text-on-surface">{item.name}</h3>
        {item.verified && (
          <p className="mt-1 font-caption text-caption text-sage-gray">Used · Verified by CAC</p>
        )}
        {isMaxStockReached && (
          <p className="mt-1.5 font-caption text-xs font-semibold text-amber-700 bg-amber-50 rounded-full px-2.5 py-0.5 inline-block border border-amber-200/60">
            {isSingleStockAvailable
              ? "Only 1 available in stock"
              : `Maximum available stock reached (${availableStock})`}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center rounded-full border border-silver-border px-2 py-1">
          <IconButton
            size="sm"
            variant="plain"
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => onDecrement?.(item.id)}
          >
            <Minus className="h-[18px] w-[18px]" />
          </IconButton>
          <span className="w-8 text-center font-body-sm text-body-sm font-semibold">{item.quantity}</span>
          <IconButton
            size="sm"
            variant="plain"
            disabled={isMaxStockReached}
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => !isMaxStockReached && onIncrement?.(item.id)}
            className={
              isMaxStockReached
                ? "opacity-30 cursor-not-allowed pointer-events-none font-normal"
                : ""
            }
          >
            <Plus className={`h-[18px] w-[18px] ${isMaxStockReached ? "opacity-30 stroke-1" : ""}`} />
          </IconButton>
        </div>
      </div>

      <div className="flex min-w-[110px] flex-shrink-0 flex-col items-end gap-1 text-right">
        <span className="font-body-md font-bold text-on-surface">{formattedTotalPrice}</span>
        {item.quantity > 1 && (
          <span className="font-caption text-xs text-sage-gray">({item.price} each)</span>
        )}
        <IconButton
          size="sm"
          variant="danger-hover"
          aria-label={`Remove ${item.name} from cart`}
          onClick={() => onRemove?.(item.id)}
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </IconButton>
      </div>
    </motion.div>
  );
}
