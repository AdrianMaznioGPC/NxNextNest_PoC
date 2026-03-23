import { execSync } from "node:child_process";

const TARGETS = ["apps/storefront"];
const PATTERN = "import\\s+.+from\\s+['\\\"][^'\\\"]+\\.svg['\\\"]";

try {
  execSync(`rg -n "${PATTERN}" ${TARGETS.join(" ")}`, {
    stdio: "inherit",
  });
  console.error(
    "[svg-network-guard] Found SVG module imports in storefront source. Use network-loaded /public/icons assets instead.",
  );
  process.exit(1);
} catch (error) {
  const code = error && typeof error === "object" ? error.status : undefined;
  if (code === 1) {
    console.log("[svg-network-guard] OK");
    process.exit(0);
  }

  console.error("[svg-network-guard] Failed to run ripgrep.");
  process.exit(1);
}
