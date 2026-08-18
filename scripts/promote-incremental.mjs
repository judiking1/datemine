#!/usr/bin/env node
/**
 * Incremental promotion: merge NEW drafts (data/drafts) into the existing published store
 * (apps/mobile/src/data/published.ts) without clobbering what's already published.
 *
 * Reads the current promoted maps out of published.ts (their object literals are valid
 * JSON, having been JSON.stringify'd), stamps reviewedAt on each new draft, adds it under
 * its key (new keys only unless --overwrite), and rewrites the file. Then delete the
 * consumed drafts. See scripts/promote-all.mjs for the initial bulk version.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFTS_DIR = join(ROOT, "data", "drafts");
const PUB = join(ROOT, "apps", "mobile", "src", "data", "published.ts");
const STAMP = new Date().toISOString();
const overwrite = process.argv.includes("--overwrite");

function extractObject(src, name) {
  const start = src.indexOf(`export const ${name}`);
  if (start === -1) return {};
  const brace = src.indexOf("{", start);
  // Balance braces to find the matching close (our data has no braces inside strings).
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        // biome rewrites the generated JSON to a JS object literal (unquoted keys),
        // so evaluate it as JS rather than JSON. Local tooling over our own data.
        const literal = src.slice(brace, i + 1);
        // biome-ignore lint: controlled eval of our own generated data literal
        return Function(`return (${literal})`)();
      }
    }
  }
  return {};
}

const src = readFileSync(PUB, "utf8");
const byMonthDay = extractObject(src, "promotedByMonthDay");
const byLunarKey = extractObject(src, "promotedByLunarKey");
const mergeMatch = src.match(/MERGE_KEYS[^=]*=\s*(\[[^\]]*\])/);
const mergeKeys = mergeMatch ? JSON.parse(mergeMatch[1]) : [];

const drafts = readdirSync(DRAFTS_DIR)
  .filter((n) => n.endsWith(".json"))
  .sort()
  .map((n) => JSON.parse(readFileSync(join(DRAFTS_DIR, n), "utf8")));

let added = 0;
let merged = 0;
const skipped = [];
for (const d of drafts) {
  const isLunar = typeof d.key === "string" && d.key.startsWith("lunar:");
  const map = isLunar ? byLunarKey : byMonthDay;
  const mapKey = isLunar ? d.key.slice("lunar:".length) : d.key;
  const existing = map[mapKey];

  // mergeInto: append this draft's patterns onto the existing card on the same date
  // (e.g. a second theme that falls on a day already published), keeping its hero copy.
  if (existing && d.mergeInto) {
    map[mapKey] = {
      ...existing,
      riskPatterns: [...existing.riskPatterns, ...d.card.riskPatterns],
      reviewedAt: STAMP,
    };
    merged++;
    continue;
  }
  if (existing && !overwrite) {
    skipped.push(d.key);
    continue;
  }
  // Defaults so a mergeInto draft targeting a seed-only day (no promoted entry yet) still
  // satisfies the Card type; combine() will use the seed card's copy via MERGE_KEYS.
  map[mapKey] = { significance: "", advice: "", ...d.card, reviewedAt: STAMP };
  if (d.mergeInto && !mergeKeys.includes(d.key)) mergeKeys.push(d.key);
  added++;
}

const header = `// Generated from data/drafts by scripts/promote-*.mjs, then hand-editable.
// Published (reviewed) cards. MERGE_KEYS append onto same-key seed cards.
import type { DailyContext } from "@datemine/domain";

type Card = Omit<DailyContext, "date">;

export const MERGE_KEYS: readonly string[] = ${JSON.stringify(mergeKeys)};

`;
const sortObj = (o) =>
  Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));
const body =
  `export const promotedByMonthDay: Readonly<Record<string, Card>> = ${JSON.stringify(sortObj(byMonthDay), null, 2)};\n\n` +
  `export const promotedByLunarKey: Readonly<Record<string, Card>> = ${JSON.stringify(sortObj(byLunarKey), null, 2)};\n`;

writeFileSync(PUB, header + body);
console.log(
  `Promoted ${added} new + ${merged} merged. Total: ${Object.keys(byMonthDay).length} fixed + ${Object.keys(byLunarKey).length} lunar.` +
    (skipped.length ? `\n  Skipped existing (use --overwrite): ${skipped.join(", ")}` : ""),
);
