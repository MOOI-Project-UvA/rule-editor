function parseBooleanEnv(value, fallback = false) {
  if (value == null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

export function isAuthEnabled() {
  return parseBooleanEnv(import.meta.env.VITE_AUTH_ENABLED, true);
}

export function getAuthApiBaseUrl() {
  return (import.meta.env.VITE_AUTH_API_BASE_URL || "").replace(/\/+$/, "");
}

export function getEflintApiBaseUrl() {
  return (import.meta.env.VITE_EFLINT_API_BASE_URL || "").replace(/\/+$/, "");
}

export function buildAuthUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAuthApiBaseUrl()}${normalizedPath}`;
}

export function buildEflintApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getEflintApiBaseUrl()}${normalizedPath}`;
}

export async function login(username, password) {
  const response = await fetch(buildAuthUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}

export async function logout() {
  await fetch(buildAuthUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const response = await fetch(buildAuthUrl("/auth/me"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
}