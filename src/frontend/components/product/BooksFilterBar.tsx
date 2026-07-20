"use client";

import { SlidersHorizontal } from "lucide-react";
import { FilterChip } from "@/frontend/components/common/FilterChip";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";

export function BooksFilterBar() {
  return (
    <FadeInSection
      stagger
      className="mb-12 flex flex-wrap items-center gap-3 overflow-x-auto pb-2"
    >
      <StaggerItem>
        <FilterChip label="Condition: Used" active onRemove={() => {}} />
      </StaggerItem>
      <StaggerItem>
        <FilterChip label="Price" />
      </StaggerItem>
      <StaggerItem>
        <FilterChip label="Duration of use" />
      </StaggerItem>
      <StaggerItem>
        <FilterChip label="Trending" />
      </StaggerItem>
      <StaggerItem className="ml-auto">
        <button className="flex items-center gap-1 font-body-sm text-[13px] font-medium text-stone-charcoal transition-colors hover:text-primary">
          <SlidersHorizontal className="h-[18px] w-[18px]" />
          More Filters
        </button>
      </StaggerItem>
    </FadeInSection>
  );
}
