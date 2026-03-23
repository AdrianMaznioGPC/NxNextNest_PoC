import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FILES = [
  "apps/storefront/app/layout.tsx",
  "apps/storefront/components/cart/add-to-cart.tsx",
  "apps/storefront/components/grid/tile.tsx",
  "apps/storefront/components/icons/logo.tsx",
  "apps/storefront/components/label.tsx",
  "apps/storefront/components/layout/category-card.tsx",
  "apps/storefront/components/layout/footer-menu.tsx",
  "apps/storefront/components/layout/footer.tsx",
  "apps/storefront/components/layout/navbar/index.tsx",
  "apps/storefront/components/logo-square.tsx",
  "apps/storefront/components/product/product-description.tsx",
];

const BANNED =
  /\b(?:bg|text|border|fill|stroke)-(?:black|white|neutral|stone|slate|gray|zinc|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?\b/g;

const violations = [];

for (const relativePath of FILES) {
  const path = join(ROOT, relativePath);
  const source = readFileSync(path, "utf8");
  const lines = source.split("\n");
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(BANNED)].map((item) => item[0]);
    if (matches.length > 0) {
      violations.push({
        path: relativePath,
        line: index + 1,
        matches,
        source: line.trim(),
      });
    }
  });
}

if (violations.length > 0) {
  console.error(
    "[theme-guard] Hardcoded Tailwind color utilities are not allowed in theme-managed surfaces.",
  );
  for (const violation of violations) {
    console.error(
      `- ${violation.path}:${violation.line} -> ${violation.matches.join(", ")} :: ${violation.source}`,
    );
  }
  process.exit(1);
}

console.log("[theme-guard] OK");
