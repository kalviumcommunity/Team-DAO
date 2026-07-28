import Image from "next/image";
import { GraduationCap } from "lucide-react";
import type { Seller } from "@/types";
import { Badge } from "@/frontend/components/common/Badge";
import { FadeInSection } from "@/frontend/components/motion/FadeInSection";

interface SellerCardProps {
  seller: Seller;
}

/** Seller identity + verification card shown beneath the product details panel. */
export function SellerCard({ seller }: SellerCardProps) {
  return (
    <FadeInSection
      as="div"
      className="mt-4 flex w-full flex-col items-center gap-6 rounded-[24px] bg-cream-paper p-card-padding shadow-ambient transition-shadow duration-300 hover:shadow-lg sm:flex-row sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-silver-border bg-surface-container">
          <Image
            src={seller.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDCT97jlg9CTxIvpde6PllY3kmP6zNx3l_X8FNfYGLz-dv1fYo8S_7B-oVNOh3QvY4gyJwgW06rMJVAVxgnGF1Ha_q_uT_eCvtaTR68eeRIwqwRbM7PUECSXsL8Gz8EtzivEDg1KktJyfYdftsmL-1-ttvBts17KZKmHqemzN4SHOqmpXOAlEWRLKhtQu-PWnNNclFgyn3yOSaZowLRUPkJNaZLKSCdW6JwjiZdj1VyJVw6BVbj4hceqAQ2INWXxgQACakd7GYx6A5u"}
            alt={seller.avatarAlt || seller.name || "Seller avatar"}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-heading-sm text-heading-sm text-on-surface">{seller.name}</span>
          <span className="mt-1 flex items-center gap-1 font-body-sm text-on-surface-variant">
            <GraduationCap className="h-4 w-4" /> {seller.role}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 sm:items-end">
        {seller.verified && <Badge variant="verified">Verified CAC Seller</Badge>}
        <a href="#" className="font-body-sm text-on-surface underline transition-colors hover:text-primary">
          View Profile
        </a>
      </div>
    </FadeInSection>
  );
}
