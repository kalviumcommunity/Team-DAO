import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { Button } from "@/frontend/components/common/Button";
import { Badge } from "@/frontend/components/common/Badge";
import { ProductGallery } from "@/frontend/components/product/ProductGallery";
import { SellerCard } from "@/frontend/components/sell/SellerCard";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";

const GALLERY_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuChwz8bFZglk9Mvii5BPzhOywJu5unGb4ih4Q9x6qkm5HHJG_IrYpWLeYa7RFV2hAIpby9xUU9Ws0HtXkUsQRgNA_H8lFruqm9HOgaxoj-RIVp2nYJtSn1f3-iRlmsQj_H02pUIgpBt4apNie62c8fE-2lHGE60kBSU3S6nivskOp3hRBfM7hztmVJwuiXGYjj9xqJ2ooxuioop0odnR3fJWiy1r83Ib_57l_cseHv_8-hf-U4UntPNYE-_SKzeummpwryKnN2BM31K",
    alt: "MacBook Air M1 resting diagonally on a white backdrop",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOdc0Jgw0YubDx7tLAuN93Rn1ZXc10Mf7d9-i_8VLXhCBaI30LdgG-278gsEK27tyoZ-A4yxbhFSCyJTmXf-8WSXd1dLqbgyauPOrDsWYxphoxH7T-Sk3RDbO_7lu3mzhGIy073ALOXtJ5AupH-xUirYNh_l_UvhYYlvwp4-0dVU91jG0zjy3opvQJg4i9mIxRmlA6ZhV2uo13qktgTP-TDdNbd02tDkFXbnSlhjyux3JM0Iz6H3ZXDo_lN3EV3GQjm_eD355r-6-1",
    alt: "MacBook Air M1 keyboard and trackpad close-up",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDVt20qn1U9yqpya7vT2pOT1kQyCNko-kywyLcdVmZAraX1gp7Q3j_CzK1mUOyyJBzjPEb79P3cuwPmdeHZY0QyGvqv6wDUoYRMaoCUe9buHMOyzAmwWsceApvgz4ZLeKJRJ4flaqxfdvxFKI2U06GK12gON_-ZJNtcgmZXYR4QJI8mTRv56g5ckJIjui7u5eEtqR3zd54nVhLFxPnpabPahsouQkcF2jzWElwCp9Iy0AytQ9XJNp2GFJt64zDayw-U2uy8cG8zOMV",
    alt: "MacBook Air M1 side profile showing its thin wedge design",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRdqSRl_fwhtJviGg5MNi9YcKumP9A8UeCT5J8SzBlxNeCSNKThmfx5t73swOb6FctLfis5bbzvOihugg3B9O42bYOh_ZZQ2YBmUB7arwW8BIg9PMtFNGQBXTSHZ_r1xBuF5tCIWiv05UrGaAxQ4IH7n3Vu6UXo7r6Do9TmxvOQ7FxxEPbrSZQfLrFje5r1J1cts7I3PZrlZP04OmcltOzCJMKOedGu2BlDr5mBozvLsMVyDpmx-nD_pVeYVWZuwsWTdEK8hL_NWlg",
    alt: "MacBook Air M1 USB-C / Thunderbolt ports detail",
  },
];

export default function ProductDetailPage() {
  return (
    <>
      <Navbar activeHref="/product" />

      <main className="mx-auto flex w-full max-w-[1200px] flex-grow flex-col gap-12 px-container-margin py-12 pt-[calc(72px+3rem)] md:py-20 md:pt-[calc(72px+5rem)]">
        <div className="flex w-full flex-col gap-section-gap lg:flex-row">
          <ProductGallery images={GALLERY_IMAGES} />

          <FadeInSection
            as="div"
            stagger
            className="flex w-full flex-col justify-start gap-8 lg:w-[45%]"
          >
            <StaggerItem className="flex flex-col gap-4">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface">
                ELECTRONICS
              </span>
              <h1 className="font-display text-[40px] font-light leading-tight text-on-surface">
                MacBook Air M1 — Used, 8 months
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="verified" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                  Verified by CAC
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Used · 8 months
                </Badge>
              </div>
            </StaggerItem>

            <StaggerItem className="mt-2 flex items-end gap-3 border-t border-silver-border pt-6">
              <span className="font-heading text-heading text-on-surface">₹34,000</span>
              <span className="mb-1 font-body-md text-on-surface-variant line-through opacity-60">
                ₹72,000
              </span>
            </StaggerItem>

            <StaggerItem>
              <p className="font-body-md text-[16px] font-normal leading-relaxed text-on-surface-variant">
                Minimal wear, battery health at 94%. Comes with original box and charger. Perfect
                for students.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-4 flex flex-wrap gap-4">
              <Button variant="outline" fullWidth className="flex-1 py-4 text-[16px]">
                Add to Wishlist
              </Button>
              <Button variant="primary" fullWidth className="flex-1 py-4 text-[16px]">
                Add to Cart
              </Button>
            </StaggerItem>

            <StaggerItem className="mt-2 inline-block">
              <Badge variant="dark">Only 1 left</Badge>
            </StaggerItem>
          </FadeInSection>
        </div>

        <SellerCard
          seller={{
            name: "Ananya R.",
            role: "Senior · Computer Science",
            verified: true,
            avatar:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCdGZVB3FLCcCeRdcghCCN5oJVbKZlYcqvXzFFZtk7J1BPt9PlIpFqsHOmaAMWXI0yJgIJEKMRs9oxuhjEy55Jvp5gKcKLIGbHo80Bx5XYJUHXdkcSzp8vr52FMXh8vLM5snQxWCPEntoENQfHBKMa4ZFBPUTwfYgP_xDEBuGktZ71VSGRRrtaasTVqSOQkNoWlSD7WhYG1EQqMRwo6qtBoQahkjkQRI8JL9PQLOURpsV6OYcKnD2z6AhwlCGIYe5Xwyc3swarpu2Kx",
            avatarAlt: "Portrait of seller Ananya R.",
          }}
        />
      </main>

      <Footer />
    </>
  );
}
