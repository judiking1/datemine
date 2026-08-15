#!/usr/bin/env node
/**
 * Layer boundary guard. The raw layer (@datemine/ingest, RawCaseRecord) contains real
 * names and must never be reachable from client-facing code. This fails the build if
 * any app / client package imports it. See AGENTS.md hard rules.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Directories that ship to users — they may NOT import the raw layer.
const CLIENT_DIRS = ["apps", "packages/api-client"];

const FORBIDDEN = [
  /from\s+["']@datemine\/ingest["']/,
  /require\(\s*["']@datemine\/ingest["']\s*\)/,
  /\bRawCaseRecord\b/,
];

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === "dist" || name === ".expo") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if ([...CODE_EXT].some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

const violations = [];
for (const base of CLIENT_DIRS) {
  for (const file of walk(base)) {
    const text = readFileSync(file, "utf8");
    for (const pattern of FORBIDDEN) {
      if (pattern.test(text)) {
        violations.push(`${file}: matches ${pattern}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Layer boundary violation — client code must not reach the raw (Layer 1) layer:");
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log("Layer boundary OK: no client code imports the raw layer.");
