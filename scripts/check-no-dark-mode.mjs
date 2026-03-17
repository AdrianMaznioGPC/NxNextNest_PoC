import { execSync } from "node:child_process";

const PATTERN =
  "dark:|prefers-color-scheme: dark|force-dark|force-light|data-theme-mode|themeModePolicy";
const TARGETS = ["apps/storefront", "apps/bff", "libs/shared-types"];

try {
  execSync(`rg -n "${PATTERN}" ${TARGETS.join(" ")}`, {
    stdio: "inherit",
  });
  console.error("[light-mode-guard] Dark-mode markers detected.");
  process.exit(1);
} catch (error) {
  const code = error && typeof error === "object" ? error.status : undefined;
  if (code === 1) {
    console.log("[light-mode-guard] OK");
    process.exit(0);
  }

  console.error("[light-mode-guard] Failed to run ripgrep.");
  process.exit(1);
}
