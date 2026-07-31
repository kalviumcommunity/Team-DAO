"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { BooksFilterBar } from "@/frontend/components/product/BooksFilterBar";
import { Button } from "@/frontend/components/common/Button";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { getProducts } from "@/frontend/lib/api";
import { BOOK_PRODUCTS } from "@/frontend/lib/mock-data";
import type { Product, ProductFilterState } from "@/types";
import { FilterX, RotateCcw } from "lucide-react";

function applyProductFilters(items: Product[], filters: ProductFilterState): Product[] {
  return items.filter((p) => {
    // Condition filter
    if (filters.condition) {
      if (!p.condition || p.condition.toLowerCase() !== filters.condition.toLowerCase()) {
        return false;
      }
    }

    // Min & Max Price filter
    const rawPrice = parseFloat((p.price || "0").replace(/[^0-9.]/g, "")) || 0;
    if (filters.minPrice !== undefined && rawPrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && rawPrice > filters.maxPrice) {
      return false;
    }

    // Duration of use filter
    if (filters.durationUsed) {
      if (!p.durationUsed || !p.durationUsed.toLowerCase().includes(filters.durationUsed.toLowerCase())) {
        return false;
      }
    }

    // Trending filter
    if (filters.trendingOnly && !p.trending) {
      return false;
    }

    // Search term filter
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

export default function BooksPage() {
  const [rawProducts, setRawProducts] = useState<Product[]>(BOOK_PRODUCTS);
  const [filters, setFilters] = useState<ProductFilterState>({ condition: "Used" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      try {
        const listings = await getProducts({
          category: "Books",
          condition: filters.condition,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          search: filters.search,
          trendingOnly: filters.trendingOnly,
        });

        if (isMounted) {
          setRawProducts(listings.length > 0 ? listings : BOOK_PRODUCTS);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setRawProducts(BOOK_PRODUCTS);
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

  // Apply client-side refinement logic for mock-data and exact attribute matching
  const filteredProducts = useMemo(() => {
    return applyProductFilters(rawProducts, filters);
  }, [rawProducts, filters]);

  return (
    <>
      <Navbar activeHref="/books" />

      <main className="mx-auto w-full max-w-7xl flex-grow px-container-margin pb-section-gap pt-[calc(72px+3rem)]">
        <FadeInSection
          as="header"
          className="mb-10 flex flex-col items-center md:items-start"
        >
          <span className="mb-2 block font-label-caps text-label-caps tracking-widest text-sage-gray">
            BROWSE
          </span>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <h1 className="font-display text-[48px] font-light leading-tight tracking-[-1px] text-stone-charcoal">
              Books
            </h1>
            <span className="pb-2 font-body-sm text-body-sm text-sage-gray">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>
        </FadeInSection>

        {/* Filter Bar Component */}
        <BooksFilterBar
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />

        {isLoading ? (
          <p className="mb-16 text-center text-sage-gray">Loading products...</p>
        ) : error ? (
          <p className="mb-16 text-center text-red-600">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <FadeInSection className="mb-16 flex flex-col items-center justify-center rounded-3xl border border-surface-container-high bg-surface-container-low px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-sage-gray">
              <FilterX className="h-7 w-7" />
            </div>
            <h3 className="mb-2 font-display text-2xl font-normal text-stone-charcoal">
              No matching books found
            </h3>
            <p className="mb-6 max-w-md font-body-sm text-sm text-sage-gray">
              We couldn't find any books matching your selected filter criteria. Try resetting or adjusting your filters.
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
          <FadeInSection
            stagger
            className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((book) => (
              <StaggerItem key={book.id}>
                <ProductCard product={book} layout="compact" />
              </StaggerItem>
            ))}
          </FadeInSection>
        )}

        {filteredProducts.length > 0 && (
          <FadeInSection as="div" className="flex justify-center">
            <Button
              variant="outline"
              className="border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white"
            >
              Load more
            </Button>
          </FadeInSection>
        )}
      </main>

      <Footer />
    </>
  );
}
