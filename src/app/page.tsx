"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { Button } from "@/frontend/components/common/Button";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { heroItem, heroStagger, usePrefersReducedMotion } from "@/frontend/lib/motion";
import { TRENDING_PRODUCTS } from "@/frontend/lib/mock-data";

export default function HomePage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Navbar activeHref="" />

      <main className="flex-grow pt-[72px]">
        {/* Hero */}
        <motion.section
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          variants={heroStagger}
          className="mx-auto flex max-w-5xl flex-col items-center justify-center px-container-margin py-[140px] text-center"
        >
          <motion.h1
            variants={heroItem}
            className="mb-6 font-display text-[64px] font-thin leading-[0.95] text-on-surface md:text-[96px]"
          >
            Campus finds, <br className="md:hidden" />{" "}
            <span className="bg-lime-gradient bg-clip-text pr-2 italic text-transparent">
              anywhere
            </span>
            .
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mb-12 max-w-2xl font-body-md text-[18px] text-stone-charcoal"
          >
            Buy, sell, and exchange with students on your campus. High-quality essentials curated
            for your academic journey.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button variant="primary" fullWidth className="sm:w-auto" icon={<ArrowRight className="h-4 w-4" />}>
              Shop now
            </Button>
            <Button variant="dark" fullWidth className="sm:w-auto">
              Sell an item
            </Button>
          </motion.div>
        </motion.section>

        {/* Product grid */}
        <section className="mx-auto max-w-7xl px-container-margin py-section-gap">
          <FadeInSection className="mb-[80px] text-center">
            <span className="mb-4 block font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
              THIS WEEK
            </span>
            <h2 className="font-display text-[40px] font-light leading-tight text-on-surface md:text-[56px]">
              Student essentials
            </h2>
          </FadeInSection>

          <FadeInSection
            stagger
            className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3"
          >
            {TRENDING_PRODUCTS.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} layout="hero" />
              </StaggerItem>
            ))}
          </FadeInSection>
        </section>

        {/* CTA banner */}
        <div className="mx-auto max-w-7xl px-container-margin pb-section-gap">
          <FadeInSection className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-[24px] bg-forest-depth p-[60px] shadow-ambient md:flex-row md:p-[80px]">
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />
            <div className="z-10 flex max-w-2xl flex-col items-start gap-4">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-white">
                SELL &amp; EXCHANGE
              </span>
              <h2 className="font-display text-[32px] font-light leading-tight text-white md:text-[40px]">
                Got old textbooks? <br className="hidden md:block" /> Turn them into cash.
              </h2>
            </div>
            <div className="z-10 w-full flex-shrink-0 md:w-auto">
              <Button variant="primary" fullWidth className="md:w-auto">
                Learn more
              </Button>
            </div>
          </FadeInSection>
        </div>
      </main>

      <Footer />
    </>
  );
}
