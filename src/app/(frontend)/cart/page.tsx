"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { AlertBanner } from "@/frontend/components/common/AlertBanner";
import { CartLineItem } from "@/frontend/components/cart/CartLineItem";
import { OrderSummary } from "@/frontend/components/cart/OrderSummary";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { CART_ITEMS } from "@/frontend/lib/mock-data";
import type { CartItem } from "@/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(CART_ITEMS);

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  // Prices in this mock mix currencies (₹ and $); real implementation would total in one currency.
  const subtotal = useMemo(() => "₹41,600", []);

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-grow px-container-margin pt-[calc(72px+2.5rem)] pb-section-gap md:px-[64px]">
        <FadeInSection as="header" className="mb-10 text-center md:text-left">
          <span className="mb-4 block font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            REVIEW &amp; CHECKOUT
          </span>
          <h1 className="font-display text-[48px] text-on-surface">Your cart</h1>
        </FadeInSection>

        <AlertBanner>One item was removed because it went out of stock.</AlertBanner>

        <div className="flex flex-col gap-[60px] lg:flex-row">
          <FadeInSection stagger as="div" className="flex w-full flex-col gap-6 lg:w-[65%]">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <CartLineItem
                  item={item}
                  onIncrement={(id) => updateQuantity(id, 1)}
                  onDecrement={(id) => updateQuantity(id, -1)}
                  onRemove={removeItem}
                />
              </StaggerItem>
            ))}
          </FadeInSection>

          <OrderSummary subtotal={subtotal} total={subtotal} />
        </div>
      </main>

      <Footer />
    </>
  );
}
