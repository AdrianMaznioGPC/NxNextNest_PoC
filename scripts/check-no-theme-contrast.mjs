import { execSync } from "node:child_process";

const TARGETS = ["apps/bff", "apps/storefront", "libs/shared-types"];

try {
  execSync(`rg -n "theme-contrast" ${TARGETS.join(" ")}`, {
    stdio: "inherit",
  });
  console.error(
    '[theme-catalog-guard] Found deprecated theme key "theme-contrast".',
  );
  process.exit(1);
} catch (error) {
  const code = error && typeof error === "object" ? error.status : undefined;
  if (code === 1) {
    console.log("[theme-catalog-guard] OK");
    process.exit(0);
  }

  console.error("[theme-catalog-guard] Failed to run ripgrep.");
  process.exit(1);
}
