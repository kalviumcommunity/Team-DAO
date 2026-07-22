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

interface BackendListing {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  condition?: string;
  category?: string;
  stock?: number;
  status?: string;
  seller?: {
    id?: string;
    name?: string;
    college?: string;
  };
  verified?: boolean;
  listingType?: string;
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
