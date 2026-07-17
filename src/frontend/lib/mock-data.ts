import type { Product, WishlistItem, CartItem, VerificationListing } from "@/types";

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: "calculus-textbook",
    name: "Calculus: Early Transcendentals",
    price: "$45.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAT2rSE6tutRRySlrFGps4FxNv8mRWJT4obM5cmPj8fCzEdKez8U11pnsWteDqyjEJRl5qvJKCc723kFnilkwVyNC8oOpQMAY0uykLySvMN1fv7xFyXsAfli5vbXDTY5tMh14U6yParDIdhIufrsB-3e9rmZWEiwpKYK4NgKEZc-MJanFxTTiTHQKRG6RC1AXAMd8Qukqju7wedKwsu-J9sTJHoaGeVIhpi9QUCLHbLP2XN7rUyQQOy3LZ3Bfs0uuA0FMaq96t6j2Nl",
    imageAlt: "Calculus: Early Transcendentals textbook on a white background",
    trending: true,
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2 2022",
    price: "$850.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVXI0km4gKCsHrTvDB7UYFkPCTvG5RPRG8AInkth1R1oBN7g5mFjW3J0_aLVCksmhDfi_g7viwm83mIh_VY03om8BHiCeRhIsLPh_e2HFDCPWiwFcd75rGyntZQLp5bbzahe3uD6U5U3CLluW0MFCngKOLccDFo_usTXBD85luvCPW4iwd_D-yo1WgjxLqDwmbb23RuUpZlwHNSFbbFV1lMq0eGnhdawI1kNQd9EvmqcVGp0msGcUbf9WvXXcFJ_7Ibl7_9PaDZJNM",
    imageAlt: "Silver MacBook Air M2 laptop on a white background",
    trending: true,
  },
  {
    id: "ti-84-calculator",
    name: "TI-84 Plus CE Graphing Calculator",
    price: "$95.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC37qcJNpUdr-R5YxWgO3inqO6KGtd2yuy4AjbOPccE9SJzK2r5piGXMT6JzOj8njpt_h_wKY-cxAHqlGfyHddoe1EEK3cHypzDlvNuqDGKBjOuzfBOpiseNnav4oFMO43QRgDWF59AsMQdCXfjJo0SL_1RKJLBjeOyaNctVjrU5maJcyyZNlsIwYbhbwLcsxYdkwFazbqLZ0A10logEVhp3H1rTX8KKrs-Zc6b2GBkG0mmybHuIttIutdLyqm1q1n9lTbQALqlbZGp",
    imageAlt: "Black TI-84 Plus CE graphing calculator on a white background",
  },
  {
    id: "herschel-backpack",
    name: "Herschel Classic Backpack",
    price: "$35.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtm2a9Oq1iaL5qZ8P9CWwfNaVdNkw3WyhHXNO2ARg3YxwhqRE4TEGAdJi655r5xG7EYWIY3tCKJAA1tQKWnZ7UQppKgTHKajw3q9z5NodP-Mh4JJ3PqqyKIyCZ9VxY6IPA2aLtD7Iz089JoJRXJz8jhLJLQbE2CMI0Zq8dbQYDtsf4oX9cbkwwdQZne0oaD_bwtfFhs7o_13fNStAm0B2x0wtRG2-EfgenY_g9_3QOK9nAdKA_U-wGLNdagxyBEDDi9-5qAJfrZNSb",
    imageAlt: "Sage green Herschel canvas backpack on a white background",
  },
  {
    id: "sony-wh1000xm4",
    name: "Sony WH-1000XM4",
    price: "$180.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-8cwkHNo6ztAJvftk7herVBCKReDlEgJEl2O-tCHvf5opZOphsgibIISHnAqrLp-njlx6OFWHdc_bPY06UmVpkuaAgtzQTpHg4o2qaqkpkRPaO1pP9he48XUn8YVnU4mSNwJCobqOLqEy871SL6y57q_Ced0cafp2fAIAmCshqhc8XjZoq6IjW1_GACxAawQvRJ80SfX35qmnXAFFgFtID8RfVbm0ZGDb3DddRhn2Cwx8L3PAmPv3cm8K0Lj9PyFtXq4WG8Rxxs2J",
    imageAlt: "Black Sony WH-1000XM4 noise-cancelling headphones on a white background",
  },
  {
    id: "led-desk-lamp",
    name: "Modern LED Desk Lamp",
    price: "$22.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9bJ3tIWbjdRTpUB7PEy9jMa13H9aWxNdJZwogGB2aDUuddJ_FbBPn8miRA8ihdHJ0CyN1p8OEz3MdLxWqs5ETFT2P85YkQGcU9mNH30paOeNXay6KtFXi9GBI4dqguQn6wOjdC4mu4wkeA3kuMQ9F0T4u5iUNNJxpYK8OqlIcnRdtliRjDMJByU2KeavUnJKuRN-N2RMjvtgg7yAlKRZQEonIwqmnqjCeef8yxBfprYzj2xox5Up7MTFczgAK4z-LnH9wMsfDZ6W",
    imageAlt: "Brushed silver modern LED desk lamp on a white background",
  },
];

export const BOOK_PRODUCTS: (Product & { condition: string })[] = [
  {
    id: "advanced-calculus",
    name: "Advanced Calculus: A Geometric View",
    price: "$45.00",
    condition: "Used",
    trending: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUadn9Rn9EYmMq-t4hsuXONy6jg9b0x8ROg06uct3VgB4TO7V_QWtMkGMcUp7-49NlNLqrpdJil5da3gZKLhDCPwLazEZaXhtSoJ5Vf-WJLqLsAQ4U0V9whyeEkV5BvlfDvAowuzC-d-v-F-ZCcJZRwm1ShpRqLbjuC6RRt4fSJoUnX8CIP61KTLsxUtHkWN47UMigGvlMSMo3wCfobsC3cDvqY09IRC8fAt1uO7j55bG5u_Q03EPLiw5-n08lORuIFsC70kezErUe",
    imageAlt: "Advanced Calculus hardcover textbook on a light surface",
  },
  {
    id: "design-systems-book",
    name: "Design Systems & Botanical Aesthetics",
    price: "$28.50",
    condition: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5y7a99kboJoNjrT5gbwIvQehcel3nR-mhbLDQDq4-DCNwJQWSSfjjIlNkuqLDaPNgxDJfAlVLSvLoLE2_PLEJNNmJskD_gvAoL6OwblabE5PzE35-DW06KV8y8Mnsw2QRufPfPhTqeVe2KrUS9RCoFYelaXoXrnihRoR_i70P9bUUvKEPrYM5L6IC5RSWQm-SnEmpiQzHojCQQl51TE1C6jQkeoOJDaPbg1J2M7wt8np4aaOzejdC3-soF67vss5vcAhbp9KZbENa",
    imageAlt: "Minimalist paperback book with typographic cover",
  },
  {
    id: "architectural-drafting",
    name: "Introduction to Architectural Drafting",
    price: "$15.00",
    condition: "Used",
    trending: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnmvO8k_Fsl4rygrwAn58Xi_AgAvEKsnBtR_5X_P1waOQnTmilHTOeFE4S2OlE8xuJGkYZyM-9g5dsONAKyVqjvWP7zwYhuet0aFkSrLDWRcKW4KYKKPrKc7QjxgnUnG5nFJEOvdyAwXpmPHO2akTsRC4iCRTIOwBpEv0-XoAa11twvs9FEDNZY7tWcQUesTRBU4kY7un-_YAQM8J2GUOSdNkKEkh7E4bV8DwroPRyoqgR3EF-c_KsPKMyDlNlPfGaDBg7JY56HdD4",
    imageAlt: "Spiral-bound sketchbook with charcoal drawings",
  },
  {
    id: "grays-anatomy",
    name: "Gray's Anatomy for Students, 4th Ed.",
    price: "$65.00",
    originalPrice: "$110.00",
    condition: "Used",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoftLfkHV-Dw82v4-jqAXZOQ_pNsERRXzt0dsIcWUgYoa_da07CHwo-erZLZq2p3XcsSI92lQ8qc97mlQ7MSpygCr_WMZAJ8q2__gHRtgtvux9Gh6kE3wZZBdCDJu5PKmVDFec6YlX7LGnP3ehQdQAP_X9oTtc6_uuUc3HlkIP-C9O5wjEwyQvr_87w_5GbyOFcSqDjuUq8DrzaQMRfGwdIIHC_thxoi1ssps_WEpja7YPpxJ2nAfrDZAkF86UvBkgNK3ufei50rT5",
    imageAlt: "Medical reference textbook with silver foiling",
  },
  {
    id: "leaves-of-grass",
    name: "Leaves of Grass - Restored Edition",
    price: "$18.99",
    condition: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu2omakkrgK7X9ggl_HSSWZYo_aZ5G6q_-eXxrL2e7mTgf8dioF0QaTDVn50mnTscOEZkoC8pHOVfSTUTsL6TDTOf7alvmx34zQAZn1vlgjR-KfoJ8Qn6V-n_xPBAFquKYyjGL4aAUipTa0qA7AFLSnOfOPdVGsKTG0PNWT0HFLPvVSIgF4S_oIH-GCwOTJIcb4C342AYOl_lT_e8c6QGXanOTIgX49yfgPd7A0bhSUpcRpn6-VZKdT-hlMWSm1z39IieS8RIlPV_B",
    imageAlt: "Slender poetry collection with watercolor cover",
  },
  {
    id: "clean-code",
    name: "Clean Code: A Handbook of Agile",
    price: "$32.50",
    condition: "Used",
    trending: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_F89oG87hercWM1xUs_Q0pbgVu9ynOUVwItog4bRyOELhxF6wnzmPaTObC0F3kIPIBf1JgFq4svRXflucB5jTifl05WbD_KRC0Kl0Vuh8lSGc6lriwFQUhjUFIdKewVhhEhgG9lGrbaQTc874BpOW_TqErvvNg5xRl4xS5LG34m6rsX8FcH8iA7PlXlWWfIb4Af2Ey81XNbiAX0EcIxWt8rwZu7Fkktk_XEEVWk3ppmYTneINAh3OqP4X-xIbaZPvwxTlQblLTKWR",
    imageAlt: "Software engineering textbook with bold typography cover",
  },
];

export const WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "macbook-air-m1",
    name: "MacBook Air M1 (8GB, 256GB) - Silver",
    description: "Excellent Condition • Used 1 year",
    price: "₹34,000",
    stock: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCqOF_lqk3njELVyOIpfVR8GaS8JLDRw0outQ_Hh7EWYUC3_R2-t8N695QKS5ZDrlvliLJwCAqeX86SQAM5VJTDV7XzxOenag3ol0kPyH7AuQSqo3p5K8cKyN7daUHJjzXRUmYeZoRtKEsdnChc1tBwaxfkv9u5qXOxEFWs-tCAh_l9TT0cRIqvNwqH66wKqJDvbkLoCgeTcKHvB4T4RV9HqLD8jpEttzIilXFytnBoReG-tth5439weIDvWUJKZWIRHeH6gYOVjXE",
    imageAlt: "Silver MacBook Air M1 on a white background",
  },
  {
    id: "ti-84-wishlist",
    name: "TI-84 Plus CE Graphing Calculator",
    description: "Good Condition • Includes charger",
    price: "$95.00",
    stock: "low-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPRszQFS4y3l7Ele-onpx66mtZ1Rl0BzEc3eSUO3Lj45f1Lmd_yxlRPvafutgMVgXLZkPOreoGNEb_HCblRVkt8xu61hxiqOxwcLkI8DCqV-MB4aq-U-AYPV3sWe8zpY2wVvaYgz31RCDoJv9LG0n6oSJWt-4brm4vLgQkogi33s3Pz1K8H7d30_n7eb-TIKCyrplFYSHJajZn3KJ0qtuXqvdqmMzZ9vBIOC20e65h7gLz_8pCPiqNNsk1CGkPgMkZUgbePcWhwy9x",
    imageAlt: "Black TI-84 Plus CE graphing calculator on a white background",
  },
  {
    id: "sony-wh1000xm4-wishlist",
    name: "Sony WH-1000XM4 Noise Cancelling",
    description: "Like New • Midnight Blue",
    price: "$180.00",
    stock: "out-of-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEhz5Kq9wknvviIgzWDuFy2I2Bend9mTs37DOJGXZgmKgnn5X11PjxW-U4H_VDrGEQgs4HyLuKwG_N2iA__8s0x4T_Ywi9C6UPL0z4M63gWSWpjAPBJfzau6LxgYDIpWYNfW--aWxWQdGnECFIIfCTzuxx47NnCNcpQlRonLFn6D0SWkzvd166sHjAP2fOxslkxSM34cM7vTQA1slBlfyDb9fVySpybfL0EVXrscNciy9VT6Ky6r73idCJsYfFNruIijkEVoYzq__E",
    imageAlt: "Sony WH-1000XM4 headphones, desaturated to signal out-of-stock",
  },
];

export const CART_ITEMS: CartItem[] = [
  {
    id: "macbook-air-m1-cart",
    name: "MacBook Air M1",
    price: "₹34,000",
    quantity: 1,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwYAPQoUjqXHNmacXeEonFXnKWrVxnJfjTnhdffjg-Xcl36FK0X8AAHqkfmFPuCUW6un61UBhWpAxUKeqM3R0MtjpdsH3i7los-hMUPpqMv6NQu-jox53IFnt6yiTOkply6snf3elNlUTVHVl0DCTrpYAuTB6iOlyEG0cMjFfEiuXJqPnMmscSyO7UAAWMwsEZYVJv_vR9Hvu6EM_qWHWISi5mzBC4tEOGI6vE-exahv68n2osLOHeAITxGOUztr3VGFUujIZXjijA",
    imageAlt: "Silver MacBook Air M1 on a white background",
  },
  {
    id: "ti-84-cart",
    name: "TI-84 Plus CE Graphing Calculator",
    price: "$95.00",
    quantity: 1,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTSoiX6eDtEkpk3DFNUeWqkPITKdZnoznehKqV74tDH3JcrHP3CkLksczAByHIVwUbC9CyxT6_bPTHI-LtGU9h23MUjR7BOZNOTXAqKxKeE-02AtFop-RpcffbhIKhbgnPhniZ_zXB9-EdS9HT_XtCbFW3oMegSHh3tHxlziXs-7pMc4hdccrBgQBdzCeJWz1M02xEQCzrxrTGH0K6gGznDMO6YOBBf39ci04cFskDDi0Xrc6QuwPrqv179trCrV5TZEpsulOJSaMf",
    imageAlt: "Black TI-84 Plus CE graphing calculator on a white background",
  },
];

export const VERIFICATION_LISTINGS: VerificationListing[] = [
  {
    id: "desk-lamp-verify",
    name: "Minimalist Desk Lamp",
    description:
      "Sleek LED desk lamp with adjustable brightness. Perfect for late-night studying. Minor scratch on base.",
    price: "",
    condition: "Used · 8 months",
    status: "pending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_cwLq_nCAh2aMosA1MeCuFaU_04-TWUA2aV4xwcVUcVwpco4cUPAl6VtuoCH8hsrqq4q_e0vgyGPabE0W5UyOskGf8lLr6lKVWPWTcqoqNZSe-h7zi0GNq9qK1A6yDUkbzFH2K3TQWTIv8ykdAC-l2SUfMeYgE8AZE_ERrOEBqKRj4Sxzs2mvUI8kyhzzDU-FEpjnrMtYEaUYZIMb5cV0HcJ-mmeJv5oCphpGjyiLyZ3nv88jQtma6K8lmDngmm8KJn8UhfLNB1QJ",
    imageAlt: "White desk lamp on a dorm room desk",
    seller: {
      name: "Alex J.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCT97jlg9CTxIvpde6PllY3kmP6zNx3l_X8FNfYGLz-dv1fYo8S_7B-oVNOh3QvY4gyJwgW06rMJVAVxgnGF1Ha_q_uT_eCvtaTR68eeRIwqwRbM7PUECSXsL8Gz8EtzivEDg1KktJyfYdftsmL-1-ttvBts17KZKmHqemzN4SHOqmpXOAlEWRLKhtQu-PWnNNclFgyn3yOSaZowLRUPkJNaZLKSCdW6JwjiZdj1VyJVw6BVbj4hceqAQ2INWXxgQACakd7GYx6A5u",
      avatarAlt: "Avatar of seller Alex J.",
    },
  },
  {
    id: "backpack-verify",
    name: "Adventure Backpack",
    description:
      "Never used hiking backpack. 40L capacity. Excellent condition, moving and need to sell.",
    price: "",
    condition: "New with tags",
    status: "verified",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbsEFY3BznpIcEfxelZdw-D23pxqpg7P5j5G0H1iDULny1ax1PASiKiTfrwjBxI2a4P9jNZUyJp528Bub7bMkx7C35tvLTRj7E_shhN3bQKiNSYItPNR4vtRqX2D-qtDmvVHYRZT537cMv3S5svi4gFZGq3nhaLp8J1CrOwUicIeYWTev4-Jdx_THv4JEoSLz5fC9uV9oeZmepw-tdywm2B5hrUKlHs1v0Gr54asysTg9hz-DAbB8KCaY9mi2J-48Khg84A_hFeqpp",
    imageAlt: "Canvas adventure backpack against a white wall",
    seller: {
      name: "Sarah M.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6Uo3ream69tKWGOVb8cYHoVbQ9s8b1td8G7Oxe_Ew6tkS3dCW4t4WT6-Y6nlCYiF3fsFOwezUtYENi081FbgqrIpfLVsMZWNH5CzeLeTlNvv_HobKtDso6I29iEN4cW1diHBKwuSYhYt5XuF2oi-MHM_uNso9y1RfVCVjniAXQ0lsTlgBICYm0a1Vd1S9waXfeZ51rLlbGvhOE8nKWRd7w2GxiWeumm5DFngDo6wUycD9izwt5tcpFpnho8z6rGNL-aA5_3rxmoKg",
      avatarAlt: "Avatar of seller Sarah M.",
    },
  },
  {
    id: "ti84-verify",
    name: "TI-84 Plus CE",
    description:
      "Standard graphing calculator required for most math courses. Works perfectly, comes with charger cable.",
    price: "",
    condition: "Used · Good",
    status: "pending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFuc7UMUAsWUDE7FL6vix4RtcVPnJG40A74St7yKERKjTyLos_Ofy6rB_bvzKZhRI4WpIcxxxgtIr_iDtCq0c62ukplmhLuvZDqE74rsy_rdYAwyzRXVax2znXyZXcdOFgylX9x1L4Uug96zszneZV38aNwBqUEjOKb9LRpIeTdnkcqR-7UHnvHse5cwH2OmM3Zsc1AnppPZJ_J9R5_DBqG4yzqrviQErGuLdznkyD6Rvm8F5qdgPHCetMEyqCKVhPs0SUh7LvYKda",
    imageAlt: "TI-84 Plus CE calculator on white marble",
    seller: {
      name: "Chris T.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYi3vbknPGMzNyYozdTTU9Eb1hbfHHyAltoXzMJLBCxrabBKN-NB5LAv_abl946ZxLiXx0QkZZBf5jZxoBWzGMb9m64Yutx6XCEtNGWhh3RpuQJY6DqCTcUBynSqyV6UoWlS8Nvxw2A24deFLCJilUD9TRicKZvtbaa3nYWzRwXAOs3y2Fa3WvZXSPz3uNYv3lpF0mXOfIBW28HNL3nn64cDjfWqtFZ4mCtFcIpSeFA99-Fi_XH8X2uQkyei4Kcx9Erif4Da-wTDcZ",
      avatarAlt: "Avatar of seller Chris T.",
    },
  },
];
