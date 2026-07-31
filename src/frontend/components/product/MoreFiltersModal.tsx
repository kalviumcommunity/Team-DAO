"use client";

import { useEffect, useState } from "react";
import { X, Search, RotateCcw, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductFilterState } from "@/types";
import { Button } from "@/frontend/components/common/Button";

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilterState;
  onApplyFilters: (newFilters: ProductFilterState) => void;
  onResetFilters: () => void;
}

const CONDITION_OPTIONS = [
  { label: "All Conditions", value: "" },
  { label: "New", value: "New" },
  { label: "Like New", value: "Like New" },
  { label: "Good", value: "Good" },
  { label: "Used", value: "Used" },
  { label: "Fair", value: "Fair" },
];

const PRICE_PRESETS = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: undefined },
];

const DURATION_OPTIONS = [
  { label: "Any Duration", value: "" },
  { label: "Brand New", value: "Brand New" },
  { label: "< 6 Months", value: "6 months" },
  { label: "1 Semester", value: "1 semester" },
  { label: "1 Year+", value: "1 year" },
];

export function MoreFiltersModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: MoreFiltersModalProps) {
  const [draft, setDraft] = useState<ProductFilterState>(filters);

  // Synchronize draft state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraft(filters);
    }
  }, [isOpen, filters]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeCount =
    (draft.condition ? 1 : 0) +
    (draft.minPrice !== undefined || draft.maxPrice !== undefined ? 1 : 0) +
    (draft.durationUsed ? 1 : 0) +
    (draft.trendingOnly ? 1 : 0) +
    (draft.search ? 1 : 0);

  const handleApply = () => {
    onApplyFilters(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft({});
    onResetFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-charcoal/40 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-normal text-stone-charcoal">
                  Filters
                </h2>
                {activeCount > 0 && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-primary-container px-2 font-label-caps text-[11px] font-bold text-on-background">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-sage-gray hover:bg-surface-container-low hover:text-stone-charcoal transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
              {/* Search Filter */}
              <div>
                <label className="mb-2 block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                  Keyword Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-gray" />
                  <input
                    type="text"
                    value={draft.search || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, search: e.target.value || undefined }))
                    }
                    placeholder="Search by title or description..."
                    className="w-full rounded-2xl border border-stone-charcoal/20 bg-surface-container-low pl-10 pr-4 py-2.5 font-body-sm text-sm text-stone-charcoal placeholder:text-sage-gray focus:border-stone-charcoal focus:bg-surface focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="mb-2.5 block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                  Condition
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map((opt) => {
                    const isSelected = (draft.condition || "") === opt.value;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            condition: opt.value || undefined,
                          }))
                        }
                        className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-body-sm text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary-container text-on-background font-semibold shadow-xs"
                            : "border border-stone-charcoal/30 text-stone-charcoal hover:border-stone-charcoal hover:bg-surface-container-low"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="mb-2.5 block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                  Price Range
                </label>

                {/* Quick Presets */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => {
                    const isMatch =
                      draft.minPrice === preset.min && draft.maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            minPrice: isMatch ? undefined : preset.min,
                            maxPrice: isMatch ? undefined : preset.max,
                          }))
                        }
                        className={`rounded-lg px-3 py-1.5 font-body-sm text-xs font-medium transition-colors cursor-pointer ${
                          isMatch
                            ? "bg-stone-charcoal text-surface"
                            : "bg-surface-container-low text-stone-charcoal hover:bg-surface-container-high"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Inputs */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-xs text-sage-gray">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={draft.minPrice !== undefined ? draft.minPrice : ""}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                        setDraft((prev) => ({ ...prev, minPrice: val }));
                      }}
                      className="w-full rounded-xl border border-stone-charcoal/20 bg-surface-container-low pl-7 pr-3 py-2 font-body-sm text-xs text-stone-charcoal focus:border-stone-charcoal focus:outline-hidden"
                    />
                  </div>
                  <span className="text-sage-gray font-body-sm text-xs">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-xs text-sage-gray">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={draft.maxPrice !== undefined ? draft.maxPrice : ""}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                        setDraft((prev) => ({ ...prev, maxPrice: val }));
                      }}
                      className="w-full rounded-xl border border-stone-charcoal/20 bg-surface-container-low pl-7 pr-3 py-2 font-body-sm text-xs text-stone-charcoal focus:border-stone-charcoal focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Duration of Use Filter */}
              <div>
                <label className="mb-2.5 block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                  Duration of Use
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = (draft.durationUsed || "") === opt.value;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            durationUsed: opt.value || undefined,
                          }))
                        }
                        className={`rounded-full px-3.5 py-1.5 font-body-sm text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary-container text-on-background font-semibold"
                            : "border border-stone-charcoal/20 text-stone-charcoal hover:bg-surface-container-low"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Toggle Switch */}
              <div className="flex items-center justify-between rounded-2xl border border-surface-container-high bg-surface-container-low p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/60 text-stone-charcoal">
                    <Sparkles className="h-4 w-4 text-stone-charcoal" />
                  </div>
                  <div>
                    <p className="font-body-sm text-sm font-medium text-stone-charcoal">
                      Trending / Verified Only
                    </p>
                    <p className="font-body-sm text-xs text-sage-gray">
                      Show verified & high-demand campus items
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      trendingOnly: !prev.trendingOnly,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    draft.trendingOnly ? "bg-primary-container" : "bg-stone-charcoal/20"
                  }`}
                  role="switch"
                  aria-checked={draft.trendingOnly || false}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md ring-0 transition duration-200 ease-in-out ${
                      draft.trendingOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-surface-container-high bg-surface px-6 py-4 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 border-stone-charcoal/30 text-stone-charcoal hover:bg-surface-container-low"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={handleApply}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-container text-on-background hover:brightness-95"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
