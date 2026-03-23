import type { PageBootstrapModel } from "lib/types";

export type BootstrapMessages = PageBootstrapModel["shell"]["messages"];

export function translate(
  messages: BootstrapMessages,
  namespace: string,
  key: string,
  fallback?: string,
): string {
  const value = messages[namespace]?.[key];
  if (typeof value === "string") {
    return value;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[i18n] Missing translation for ${namespace}.${key}, using fallback`,
    );
  }
  return fallback ?? key;
}
