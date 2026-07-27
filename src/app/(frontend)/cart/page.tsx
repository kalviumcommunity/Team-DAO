"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { CartLineItem } from "@/frontend/components/cart/CartLineItem";
import { OrderSummary } from "@/frontend/components/cart/OrderSummary";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { getCartItems, removeCartItem, updateCartItemQuantity } from "@/frontend/lib/api";
import type { CartItem } from "@/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        setLoading(true);
        setError(null);
        const cartItems = await getCartItems();
        if (isMounted) {
          setItems(cartItems);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load your cart.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) {
      return;
    }

    const nextQuantity = Math.max(1, currentItem.quantity + delta);

    try {
      await updateCartItemQuantity(id, nextQuantity);
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update quantity.");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeCartItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove item.");
    }
  };

  const subtotal = useMemo(() => {
    const total = items.reduce((sum, item) => {
      const priceValue = Number.parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + (Number.isNaN(priceValue) ? 0 : priceValue * item.quantity);
    }, 0);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  }, [items]);

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

        {error ? (
          <p className="mb-6 rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-surface">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-[60px] lg:flex-row">
          <FadeInSection stagger as="div" className="flex w-full flex-col gap-6 lg:w-[65%]">
            {loading ? (
              <p className="rounded-2xl border border-silver-border bg-cream-paper px-4 py-6 text-center text-sage-gray">
                Loading your cart...
              </p>
            ) : items.length === 0 ? (
              <p className="rounded-2xl border border-silver-border bg-cream-paper px-4 py-6 text-center text-sage-gray">
                Your cart is empty right now.
              </p>
            ) : (
              items.map((item) => (
                <StaggerItem key={item.id}>
                  <CartLineItem
                    item={item}
                    onIncrement={(id) => void updateQuantity(id, 1)}
                    onDecrement={(id) => void updateQuantity(id, -1)}
                    onRemove={(id) => void removeItem(id)}
                  />
                </StaggerItem>
              ))
            )}
          </FadeInSection>

          <OrderSummary subtotal={subtotal} total={subtotal} />
        </div>
      </main>

      <Footer />
    </>
  );
}
