import "server-only";

const TOKEN_PACK_REGISTRY = {
  "theme-default": "/theme-packs/theme-default.css",
  "theme-green": "/theme-packs/theme-green.css",
  "theme-orange": "/theme-packs/theme-orange.css",
} as const;

type KnownThemeTokenPack = keyof typeof TOKEN_PACK_REGISTRY;

export function resolveThemeTokenPack(input: {
  themeKey: string;
  themeTokenPack?: string;
  themeRevision?: string;
}) {
  const normalizedThemeKey = asKnownPack(input.themeKey, "themeKey");
  const normalizedTokenPack = asKnownPack(
    input.themeTokenPack ?? normalizedThemeKey,
    "themeTokenPack",
  );
  const revision = input.themeRevision ?? "fallback";
  const stylesheetHref = `${TOKEN_PACK_REGISTRY[normalizedTokenPack]}?v=${encodeURIComponent(revision)}`;

  return {
    themeKey: normalizedThemeKey,
    themeTokenPack: normalizedTokenPack,
    stylesheetHref,
  };
}

function asKnownPack(
  value: string,
  sourceField: "themeKey" | "themeTokenPack",
): KnownThemeTokenPack {
  if (isKnownPack(value)) {
    return value;
  }

  console.warn(
    `[Theme] Unknown ${sourceField} "${value}", falling back to "theme-default"`,
  );
  return "theme-default";
}

function isKnownPack(value: string): value is KnownThemeTokenPack {
  return value in TOKEN_PACK_REGISTRY;
}
