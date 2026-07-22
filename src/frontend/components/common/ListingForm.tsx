"use client";

import { ImagePlus, ShieldCheck } from "lucide-react";
import { FormField, Select, TextArea, TextInput } from "@/frontend/components/common/FormField";
import { SegmentedControl } from "@/frontend/components/common/SegmentedControl";
import { Button } from "@/frontend/components/common/Button";
import { StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/frontend/lib/motion";
import { useState } from "react";

interface ListingFormProps {
  onSubmit?: (payload: Record<string, unknown>) => Promise<void> | void;
  submitting?: boolean;
}

export function ListingForm({ onSubmit, submitting = false }: ListingFormProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    durationUsed: "",
    category: "Books",
    stock: "1",
    listingType: "SALE",
    exchangeAvailable: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit?.({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      condition: formData.condition.toUpperCase(),
      durationUsed: formData.durationUsed || undefined,
      category: formData.category,
      stock: Number(formData.stock),
      listingType: formData.listingType,
      exchangeAvailable: formData.exchangeAvailable,
    });
  };

  return (
    <StaggerItem className="relative z-10 flex w-full flex-col gap-8 rounded-2xl bg-cream-paper p-card-padding shadow-ambient">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FormField label="Photos" htmlFor="photo-upload">
          <motion.label
            htmlFor="photo-upload"
            whileHover={prefersReducedMotion ? undefined : { backgroundColor: "rgba(0,0,0,0.02)" }}
            className="group flex h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-on-surface transition-colors"
          >
            <ImagePlus className="h-9 w-9 text-on-surface-variant transition-colors group-hover:text-primary" />
            <span className="font-body-sm text-body-sm text-on-surface-variant transition-colors group-hover:text-primary">
              Upload photos
            </span>
            <input id="photo-upload" type="file" accept="image/*" multiple className="hidden" />
          </motion.label>
        </FormField>

        <FormField label="Item name" htmlFor="item-name">
          <TextInput
            id="item-name"
            name="item-name"
            placeholder="e.g., Engineering Mathematics 3rd Ed."
            required
            value={formData.title}
            onChange={handleChange}
            name="title"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Condition" htmlFor="condition">
            <Select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
              <option value="" disabled>
                Select condition...
              </option>
              <option value="new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </Select>
          </FormField>

          <FormField label="Duration of use" htmlFor="duration">
            <Select id="duration" name="durationUsed" value={formData.durationUsed} onChange={handleChange}>
              <option value="" disabled>
                Select duration...
              </option>
              <option value="less-6m">&lt; 6 months</option>
              <option value="1y">1 year</option>
              <option value="more-1y">&gt; 1 year</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Listing type" htmlFor="listing-type">
          <SegmentedControl
            options={["Sell", "Exchange", "Open to both"]}
            defaultValue="Sell"
            onChange={(value) => {
              const normalized = value === "Exchange" ? "EXCHANGE" : value === "Open to both" ? "SALE" : "SALE";
              setFormData((current) => ({ ...current, listingType: normalized, exchangeAvailable: value === "Open to both" }));
            }}
          />
        </FormField>

        <FormField label="Asking price" htmlFor="price">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">
              ₹
            </span>
            <TextInput
              id="price"
              name="price"
              type="number"
              placeholder="0.00"
              required
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full pl-12"
            />
          </div>
        </FormField>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the item, any flaws, or what you'd accept in exchange..."
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormField>

        <div className="flex items-start gap-3 rounded-lg bg-warm-mist p-4">
          <ShieldCheck className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-on-surface" />
          <p className="text-[13px] leading-snug text-on-surface">
            Your listing will be reviewed by a nearby Campus Ambassador (CAC) before it&apos;s
            marked Verified.
          </p>
        </div>

        <div className="mt-4">
          <Button type="submit" variant="primary" fullWidth className="rounded-[200px] py-4" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit listing"}
          </Button>
        </div>
      </form>
    </StaggerItem>
  );
}
