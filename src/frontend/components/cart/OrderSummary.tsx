import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/frontend/components/common/Button";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";

interface OrderSummaryProps {
  subtotal: string;
  total: string;
  taxes?: string;
}

/** Sticky checkout summary card shown alongside the cart line items. */
export function OrderSummary({ subtotal, total, taxes = "₹0.00" }: OrderSummaryProps) {
  return (
    <FadeInSection as="div" className="w-full lg:w-[35%]">
      <div className="sticky top-24 rounded-[24px] bg-cream-paper p-card-padding shadow-ambient">
        <span className="mb-6 block border-b border-silver-border pb-4 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
          ORDER SUMMARY
        </span>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Taxes</span>
            <span>{taxes}</span>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-t border-silver-border pt-6">
          <span className="font-body-md font-bold text-on-surface">Total</span>
          <span className="font-body-md font-bold text-on-surface">{total}</span>
        </div>

        <Button variant="primary" fullWidth icon={<ArrowRight className="h-5 w-5" />}>
          Checkout
        </Button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sage-gray">
          <Lock className="h-4 w-4" />
          <span className="font-caption text-caption">Secure Encrypted Checkout</span>
        </div>
      </div>
    </FadeInSection>
  );
}
