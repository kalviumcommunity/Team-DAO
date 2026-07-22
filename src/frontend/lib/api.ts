const API_BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

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

interface BackendListing {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  condition?: string;
  stock?: number;
  status?: string;
  verified?: boolean;
}

export async function getProducts() {
  const data = await apiRequest<{ listings: BackendListing[] }>('/api/products');
  return data.listings.map((listing) => ({
    id: listing.id,
    name: listing.title,
    price: formatPrice(listing.price),
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    imageAlt: `${listing.title} listing`,
    condition: formatCondition(listing.condition),
    trending: listing.verified ?? false,
  }));
}

export async function getProductById(listingId: string) {
  const data = await apiRequest<{ listing: BackendListing }>(`/api/products/${listingId}`);
  const listing = data.listing;

  return {
    id: listing.id,
    name: listing.title,
    price: formatPrice(listing.price),
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    imageAlt: `${listing.title} listing`,
    condition: formatCondition(listing.condition),
    trending: listing.verified ?? false,
  };
}

interface BackendCartItem {
  id: string;
  quantity: number;
  listing: {
    id: string;
    title: string;
    price: number | string;
    verified?: boolean;
    seller?: {
      id?: string;
      name?: string;
      college?: string;
    };
  };
}

export async function getCartItems() {
  const data = await apiRequest<{ cart: BackendCartItem[] }>('/api/cart');
  return data.cart.map((item) => ({
    id: item.listing.id,
    name: item.listing.title,
    price: formatPrice(item.listing.price),
    quantity: item.quantity,
    verified: item.listing.verified ?? false,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    imageAlt: `${item.listing.title} listing`,
  }));
}

export async function addToCartItem(listingId: string, quantity: number = 1) {
  return apiRequest('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ listingId, quantity }),
  });
}

export async function updateCartItemQuantity(listingId: string, quantity: number) {
  return apiRequest('/api/cart/' + listingId, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(listingId: string) {
  return apiRequest('/api/cart/' + listingId, {
    method: 'DELETE',
  });
}

interface BackendWishlistItem {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number | string;
    stock?: number;
    status?: string;
  };
}

export async function getWishlistItems() {
  const data = await apiRequest<{ wishlist: BackendWishlistItem[] }>('/api/wishlist');
  return data.wishlist.map((item) => {
    const stock = item.listing.stock ?? 1;
    const stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = stock <= 0 ? 'out-of-stock' : stock <= 1 ? 'low-stock' : 'in-stock';

    return {
      id: item.listing.id,
      name: item.listing.title,
      description: 'Saved from your wishlist',
      price: formatPrice(item.listing.price),
      stock: stockStatus,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      imageAlt: `${item.listing.title} listing`,
    };
  });
}

export async function addToWishlistItem(listingId: string) {
  return apiRequest('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ listingId }),
  });
}

export async function removeWishlistItem(listingId: string) {
  return apiRequest('/api/wishlist/' + listingId, {
    method: 'DELETE',
  });
}

function formatPrice(price: number | string) {
  const numericValue = typeof price === 'number' ? price : Number(price);
  if (Number.isNaN(numericValue)) {
    return '$0.00';
  }

  return `$${numericValue.toFixed(2)}`;
}

function formatCondition(condition?: string) {
  if (!condition) {
    return undefined;
  }

  return condition.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
