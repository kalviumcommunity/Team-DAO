"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Check, X, RotateCcw } from "lucide-react";
import { FilterChip } from "@/frontend/components/common/FilterChip";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { MoreFiltersModal } from "./MoreFiltersModal";
import type { ProductFilterState } from "@/types";

interface BooksFilterBarProps {
  filters?: ProductFilterState;
  onFilterChange?: (newFilters: ProductFilterState) => void;
}

const CONDITION_PRESETS = [
  { label: "All Conditions", value: "" },
  { label: "Used", value: "Used" },
  { label: "New", value: "New" },
  { label: "Like New", value: "Like New" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
];

const PRICE_PRESETS = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: undefined },
];

const DURATION_PRESETS = [
  { label: "Any Duration", value: "" },
  { label: "Brand New", value: "Brand New" },
  { label: "< 6 Months", value: "6 months" },
  { label: "1 Semester", value: "1 semester" },
  { label: "1 Year+", value: "1 year" },
];

export function BooksFilterBar({
  filters = {},
  onFilterChange = () => {},
}: BooksFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<"condition" | "price" | "duration" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeFilterCount =
    (filters.condition ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.durationUsed ? 1 : 0) +
    (filters.trendingOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  const handleConditionSelect = (val: string) => {
    onFilterChange({
      ...filters,
      condition: val || undefined,
    });
    setOpenDropdown(null);
  };

  const handlePriceSelect = (min?: number, max?: number) => {
    const isSame = filters.minPrice === min && filters.maxPrice === max;
    onFilterChange({
      ...filters,
      minPrice: isSame ? undefined : min,
      maxPrice: isSame ? undefined : max,
    });
    setOpenDropdown(null);
  };

  const handleDurationSelect = (val: string) => {
    onFilterChange({
      ...filters,
      durationUsed: val || undefined,
    });
    setOpenDropdown(null);
  };

  const handleToggleTrending = () => {
    onFilterChange({
      ...filters,
      trendingOnly: !filters.trendingOnly,
    });
  };

  const handleResetAll = () => {
    onFilterChange({});
    setOpenDropdown(null);
  };

  // Helper label for price chip
  let priceLabel = "Price";
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    if (filters.minPrice === 0 && filters.maxPrice !== undefined) {
      priceLabel = `Price: Under $${filters.maxPrice}`;
    } else if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      priceLabel = `Price: $${filters.minPrice}-$${filters.maxPrice}`;
    } else if (filters.minPrice !== undefined && filters.maxPrice === undefined) {
      priceLabel = `Price: $${filters.minPrice}+`;
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <FadeInSection
        stagger
        className="mb-12 flex flex-wrap items-center gap-3 pb-2"
      >
        {/* Condition Filter Chip & Popover */}
        <StaggerItem className="relative">
          <FilterChip
            label={filters.condition ? `Condition: ${filters.condition}` : "Condition"}
            active={!!filters.condition}
            onClick={() =>
              setOpenDropdown((prev) => (prev === "condition" ? null : "condition"))
            }
            onRemove={
              filters.condition
                ? () => onFilterChange({ ...filters, condition: undefined })
                : undefined
            }
          />

          {openDropdown === "condition" && (
            <div className="absolute left-0 top-full z-40 mt-2 w-48 rounded-2xl border border-surface-container-high bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-sage-gray px-3 py-1.5">
                Select Condition
              </div>
              {CONDITION_PRESETS.map((opt) => {
                const isSelected = (filters.condition || "") === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleConditionSelect(opt.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-on-background font-semibold"
                        : "text-stone-charcoal hover:bg-surface-container-low"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </StaggerItem>

        {/* Price Filter Chip & Popover */}
        <StaggerItem className="relative">
          <FilterChip
            label={priceLabel}
            active={filters.minPrice !== undefined || filters.maxPrice !== undefined}
            onClick={() =>
              setOpenDropdown((prev) => (prev === "price" ? null : "price"))
            }
            onRemove={
              filters.minPrice !== undefined || filters.maxPrice !== undefined
                ? () => onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined })
                : undefined
            }
          />

          {openDropdown === "price" && (
            <div className="absolute left-0 top-full z-40 mt-2 w-52 rounded-2xl border border-surface-container-high bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-sage-gray px-3 py-1.5">
                Price Ranges
              </div>
              {PRICE_PRESETS.map((preset) => {
                const isSelected =
                  filters.minPrice === preset.min && filters.maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePriceSelect(preset.min, preset.max)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-on-background font-semibold"
                        : "text-stone-charcoal hover:bg-surface-container-low"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </StaggerItem>

        {/* Duration of Use Filter Chip & Popover */}
        <StaggerItem className="relative">
          <FilterChip
            label={filters.durationUsed ? `Duration: ${filters.durationUsed}` : "Duration of use"}
            active={!!filters.durationUsed}
            onClick={() =>
              setOpenDropdown((prev) => (prev === "duration" ? null : "duration"))
            }
            onRemove={
              filters.durationUsed
                ? () => onFilterChange({ ...filters, durationUsed: undefined })
                : undefined
            }
          />

          {openDropdown === "duration" && (
            <div className="absolute left-0 top-full z-40 mt-2 w-52 rounded-2xl border border-surface-container-high bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-sage-gray px-3 py-1.5">
                Duration of Use
              </div>
              {DURATION_PRESETS.map((opt) => {
                const isSelected = (filters.durationUsed || "") === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleDurationSelect(opt.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-on-background font-semibold"
                        : "text-stone-charcoal hover:bg-surface-container-low"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </StaggerItem>

        {/* Trending Filter Chip */}
        <StaggerItem>
          <FilterChip
            label="Trending"
            active={!!filters.trendingOnly}
            onClick={handleToggleTrending}
            onRemove={filters.trendingOnly ? handleToggleTrending : undefined}
          />
        </StaggerItem>

        {/* Clear All Option if active filters exist */}
        {activeFilterCount > 0 && (
          <StaggerItem>
            <button
              type="button"
              onClick={handleResetAll}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body-sm text-xs font-medium text-sage-gray hover:text-stone-charcoal hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset filters
            </button>
          </StaggerItem>
        )}

        {/* More Filters Trigger Button */}
        <StaggerItem className="ml-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 font-body-sm text-[13px] font-medium text-stone-charcoal transition-colors hover:text-primary cursor-pointer rounded-full px-3 py-1.5 hover:bg-surface-container-low"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
            More Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container font-label-caps text-[10px] font-bold text-on-background">
                {activeFilterCount}
              </span>
            )}
          </button>
        </StaggerItem>
      </FadeInSection>

      {/* Slide-over Filter Modal */}
      <MoreFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => onFilterChange(newFilters)}
        onResetFilters={handleResetAll}
      />
    </div>
  );
}
