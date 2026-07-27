const API_BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
import type { Product, CartItem, WishlistItem } from "@/types";

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJsonResponse = contentType.includes("application/json");
  const data = isJsonResponse ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
          ? data.message
          : "Request failed";

    throw new Error(message);
  }

  return data as T;
}

export async function loginUser(payload: { email: string; password: string }) {
  const result = await apiRequest<{ token: string; user: { id: string; name: string; email: string; college: string; role: string } }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  college: string;
  role?: string;
}) {
  const result = await apiRequest<{ token: string; user: { id: string; name: string; email: string; college: string; role: string } }>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
}

export async function getCurrentUser() {
  return apiRequest<{ user: { id: string; name: string; email: string; college: string; role: string } }>('/api/auth/me');
}

// Mapping Helpers to bridge DB schema to frontend types
function mapDbListingToProduct(listing: any): Product {
  if (!listing) return listing;
  
  // Format price
  let formattedPrice = "";
  if (listing.price !== undefined && listing.price !== null) {
    const numPrice = typeof listing.price === 'number' ? listing.price : parseFloat(listing.price.toString());
    formattedPrice = `$${numPrice.toFixed(2)}`;
  }

  // Get image and alt from title mapping or category fallback
  let image = "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=300&auto=format&fit=crop"; // Default book/product fallback
  let imageAlt = listing.title || "";

  const titleLower = (listing.title || "").toLowerCase();
  
  if (titleLower.includes("calculus: early")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuAT2rSE6tutRRySlrFGps4FxNv8mRWJT4obM5cmPj8fCzEdKez8U11pnsWteDqyjEJRl5qvJKCc723kFnilkwVyNC8oOpQMAY0uykLySvMN1fv7xFyXsAfli5vbXDTY5tMh14U6yParDIdhIufrsB-3e9rmZWEiwpKYK4NgKEZc-MJanFxTTiTHQKRG6RC1AXAMd8Qukqju7wedKwsu-J9sTJHoaGeVIhpi9QUCLHbLP2XN7rUyQQOy3LZ3Bfs0uuA0FMaq96t6j2Nl";
    imageAlt = "Calculus: Early Transcendentals textbook on a white background";
  } else if (titleLower.includes("macbook air m2")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVXI0km4gKCsHrTvDB7UYFkPCTvG5RPRG8AInkth1R1oBN7g5mFjW3J0_aLVCksmhDfi_g7viwm83mIh_VY03om8BHiCeRhIsLPh_e2HFDCPWiwFcd75rGyntZQLp5bbzahe3uD6U5U3CLluW0MFCngKOLccDFo_usTXBD85luvCPW4iwd_D-yo1WgjxLqDwmbb23RuUpZlwHNSFbbFV1lMq0eGnhdawI1kNQd9EvmqcVGp0msGcUbf9WvXXcFJ_7Ibl7_9PaDZJNM";
    imageAlt = "Silver MacBook Air M2 laptop on a white background";
  } else if (titleLower.includes("ti-84 plus")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuC37qcJNpUdr-R5YxWgO3inqO6KGtd2yuy4AjbOPccE9SJzK2r5piGXMT6JzOj8njpt_h_wKY-cxAHqlGfyHddoe1EEK3cHypzDlvNuqDGKBjOuzfBOpiseNnav4oFMO43QRgDWF59AsMQdCXfjJo0SL_1RKJLBjeOyaNctVjrU5maJcyyZNlsIwYbhbwLcsxYdkwFazbqLZ0A10logEVhp3H1rTX8KKrs-Zc6b2GBkG0mmybHuIttIutdLyqm1q1n9lTbQALqlbZGp";
    imageAlt = "Black TI-84 Plus CE graphing calculator on a white background";
  } else if (titleLower.includes("desk lamp")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9bJ3tIWbjdRTpUB7PEy9jMa13H9aWxNdJZwogGB2aDUuddJ_FbBPn8miRA8ihdHJ0CyN1p8OEz3MdLxWqs5ETFT2P85YkQGcU9mNH30paOeNXay6KtFXi9GBI4dqguQn6wOjdC4mu4wkeA3kuMQ9F0T4u5iUNNJxpYK8OqlIcnRdtliRjDMJByU2KeavUnJKuRN-N2RMjvtgg7yAlKRZQEonIwqmnqjCeef8yxBfprYzj2xox5Up7MTFczgAK4z-LnH9wMsfDZ6W";
    imageAlt = "Brushed silver modern LED desk lamp on a white background";
  } else if (titleLower.includes("herschel classic") || (titleLower.includes("backpack") && !titleLower.includes("adventure"))) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuDtm2a9Oq1iaL5qZ8P9CWwfNaVdNkw3WyhHXNO2ARg3YxwhqRE4TEGAdJi655r5xG7EYWIY3tCKJAA1tQKWnZ7UQppKgTHKajw3q9z5NodP-Mh4JJ3PqqyKIyCZ9VxY6IPA2aLtD7Iz089JoJRXJz8jhLJLQbE2CMI0Zq8dbQYDtsf4oX9cbkwwdQZne0oaD_bwtfFhs7o_13fNStAm0B2x0wtRG2-EfgenY_g9_3QOK9nAdKA_U-wGLNdagxyBEDDi9-5qAJfrZNSb";
    imageAlt = "Sage green Herschel canvas backpack on a white background";
  } else if (titleLower.includes("adventure backpack")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCbsEFY3BznpIcEfxelZdw-D23pxqpg7P5j5G0H1iDULny1ax1PASiKiTfrwjBxI2a4P9jNZUyJp528Bub7bMkx7C35tvLTRj7E_shhN3bQKiNSYItPNR4vtRqX2D-qtDmvVHYRZT537cMv3S5svi4gFZGq3nhaLp8J1CrOwUicIeYWTev4-Jdx_THv4JEoSLz5fC9uV9oeZmepw-tdywm2B5hrUKlHs1v0Gr54asysTg9hz-DAbB8KCaY9mi2J-48Khg84A_hFeqpp";
    imageAlt = "Canvas adventure backpack against a white wall";
  } else if (titleLower.includes("advanced calculus")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuDUadn9Rn9EYmMq-t4hsuXONy6jg9b0x8ROg06uct3VgB4TO7V_QWtMkGMcUp7-49NlNLqrpdJil5da3gZKLhDCPwLazEZaXhtSoJ5Vf-WJLqLsAQ4U0V9whyeEkV5BvlfDvAowuzC-d-v-F-ZCcJZRwm1ShpRqLbjuC6RRt4fSJoUnX8CIP61KTLsxUtHkWN47UMigGvlMSMo3wCfobsC3cDvqY09IRC8fAt1uO7j55bG5u_Q03EPLiw5-n08lORuIFsC70kezErUe";
    imageAlt = "Advanced Calculus hardcover textbook on a light surface";
  } else if (titleLower.includes("architectural drafting")) {
    image = "https://lh3.googleusercontent.com/aida-public/AB6AXuBnmvO8k_Fsl4rygrwAn58Xi_AgAvEKsnBtR_5X_P1waOQnTmilHTOeFE4S2OlE8xuJGkYZyM-9g5dsONAKyVqjvWP7zwYhuet0aFkSrLDWRcKW4KYKKPrKc7QjxgnUnG5nFJEOvdyAwXpmPHO2akTsRC4iCRTIOwBpEv0-XoAa11twvs9FEDNZY7tWcQUesTRBU4kY7un-_YAQM8J2GUOSdNkKEkh7E4bV8DwroPRyoqgR3EF-c_KsPKMyDlNlPfGaDBg7JY56HdD4";
    imageAlt = "Spiral-bound sketchbook with charcoal drawings";
  } else if (titleLower.includes("lab goggles") || titleLower.includes("coat")) {
    image = "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Lab coat and safety goggles";
  } else if (titleLower.includes("chair")) {
    image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Desk chair";
  } else if (listing.category === "Books") {
    image = "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Textbook";
  } else if (listing.category === "Electronics") {
    image = "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Electronics";
  } else if (listing.category === "Furniture") {
    image = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Furniture";
  } else if (listing.category === "Accessories") {
    image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop";
    imageAlt = "Accessories";
  }

  // Format Condition
  let condition = listing.condition || "";
  if (condition) {
    condition = condition
      .toLowerCase()
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return {
    id: listing.id,
    name: listing.title || listing.name || "",
    price: formattedPrice || listing.price || "",
    image,
    imageAlt,
    description: listing.description || "",
    condition,
    trending: listing.verified || false
  };
}

function mapDbCartItemToCartItem(cartItem: any): CartItem {
  if (!cartItem) return cartItem;
  const mappedProduct = mapDbListingToProduct(cartItem.listing);
  return {
    ...mappedProduct,
    id: cartItem.id, // the cart item's actual ID
    quantity: cartItem.quantity || 1,
    verified: cartItem.listing?.verified || false
  };
}

function mapDbWishlistItemToWishlistItem(wishlistItem: any): WishlistItem {
  if (!wishlistItem) return wishlistItem;
  const mappedProduct = mapDbListingToProduct(wishlistItem.listing);
  
  // map stock status
  let stockStatus: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
  const rawStock = wishlistItem.listing?.stock;
  if (rawStock !== undefined) {
    if (rawStock <= 0) {
      stockStatus = "out-of-stock";
    } else if (rawStock === 1) {
      stockStatus = "low-stock";
    }
  }

  return {
    ...mappedProduct,
    id: wishlistItem.listingId, // the listing ID (product ID)
    description: wishlistItem.listing?.description || "",
    stock: stockStatus
  };
}

// Products
export async function getProducts() {
  const data = await apiRequest<{ listings: any[] }>('/api/products');
  return data.listings.map(mapDbListingToProduct);
}

export async function getProductById(id: string) {
  const data = await apiRequest<{ listing: any }>(`/api/products/${id}`);
  return mapDbListingToProduct(data.listing);
}

// Cart
export async function getCartItems() {
  const data = await apiRequest<{ cart: any[] }>('/api/cart');
  return data.cart.map(mapDbCartItemToCartItem);
}

export async function addToCartItem(id: string, quantity = 1) {
  return apiRequest<unknown>('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId: id, quantity }),
  });
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  return apiRequest<unknown>(`/api/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(id: string) {
  return apiRequest<unknown>(`/api/cart/${id}`, {
    method: 'DELETE',
  });
}

// Wishlist
export async function getWishlistItems() {
  const data = await apiRequest<{ wishlist: any[] }>('/api/wishlist');
  return data.wishlist.map(mapDbWishlistItemToWishlistItem);
}

export async function addToWishlistItem(id: string) {
  return apiRequest<unknown>('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId: id }),
  });
}

export async function removeWishlistItem(id: string) {
  return apiRequest<unknown>(`/api/wishlist/${id}`, {
    method: 'DELETE',
  });
}

