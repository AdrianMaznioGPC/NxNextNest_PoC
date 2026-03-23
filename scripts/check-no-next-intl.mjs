import { execSync } from "node:child_process";

const TARGETS = ["apps/storefront"];

try {
  execSync(`rg -n "next-intl" ${TARGETS.join(" ")}`, {
    stdio: "inherit",
  });
  console.error(
    "[i18n-runtime-guard] Found next-intl reference in storefront. i18n runtime must remain BFF-authoritative + local lookup only.",
  );
  process.exit(1);
} catch (error) {
  const code = error && typeof error === "object" ? error.status : undefined;
  if (code === 1) {
    console.log("[i18n-runtime-guard] OK");
    process.exit(0);
  }

  console.error("[i18n-runtime-guard] Failed to run ripgrep.");
  process.exit(1);
}
