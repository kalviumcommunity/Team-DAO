"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/frontend/components/common/Badge";
import { Button } from "@/frontend/components/common/Button";
import { addToCartItem, addToWishlistItem, getAuthToken, getLocalCart, getLocalWishlist } from "@/frontend/lib/api";
import { cardHover, usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface ProductCardProps {
  product: Product;
  /** "hero" matches the large home-page grid card; "compact" matches the browse-page card. */
  layout?: "hero" | "compact";
}

/** Reusable product tile: hover lift + border transition + image zoom, used on Home and Browse. */
export function ProductCard({ product, layout = "hero" }: ProductCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const router = useRouter();
  const isHero = layout === "hero";
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const isOutOfStock =
    product.availableStock === 0 ||
    (product as any).stock === "out-of-stock" ||
    (product as any).stock === 0 ||
    product.status === "SOLD" ||
    product.status === "DEACTIVATED";

  useEffect(() => {
    const cart = getLocalCart();
    setIsInCart(cart.some((i) => i.id === product.id || i.name === product.name));
    const wishlist = getLocalWishlist();
    setIsWishlisted(wishlist.some((i) => i.id === product.id || i.name === product.name));
  }, [product.id, product.name]);

  const handleOpenDetail = () => {
    router.push(`/product?id=${product.id}`);
  };

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isOutOfStock) return;

    if (isInCart) {
      router.push("/cart");
      return;
    }

    setFeedback("Adding to cart...");

    try {
      await addToCartItem(product.id, 1, product);
      setIsInCart(true);
      setFeedback("Added to cart");
    } catch {
      setIsInCart(true);
      setFeedback("Added to cart");
    }
  };

  const handleAddToWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!getAuthToken()) {
      setFeedback("Log in to see the wishlist");
      return;
    }

    setFeedback("Adding to wishlist...");

    try {
      await addToWishlistItem(product.id, product);
      setIsWishlisted(true);
      setFeedback("Added to wishlist");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Unauthorized") {
        setFeedback("Log in to see the wishlist");
      } else {
        setIsWishlisted(true);
        setFeedback("Added to wishlist");
      }
    }
  };

  return (
    <motion.article
      initial="rest"
      whileHover={prefersReducedMotion ? undefined : "hover"}
      animate="rest"
      variants={cardHover}
      onClick={handleOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenDetail();
        }
      }}
      role="button"
      tabIndex={0}
      className={
        isHero
          ? "group relative flex h-[400px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border"
          : "group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-transparent bg-cream-paper p-card-padding shadow-ambient transition-colors duration-300 hover:border-silver-border"
      }
    >
      {isOutOfStock ? (
        <div className="absolute left-card-padding top-card-padding z-10">
          <Badge variant="dark">Sold Out</Badge>
        </div>
      ) : product.trending ? (
        <div className="absolute left-card-padding top-card-padding z-10">
          <Badge variant="lime">Trending</Badge>
        </div>
      ) : null}

      <div
        className={
          isHero
            ? "relative mb-6 flex h-[200px] w-full flex-grow items-center justify-center overflow-hidden"
            : "relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low"
        }
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={product.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"}
            alt={product.imageAlt || product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={cn(
              "object-contain mix-blend-multiply opacity-90 transition-transform duration-500 ease-out group-hover:scale-105",
              isOutOfStock && "grayscale opacity-50"
            )}
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
            {isOutOfStock ? (
              <Button
                variant="outline"
                type="button"
                disabled
                className="flex-1 cursor-not-allowed bg-warm-mist px-0 py-2.5 text-[14px] text-sage-gray"
              >
                Sold Out
              </Button>
            ) : isInCart ? (
              <Button
                variant="primary"
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-1 bg-forest-depth px-0 py-2.5 text-[14px] text-white hover:bg-forest-depth/90"
              >
                <Check className="h-4 w-4" /> In Cart
              </Button>
            ) : (
              <Button
                variant="primary"
                type="button"
                onClick={handleAddToCart}
                className="flex-1 px-0 py-2.5 text-[14px]"
              >
                Add
              </Button>
            )}

            <Button
              variant="outline"
              type="button"
              onClick={handleAddToWishlist}
              className="h-10 w-10 rounded-full !p-0"
              aria-label={`Add ${product.name} to wishlist`}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-primary text-primary")} />
            </Button>
          </div>
          {feedback && <p className="mt-3 text-[12px] text-sage-gray">{feedback}</p>}
        </div>
      )}
    </motion.article>
  );
}
