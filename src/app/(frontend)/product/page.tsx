"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { Button } from "@/frontend/components/common/Button";
import { Badge } from "@/frontend/components/common/Badge";
import { ProductGallery } from "@/frontend/components/product/ProductGallery";
import { SellerCard } from "@/frontend/components/sell/SellerCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { addToCartItem, addToWishlistItem, getAuthToken, getProductById, getProducts } from "@/frontend/lib/api";
import { ELECTRONICS_PRODUCTS } from "@/frontend/lib/mock-data";
import type { Product } from "@/types";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const listingId = searchParams.get("id");

    const loadProduct = async () => {
      try {
        const foundProduct = listingId
          ? await getProductById(listingId)
          : (await getProducts())[0] ?? ELECTRONICS_PRODUCTS[0];

        if (isMounted) {
          setProduct(foundProduct || ELECTRONICS_PRODUCTS[0]);
        }
      } catch {
        if (isMounted) {
          setProduct(ELECTRONICS_PRODUCTS[0]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleAddToWishlist = async () => {
    if (!product) {
      return;
    }

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

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    setFeedback("Adding to cart...");

    try {
      await addToCartItem(product.id, quantity, product);
      setIsInCart(true);
      setFeedback(`Added to cart (Qty: ${quantity})`);
    } catch (err: unknown) {
      setIsInCart(true);
      setFeedback(`Added to cart (Qty: ${quantity})`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar activeHref="/product" />
        <main className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-container-margin py-20">
          <p className="font-body-md text-sage-gray">Loading listing…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar activeHref="/product" />
        <main className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-container-margin py-20">
          <p className="font-body-md text-sage-gray">No listing available right now.</p>
        </main>
        <Footer />
      </>
    );
  }

  const galleryImages = [{ src: product.image, alt: product.imageAlt }];

  return (
    <>
      <Navbar activeHref="/product" />

      <main className="mx-auto flex w-full max-w-[1200px] flex-grow flex-col gap-12 px-container-margin py-12 pt-[calc(72px+3rem)] md:py-20 md:pt-[calc(72px+5rem)]">
        <div className="flex w-full flex-col gap-section-gap lg:flex-row">
          <ProductGallery images={galleryImages} />

          <FadeInSection
            as="div"
            stagger
            className="flex w-full flex-col justify-start gap-8 lg:w-[45%]"
          >
            <StaggerItem className="flex flex-col gap-4">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface">
                {product.condition ? product.condition.toUpperCase() : "LISTING"}
              </span>
              <h1 className="font-display text-[40px] font-light leading-tight text-on-surface">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {product.trending && (
                  <Badge variant="verified" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                    Verified by CAC
                  </Badge>
                )}
                {product.condition && (
                  <Badge variant="outline" className="rounded-full">
                    {product.condition}
                  </Badge>
                )}
              </div>
            </StaggerItem>

            <StaggerItem className="mt-2 flex items-end gap-3 border-t border-silver-border pt-6">
              <span className="font-heading text-heading text-on-surface">{product.price}</span>
            </StaggerItem>

            <StaggerItem>
              <p className="font-body-md text-[16px] font-normal leading-relaxed text-on-surface-variant">
                {product.description ?? "A verified student listing ready for checkout."}
              </p>
            </StaggerItem>

            {/* Quantity Increase Capsule */}
            <StaggerItem className="flex items-center gap-4">
              <span className="font-label-caps text-xs font-semibold uppercase tracking-wider text-sage-gray">
                Quantity
              </span>
              <div className="flex items-center gap-3 rounded-full border border-silver-border bg-cream-paper px-4 py-2 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-silver-border bg-white text-on-surface transition-colors hover:bg-surface-container cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-subheading text-lg font-bold text-on-surface">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-silver-border bg-white text-on-surface transition-colors hover:bg-surface-container cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </StaggerItem>

            <StaggerItem className="mt-2 flex flex-wrap gap-4">
              <Button
                variant="outline"
                fullWidth
                className="flex-1 py-4 text-[16px]"
                type="button"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </Button>
              {product.availableStock !== undefined && (product.availableStock <= 0 || product.status === "SOLD" || product.status === "DEACTIVATED") ? (
                <Button
                  variant="outline"
                  fullWidth
                  disabled
                  className="flex-1 py-4 text-[16px] cursor-not-allowed bg-warm-mist text-sage-gray"
                  type="button"
                >
                  Sold Out
                </Button>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  className="flex-1 py-4 text-[16px]"
                  type="button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}
            </StaggerItem>

            {/* Wishlist & Cart Status Capsule */}
            {(isWishlisted || isInCart || feedback) && (
              <StaggerItem className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-mint-wash/50 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  {isWishlisted && (
                    <span className="flex items-center gap-1.5 font-body-sm text-sm font-medium text-forest-depth">
                      <Heart className="h-4 w-4 fill-primary text-primary" /> Added to Wishlist
                    </span>
                  )}
                  {isInCart && (
                    <span className="flex items-center gap-1.5 font-body-sm text-sm font-medium text-forest-depth">
                      <ShoppingBag className="h-4 w-4 text-primary" /> In Cart (Qty: {quantity})
                    </span>
                  )}
                </div>
                {feedback && <p className="font-body-sm text-sage-gray">{feedback}</p>}
              </StaggerItem>
            )}
          </FadeInSection>
        </div>

        <SellerCard
          seller={{
            name: "Ananya R.",
            role: "Senior · Computer Science",
            verified: true,
            avatar:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCdGZVB3FLCcCeRdcghCCN5oJVbKZlYcqvXzFFZtk7J1BPt9PlIpFqsHOmaAMWXI0yJgIJEKMRs9oxuhjEy55Jvp5gKcKLIGbHo80Bx5XYJUHXdkcSzp8vr52FMXh8vLM5snQxWCPEntoENQfHBKMa4ZFBPUTwfYgP_xDEBuGktZ71VSGRRrtaasTVqSOQkNoWlSD7WhYG1EQqMRwo6qtBoQahkjkQRI8JL9PQLOURpsV6OYcKnD2z6AhwlCGIYe5Xwyc3swarpu2Kx",
            avatarAlt: "Portrait of seller Ananya R.",
          }}
        />
      </main>

      <Footer />
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar activeHref="/product" />
        <main className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-container-margin py-20">
          <p className="font-body-md text-sage-gray">Loading page…</p>
        </main>
        <Footer />
      </>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}
