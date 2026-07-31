"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { BooksFilterBar } from "@/frontend/components/product/BooksFilterBar";
import { Button } from "@/frontend/components/common/Button";
import { ArrowDown, FilterX, RotateCcw } from "lucide-react";
import { getProducts } from "@/frontend/lib/api";
import { STATIONERY_PRODUCTS } from "@/frontend/lib/mock-data";
import type { Product, ProductFilterState } from "@/types";

function applyProductFilters(items: Product[], filters: ProductFilterState): Product[] {
  return items.filter((p) => {
    if (filters.condition) {
      if (!p.condition || p.condition.toLowerCase() !== filters.condition.toLowerCase()) {
        return false;
      }
    }

    const rawPrice = parseFloat((p.price || "0").replace(/[^0-9.]/g, "")) || 0;
    if (filters.minPrice !== undefined && rawPrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && rawPrice > filters.maxPrice) {
      return false;
    }

    if (filters.durationUsed) {
      if (!p.durationUsed || !p.durationUsed.toLowerCase().includes(filters.durationUsed.toLowerCase())) {
        return false;
      }
    }

    if (filters.trendingOnly && !p.trending) {
      return false;
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(query);
      const descMatch = p.description?.toLowerCase().includes(query) ?? false;
      if (!nameMatch && !descMatch) {
        return false;
      }
    }

    return true;
  });
}

export default function StationeryPage() {
  const [rawProducts, setRawProducts] = useState<Product[]>(STATIONERY_PRODUCTS);
  const [filters, setFilters] = useState<ProductFilterState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      try {
        const listings = await getProducts({
          category: "Stationery",
          condition: filters.condition,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          search: filters.search,
          trendingOnly: filters.trendingOnly,
        });

        if (isMounted) {
          setRawProducts(listings.length > 0 ? listings : STATIONERY_PRODUCTS);
        }
      } catch {
        if (isMounted) {
          setRawProducts(STATIONERY_PRODUCTS);
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
  }, [filters.condition, filters.minPrice, filters.maxPrice, filters.search, filters.trendingOnly]);

  const filteredProducts = useMemo(() => {
    return applyProductFilters(rawProducts, filters);
  }, [rawProducts, filters]);

  return (
    <>
      <Navbar activeHref="/stationery" />
      <main className="max-w-7xl mx-auto px-container-margin py-section-gap pt-[calc(72px+3rem)]">
        <header className="mb-12">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">BROWSE</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[48px] leading-tight font-light text-on-surface">Stationery</h1>
              <p className="font-body-sm text-body-sm text-sage-gray mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} available
              </p>
            </div>
          </div>
        </header>

        <BooksFilterBar
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />

        {isLoading ? (
          <p className="mb-16 text-center text-sage-gray">Loading stationery essentials...</p>
        ) : filteredProducts.length === 0 ? (
          <FadeInSection className="mb-16 flex flex-col items-center justify-center rounded-3xl border border-surface-container-high bg-surface-container-low px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-sage-gray">
              <FilterX className="h-7 w-7" />
            </div>
            <h3 className="mb-2 font-display text-2xl font-normal text-stone-charcoal">
              No matching stationery found
            </h3>
            <p className="mb-6 max-w-md font-body-sm text-sm text-sage-gray">
              We couldn't find any stationery matching your selected filter criteria. Try resetting or adjusting your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({})}
              className="flex items-center gap-2 border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset all filters
            </Button>
          </FadeInSection>
        ) : (
          <FadeInSection stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {filteredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} layout="compact" />
              </StaggerItem>
            ))}
          </FadeInSection>
        )}

        {filteredProducts.length > 0 && (
          <FadeInSection as="div" className="mt-20 flex justify-center">
            <Button variant="outline" className="border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white" icon={<ArrowDown className="h-4 w-4" />}>
              Load more items
            </Button>
          </FadeInSection>
        )}
      </main>
      <Footer />
    </>
  );
}
