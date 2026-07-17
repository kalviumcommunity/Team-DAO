"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/frontend/components/common/Badge";
import { Button } from "@/frontend/components/common/Button";
import { cardHover, usePrefersReducedMotion } from "@/frontend/lib/motion";

interface ProductCardProps {
  product: Product;
  /** "hero" matches the large home-page grid card; "compact" matches the browse-page card. */
  layout?: "hero" | "compact";
}

/** Reusable product tile: hover lift + border transition + image zoom, used on Home and Browse. */
export function ProductCard({ product, layout = "hero" }: ProductCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isHero = layout === "hero";

  return (
    <motion.article
      initial="rest"
      whileHover={prefersReducedMotion ? undefined : "hover"}
      animate="rest"
      variants={cardHover}
      className={
        isHero
          ? "group relative flex h-[400px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border"
          : "group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border"
      }
    >
      {product.trending && (
        <div className="absolute left-card-padding top-card-padding z-10">
          <Badge variant="lime">Trending</Badge>
        </div>
      )}

      <div
        className={
          isHero
            ? "relative mb-6 flex h-[200px] w-full flex-grow items-center justify-center overflow-hidden"
            : "relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low"
        }
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain mix-blend-multiply opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {isHero ? (
        <div className="mt-auto flex flex-col gap-1">
          <h3 className="truncate font-body-md font-medium text-on-surface">{product.name}</h3>
          <p className="font-body-sm text-on-surface">{product.price}</p>
        </div>
      ) : (
        <div className="flex flex-grow flex-col">
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3 className="line-clamp-2 font-body-md font-medium text-stone-charcoal">
              {product.name}
            </h3>
            {product.condition && (
              <Badge variant="outline" className="mt-1 shrink-0 rounded px-2 py-0.5 text-[10px]">
                {product.condition}
              </Badge>
            )}
          </div>
          <p className="mb-6 font-body-sm text-sage-gray">
            {product.price}
            {product.originalPrice && (
              <span className="ml-2 text-surface-dim line-through">{product.originalPrice}</span>
            )}
          </p>
          <div className="mt-auto flex gap-3">
            <Button variant="primary" className="flex-1 px-0 py-2.5 text-[14px]">
              Add
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full !p-0"
              aria-label={`Add ${product.name} to wishlist`}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </motion.article>
  );
}
