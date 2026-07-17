import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";

/** Dark inline notice banner, e.g. "One item was removed because it went out of stock." */
export function AlertBanner({ children }: { children: ReactNode }) {
  return (
    <FadeInSection
      as="div"
      className="mb-12 flex items-center gap-3 rounded-[10px] bg-on-background px-6 py-4 text-cream-paper"
    >
      <Info className="h-5 w-5 flex-shrink-0" />
      <p className="m-0 font-body-sm text-body-sm text-cream-paper">{children}</p>
    </FadeInSection>
  );
}
