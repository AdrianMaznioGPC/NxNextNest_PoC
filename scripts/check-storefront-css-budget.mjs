import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CSS_DIR = join(ROOT, "apps/storefront/.next/static/chunks");
const MAX_RAW_BYTES = Number(process.env.STOREFRONT_CSS_MAX_RAW ?? "130000");
const MAX_GZIP_BYTES = Number(process.env.STOREFRONT_CSS_MAX_GZIP ?? "15000");

function walkCssFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCssFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(fullPath);
    }
  }
  return files;
}

if (!statExists(CSS_DIR)) {
  fail(
    `No storefront build CSS found at "${CSS_DIR}". Run "npm run build:storefront" first.`,
  );
}

const cssFiles = walkCssFiles(CSS_DIR);
if (cssFiles.length === 0) {
  fail(`No CSS files found under "${CSS_DIR}".`);
}

let largestRaw = { file: "", bytes: 0 };
let largestGzip = { file: "", bytes: 0 };

for (const file of cssFiles) {
  const content = readFileSync(file);
  const rawBytes = content.byteLength;
  const gzipBytes = gzipSync(content).byteLength;

  if (rawBytes > largestRaw.bytes) {
    largestRaw = { file, bytes: rawBytes };
  }
  if (gzipBytes > largestGzip.bytes) {
    largestGzip = { file, bytes: gzipBytes };
  }
}

console.log(
  `[css-budget] largest raw: ${largestRaw.bytes} bytes (${largestRaw.file})`,
);
console.log(
  `[css-budget] largest gzip: ${largestGzip.bytes} bytes (${largestGzip.file})`,
);
console.log(
  `[css-budget] limits raw<=${MAX_RAW_BYTES} gzip<=${MAX_GZIP_BYTES}`,
);

if (largestRaw.bytes > MAX_RAW_BYTES || largestGzip.bytes > MAX_GZIP_BYTES) {
  fail("Storefront CSS budget exceeded.");
}

console.log("[css-budget] OK");

function statExists(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`[css-budget] ${message}`);
  process.exit(1);
}
