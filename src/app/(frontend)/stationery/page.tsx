"use client";

import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { ProductCard } from "@/frontend/components/product/ProductCard";
import { Button } from "@/frontend/components/common/Button";
import { ChevronDown, X, ArrowDown } from "lucide-react";
import type { Product } from "@/types";

const STATIONERY_ITEMS = [
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDJcsucDxHT5FufOAY15fJvqa6_ww54LdxeGL4uorwsRfGv05hRpF76w2-4E-nNOCPP5GTC5gysMexfRA-kwVYdxmUisc1C-9Wv4Yr2HsQS9m2knfQVGq3RnefH6QBTKffKvFc1QxgK6lyv3CAWGcrv2WhBgKipZOQjMmsdzHNuVO7CKwIR8_enZI09wcrIHZjI0QIdHjpSGQbr7I_EXmzFO85SXihx91eD9R81fLBLaMkmCI2ihbf6wtoi1zp7VjL7qxKTd8NC9mp6",
    "name": "Minimalist Notebook Set",
    "price": "$24.00"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCo7pxI8shFOzcBC9aL-rVtQ2XIGOSRPXdeZPCMY7jwunYkTZYPER1fL5-QGCZqcab6xLzGlPF3gYwKhG3jO_5b-xSgJ1B6nuXnamaBz2ghT0v-_3JqZRya5d1dlBpQSDmVs7jmCVxfBwwfl107dwhfk8bVeBC6kgxM_1mX1ayIRViaSbfO31sL_WQca_q_9mCeJa6PojggyopL56XD3X6wI5RRjVoOJCqGQ5ucCGNRueBA-l_LOht4Jfdh1r75lwy8kjchbHd_w77Y",
    "name": "Pastel Highlighter Pack",
    "price": "$12.50"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCR8jucx_mqKqx70uEhMxezT_VHoQOMQ3R9jWPGTtxop0FntecBjVIKu2RWjeD1wzLIiSbaazNm2f3SNEdfBuVCPHBCUZ1UesjGgfORCteHgM0-85YUtUnFVcn1h3YUDFQqqL-UtE3d1BQi67h3TKj6-Wdsne1_gqF30ivukeJ-8TPSfMrvuJjrlpDq6lB3dvQ8mGbFY_MiTggXgzymKia_FIZRtlBCKc_qBSSgIYEQWYko5zJ7n3VytJm0V8L_wghXE0Rfco9Y-oyh",
    "name": "Pro Mechanical Pencil",
    "price": "$18.00"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuD3AYETW9ThdqhLTR4txicYZMIAaMOl5843bEtQKj3D4YsQZQlkSDQCjzdmZ_gDBEPo-fQfsRbDPXqI8-lw_g3rd31Q39ZG0nLqaHX0K-Ks3kcqHVfln--G5XNZYRa3pHwpt6ls0GJf3yLVSyFkoHMNLfUPnLVaQAW0dNyucEkaYKrmAmJtLupGrAVRYJZqGpxZJVqMkhUSDYIpZ7Zqdn3_hOJB8CXqKWK_dEsPkf1b5Wpo5awP7KHkXGtbpsG7Nq5FgywYtyXnSSD1",
    "name": "Desktop Stapler",
    "price": "$15.99"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAU0zhZY2X4T1uVACOM0MMZtg1TPBmgUaPLLK0Cx2ebdc9QjWAqsNxtS-esG5P-0VpTRMHq5cMpVTvkVkS6HGYHaxJmBDgu1boVq8o5ITP-fRDkYPsKHeHlZ_1HQZaiukooTP9vlfhy-uQYasBg2q6WHKfbrPoIEestn_BS3IQpXnB5i-L8-xxhIDk5G8V0GhZmANOSlVjfONif-DrXz-leSevgZoWfYjd0kf3EjWn2M91s_4xSMXnviqG76S7YjyKeEG9G7gWBAq-R",
    "name": "Sticky Note Bundle",
    "price": "$8.00"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDy7BTe9-fwwXI2nwfq9IGhEaNN19NQK92kLEri6uEKv1LQZJnh7oKmL-s-GO2cDepGznl3LHk0KycS5tUVHZI5bovPVdt6_Nto9t4pM9E4mZoWPdh06J8buvic7juQwH1U2mVVRTNjG1iVY1kqGXZH48rgQq40x_h0FEChmSMCdAmv0Ykr9DkKgpCPgbwiSg8e_P6ynen502Vg9vXVl-op_h2O8zHQpsd3TxDZKZrPyc_uLdB0Feii1Eb6yFyTUCzZE1womcyupLrD",
    "name": "Metal Geometry Box",
    "price": "$22.00"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBuMHQStGzSd_qZ329w75XaHu1S7a4mndl6yONoX9X2VThe0s02csR5sbGiF0KE0YKd2_4V3BSP6Xn2ufSMOTzK2q0o2r9UuJB-7GRgresxirg46vdnu3R5G4X8HFZlKIKJ_cx7J_AcW-Q_ziiLwxQQnNuDjyy6Rd5QxUD90hodUg-Rwq9kBL3JOgoadrjKYnXXkQqGcXCwnYGFHUw8SDECHoqFWBT8wf9HjB6NVKF5r7f7f_HqqYQMN8BvmtqUf7DzwZDwXo-fpQfm",
    "name": "Mesh Desk Organizer",
    "price": "$19.50"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDsvwEIxRVI42UrgGcxXAHq-QqPHl2_vNDxsU8t3e_AdZZed_Flg5eRQIjfESTLaIaSE89YPYxlvubi03ygBcFVyg78ER3CYR_8EsvEhi1jgRKNkoEoP7gaX22QjV0VGbn75WpxWZGItzgAVkkW-_CtWK1YxseETsQbf_tA8Ec505zWrwUJnX4_15YinmwVhJSLq-zQJWsEwCo7YEQGQ_Iv1C1dNTRPEN_LV2td2J-wVt3K4CDWi6ALxH6KEwqlOVAXbS4IKw7D74Ob",
    "name": "Index Card Pack",
    "price": "$4.50"
  },
  {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCSqfg68Ri4s9f7sVwR2HqgXnVb48KfBxiGbalZ4z3XSP3IjE8J_PInTPiGkJpF8ku6Z3_ElzlyClW6CsbBckN88UDbO0fWvXXduI8GcckS3j2pdYrQwQ_Dyj172ia4AFlwL3IEPZ9KxVz12bVl3faEjZTcIzM67kbGXPaetOeWjuHHycHIQPreygREOCJv2uxWlkxLRxOKH6WBwpKyXOxki2sQsyGNzMgxQfnJ6eMIhPcFvwjLmmGVgk1k7u_rp2JnKzvahEzFIMTK",
    "name": "Scientific Calculator",
    "price": "$35.00"
  }
];

export default function StationeryPage() {
  return (
    <>
      <Navbar activeHref="/stationery" />
      <main className="max-w-7xl mx-auto px-container-margin py-section-gap pt-[calc(72px+3rem)]">
        <header className="mb-12">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">BROWSE</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[48px] leading-tight font-light text-on-surface">Stationery</h1>
              <p className="font-body-sm text-body-sm text-eucalyptus mt-1">68 items available</p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <button className="h-10 px-5 rounded-full bg-lime-gradient text-on-surface font-medium text-body-sm flex items-center justify-center gap-2 transition-all hover:opacity-90">
            Type: Notebooks
            <X className="h-4 w-4" />
          </button>
          {["Condition", "Price", "Trending"].map(filter => (
            <button key={filter} className="h-10 px-5 rounded-full bg-cream-paper border border-on-surface text-on-surface font-medium text-body-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-all">
              {filter}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>

        <FadeInSection stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {STATIONERY_ITEMS.map((item, i) => {
            // Map the simple object into the Product interface expected by ProductCard
            const product: Product = {
              id: `stationery-${i}`,
              name: item.name,
              price: item.price,
              image: item.image,
              imageAlt: item.name,
              condition: "New"
            };
            
            return (
              <StaggerItem key={product.id}>
                <ProductCard product={product} layout="compact" />
              </StaggerItem>
            );
          })}
        </FadeInSection>

        <FadeInSection as="div" className="mt-20 flex justify-center">
          <Button variant="outline" className="border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-white" icon={<ArrowDown className="h-4 w-4" />}>
            Load more items
          </Button>
        </FadeInSection>
      </main>
      <Footer />
    </>
  );
}
