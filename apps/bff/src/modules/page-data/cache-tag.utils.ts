/**
 * Augments cache tags with language-scoped variants for cache invalidation.
 */
export function withLanguageScopedTags(
  tags: string[],
  language: string,
): string[] {
  const next = new Set(tags);
  for (const tag of tags) {
    if (tag === "products" || tag.startsWith("products:")) {
      next.add(`products:lang:${language}`);
    }
    if (tag === "collections" || tag.startsWith("collections:")) {
      next.add(`collections:lang:${language}`);
    }
    if (tag === "pages" || tag.startsWith("pages:")) {
      next.add(`pages:lang:${language}`);
    }
    if (tag === "menus" || tag.startsWith("menus:")) {
      next.add(`menus:lang:${language}`);
    }
  }
  return [...next];
}
