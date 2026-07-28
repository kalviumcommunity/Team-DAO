"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { BooksFilterBar } from "@/frontend/components/product/BooksFilterBar";
import { Button } from "@/frontend/components/common/Button";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { getProducts } from "@/frontend/lib/api";
import { BOOK_PRODUCTS } from "@/frontend/lib/mock-data";
import type { Product } from "@/types";

export default function BooksPage() {
  const [products, setProducts] = useState<Product[]>(BOOK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const listings = await getProducts();
        const bookListings = listings.filter(
          (p) => !p.category || p.category.toLowerCase() === "books"
        );
        if (isMounted) {
          setProducts(bookListings.length > 0 ? bookListings : BOOK_PRODUCTS);
        }
      } catch {
        if (isMounted) {
          setProducts(BOOK_PRODUCTS);
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
              {products.length} items
            </span>
          </div>
        </FadeInSection>

        <BooksFilterBar />

        {isLoading ? (
          <p className="mb-16 text-center text-sage-gray">Loading products...</p>
        ) : error ? (
          <p className="mb-16 text-center text-red-600">{error}</p>
        ) : (
          <FadeInSection
            stagger
            className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((book) => (
              <StaggerItem key={book.id}>
                <ProductCard product={book} layout="compact" />
              </StaggerItem>
            ))}
          </FadeInSection>
        )}

        <FadeInSection as="div" className="flex justify-center">
          <Button variant="outline" className="border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white">
            Load more
          </Button>
        </FadeInSection>
      </main>

      <Footer />
    </>
  );
}
