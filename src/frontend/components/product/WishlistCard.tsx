"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { WishlistItem } from "@/types";
import { Badge } from "@/frontend/components/common/Badge";
import { Button } from "@/frontend/components/common/Button";
import { IconButton } from "@/frontend/components/common/IconButton";
import { cardHover, usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

const STOCK_LABEL: Record<WishlistItem["stock"], string> = {
  "in-stock": "In stock",
  "low-stock": "Only 1 left",
  "out-of-stock": "Out of Stock",
};

export function WishlistCard({ item, onRemove, onAddToCart }: WishlistCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isOutOfStock = item.stock === "out-of-stock";

  return (
    <motion.div
      initial="rest"
      whileHover={prefersReducedMotion || isOutOfStock ? undefined : "hover"}
      animate="rest"
      variants={cardHover}
      className={cn(
        "flex flex-col items-center gap-6 rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border md:flex-row md:gap-8",
        isOutOfStock && "opacity-75"
      )}
    >
      <div className="flex h-48 w-full flex-shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest p-4 md:w-48">
        <div className="relative h-full w-full">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="192px"
            className={cn(
              "object-contain mix-blend-multiply transition-transform duration-500",
              isOutOfStock && "grayscale opacity-60"
            )}
          />
        </div>
      </div>

      <div className="flex flex-grow flex-col items-center text-center md:items-start md:text-left">
        <h3
          className={cn(
            "mb-2 font-heading-sm text-heading-sm",
            isOutOfStock ? "text-sage-gray" : "text-on-surface"
          )}
        >
          {item.name}
        </h3>
        <p
          className={cn(
            "mb-4 font-body-md text-body-md",
            isOutOfStock ? "text-silver-border" : "text-sage-gray"
          )}
        >
          {item.description}
        </p>

        {item.stock === "low-stock" ? (
          <div className="mb-2">
            <Badge variant="dark">Only 1 left</Badge>
          </div>
        ) : (
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isOutOfStock ? "bg-silver-border" : "bg-primary-container"
              )}
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {STOCK_LABEL[item.stock]}
            </span>
          </div>
        )}

        <p
          className={cn(
            "font-heading text-heading",
            isOutOfStock ? "text-silver-border line-through" : "text-on-surface"
          )}
        >
          {item.price}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4 md:mt-0">
        <Button
          variant="primary"
          disabled={isOutOfStock}
          className={cn("px-6 py-3", isOutOfStock && "bg-warm-mist text-sage-gray")}
          onClick={() => onAddToCart?.(item.id)}
        >
          Add to Cart
        </Button>
        <IconButton
          variant="outline"
          aria-label={`Remove ${item.name} from wishlist`}
          onClick={() => onRemove?.(item.id)}
        >
          <Trash2 className="h-5 w-5" />
        </IconButton>
      </div>
    </motion.div>
  );
}
