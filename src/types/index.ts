export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  imageAlt: string;
  description?: string;
  condition?: string;
  category?: string;
  durationUsed?: string;
  trending?: boolean;
  availableStock?: number;
  status?: string;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface WishlistItem extends Product {
  description: string;
  stock: StockStatus;
  availableStock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  verified?: boolean;
  availableStock?: number;
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
