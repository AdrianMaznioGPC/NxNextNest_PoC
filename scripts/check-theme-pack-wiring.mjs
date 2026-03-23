import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const globalsPath = join(ROOT, "apps/storefront/app/globals.css");
const layoutPath = join(ROOT, "apps/storefront/app/layout.tsx");

const globalsSource = readFileSync(globalsPath, "utf8");
const layoutSource = readFileSync(layoutPath, "utf8");

const disallowedThemeImports = [
  '@import "./themes/theme-default.css";',
  '@import "./themes/theme-green.css";',
  '@import "./themes/theme-orange.css";',
];

for (const importStatement of disallowedThemeImports) {
  if (globalsSource.includes(importStatement)) {
    fail(
      `Globals should not import bundled theme packs anymore: found ${importStatement}`,
    );
  }
}

const linkPattern =
  /<link\s+rel="stylesheet"\s+href=\{theme\.stylesheetHref\}\s*\/>/g;
const linkMatches = layoutSource.match(linkPattern) ?? [];
if (linkMatches.length !== 1) {
  fail(
    `Expected exactly one runtime theme-pack stylesheet link in layout, found ${linkMatches.length}.`,
  );
}

console.log("[theme-pack-wiring] OK");

function fail(message) {
  console.error(`[theme-pack-wiring] ${message}`);
  process.exit(1);
}
