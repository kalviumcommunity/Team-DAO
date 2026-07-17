export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  imageAlt: string;
  condition?: string;
  trending?: boolean;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface WishlistItem extends Product {
  description: string;
  stock: StockStatus;
}

export interface CartItem extends Product {
  quantity: number;
  verified?: boolean;
}

export interface Seller {
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  verified: boolean;
}

export type VerificationStatus = "pending" | "verified";

export interface VerificationListing extends Product {
  description: string;
  status: VerificationStatus;
  seller: { name: string; avatar: string; avatarAlt: string };
}
