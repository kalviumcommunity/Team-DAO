"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { Button } from "@/frontend/components/common/Button";
import { ChevronDown, X, ArrowDown } from "lucide-react";
import { getProducts } from "@/frontend/lib/api";
import { STATIONERY_PRODUCTS } from "@/frontend/lib/mock-data";
import type { Product } from "@/types";

export default function StationeryPage() {
  const [products, setProducts] = useState<Product[]>(STATIONERY_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const listings = await getProducts();
        const stationeryListings = listings.filter(
          (p) => p.category && p.category.toLowerCase() === "stationery"
        );
        if (isMounted) {
          setProducts(stationeryListings.length > 0 ? stationeryListings : STATIONERY_PRODUCTS);
        }
      } catch {
        if (isMounted) {
          setProducts(STATIONERY_PRODUCTS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar activeHref="/stationery" />
      <main className="max-w-7xl mx-auto px-container-margin py-section-gap pt-[calc(72px+3rem)]">
        <header className="mb-12">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">BROWSE</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[48px] leading-tight font-light text-on-surface">Stationery</h1>
              <p className="font-body-sm text-body-sm text-sage-gray mt-1">{products.length} items available</p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <button className="h-10 px-5 rounded-full bg-lime-gradient text-on-surface font-medium text-body-sm flex items-center justify-center gap-2 transition-all hover:opacity-90">
            Category: Stationery
            <X className="h-4 w-4" />
          </button>
          {["Condition", "Price", "Trending"].map((filter) => (
            <button key={filter} className="h-10 px-5 rounded-full bg-cream-paper border border-on-surface text-on-surface font-medium text-body-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-all">
              {filter}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mb-16 text-center text-sage-gray">Loading stationery essentials...</p>
        ) : (
          <FadeInSection stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} layout="compact" />
              </StaggerItem>
            ))}
          </FadeInSection>
        )}

        <FadeInSection as="div" className="mt-20 flex justify-center">
          <Button variant="outline" className="border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white" icon={<ArrowDown className="h-4 w-4" />}>
            Load more items
          </Button>
        </FadeInSection>
      </main>
      <Footer />
    </>
  );
}
