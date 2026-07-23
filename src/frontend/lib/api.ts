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
