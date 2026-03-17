const DEFAULT_CART_COOKIE_NAME = "cartId";
const DEFAULT_CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type CartCookieSameSite = "Lax" | "Strict" | "None";

export type CartCookieConfig = {
  name: string;
  maxAgeSeconds: number;
  path: string;
  sameSite: CartCookieSameSite;
  httpOnly: boolean;
  secure: boolean;
};

export function getCartCookieConfig(): CartCookieConfig {
  return {
    name: process.env.CART_COOKIE_NAME?.trim() || DEFAULT_CART_COOKIE_NAME,
    maxAgeSeconds: parseNumber(
      process.env.CART_COOKIE_MAX_AGE_SECONDS,
      DEFAULT_CART_COOKIE_MAX_AGE_SECONDS,
    ),
    path: process.env.CART_COOKIE_PATH?.trim() || "/",
    sameSite: parseSameSite(process.env.CART_COOKIE_SAME_SITE),
    httpOnly: parseBoolean(process.env.CART_COOKIE_HTTP_ONLY, true),
    secure: parseBoolean(
      process.env.CART_COOKIE_SECURE,
      process.env.NODE_ENV === "production",
    ),
  };
}

export function serializeCartCookie(
  config: CartCookieConfig,
  value: string,
): string {
  return serializeCookie(config, value, config.maxAgeSeconds);
}

export function serializeExpiredCartCookie(config: CartCookieConfig): string {
  const parts = [
    `${config.name}=`,
    "Max-Age=0",
    `Path=${config.path}`,
    `SameSite=${config.sameSite}`,
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];
  if (config.httpOnly) {
    parts.push("HttpOnly");
  }
  if (config.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function readCookie(
  cookieHeader: string | undefined,
  cookieName: string,
): string | undefined {
  if (!cookieHeader) return undefined;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const name = trimmed.slice(0, idx).trim();
    if (name !== cookieName) continue;
    const rawValue = trimmed.slice(idx + 1).trim();
    if (!rawValue) return undefined;
    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }
  return undefined;
}

function serializeCookie(
  config: CartCookieConfig,
  value: string,
  maxAgeSeconds: number,
): string {
  const parts = [
    `${config.name}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    `Path=${config.path}`,
    `SameSite=${config.sameSite}`,
  ];
  if (config.httpOnly) {
    parts.push("HttpOnly");
  }
  if (config.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function parseSameSite(input: string | undefined): CartCookieSameSite {
  const value = input?.trim().toLowerCase();
  if (value === "strict") return "Strict";
  if (value === "none") return "None";
  return "Lax";
}

function parseBoolean(input: string | undefined, fallback: boolean): boolean {
  if (input === undefined) return fallback;
  const value = input.trim().toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseNumber(input: string | undefined, fallback: number): number {
  if (!input) return fallback;
  const value = Number(input);
  return Number.isFinite(value) ? value : fallback;
}
