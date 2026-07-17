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
            src={item.image}
            alt={item.imageAlt}
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
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-silver-border px-2 py-1">
          <IconButton
            size="sm"
            variant="plain"
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => onDecrement?.(item.id)}
          >
            <Minus className="h-[18px] w-[18px]" />
          </IconButton>
          <span className="w-8 text-center font-body-sm text-body-sm">{item.quantity}</span>
          <IconButton
            size="sm"
            variant="plain"
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => onIncrement?.(item.id)}
          >
            <Plus className="h-[18px] w-[18px]" />
          </IconButton>
        </div>
      </div>

      <div className="flex min-w-[100px] flex-shrink-0 flex-col items-end gap-2 text-right">
        <span className="font-body-md font-bold text-on-surface">{item.price}</span>
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
