"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { floatLoop, usePrefersReducedMotion } from "@/frontend/lib/motion";
import { cn } from "@/frontend/lib/cn";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

/** Main image floats gently and parallaxes on scroll; thumbnails swap the main image on click. */
export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const active = images[activeIndex];

  return (
    <div ref={containerRef} className="flex w-full flex-col gap-6 lg:w-[55%]">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[24px] bg-cream-paper p-card-padding shadow-ambient md:aspect-[4/3]">
        <motion.div
          className="relative h-full w-full"
          style={prefersReducedMotion ? undefined : { y: parallaxY }}
          animate={prefersReducedMotion ? undefined : floatLoop.animate}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain transition-transform duration-500 ease-out hover:scale-105"
            priority
          />
        </motion.div>
      </div>

      <div className="grid w-full grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "flex aspect-square cursor-pointer items-center justify-center rounded-[12px] border-2 bg-cream-paper p-2 shadow-ambient transition-colors",
              index === activeIndex
                ? "border-primary"
                : "border-transparent hover:border-silver-border"
            )}
          >
            <div className="relative h-full w-full">
              <Image src={image.src} alt={image.alt} fill sizes="120px" className="object-contain" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
