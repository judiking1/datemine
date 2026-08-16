#!/usr/bin/env node
/**
 * One-time bulk promotion: stamp every draft with reviewedAt (now) and emit them as the
 * published store `apps/mobile/src/data/published.ts`. The owner chose to publish all and
 * review day-by-day afterward. 03-01 stays flagged mergeInto so the app appends its
 * patterns onto the hand-written 03-01 seed card instead of replacing it.
 *
 * After running, the data/drafts/*.json files can be removed (archived in git history);
 * published.ts becomes the canonical, hand-editable published store going forward.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFTS_DIR = join(ROOT, "data", "drafts");
const OUT = join(ROOT, "apps", "mobile", "src", "data", "published.ts");
const STAMP = new Date().toISOString();

const drafts = readdirSync(DRAFTS_DIR)
  .filter((n) => n.endsWith(".json"))
  .sort()
  .map((n) => JSON.parse(readFileSync(join(DRAFTS_DIR, n), "utf8")));

const byMonthDay = {};
const byLunarKey = {};
const mergeKeys = [];
for (const d of drafts) {
  const card = { ...d.card, reviewedAt: STAMP };
  if (typeof d.key === "string" && d.key.startsWith("lunar:")) {
    byLunarKey[d.key.slice("lunar:".length)] = card;
  } else {
    byMonthDay[d.key] = card;
    if (d.mergeInto) mergeKeys.push(d.key);
  }
}

const header = `// Generated once from data/drafts by scripts/promote-all.mjs, then hand-editable.
// Published (reviewed) cards. reviewedAt stamped ${STAMP}.
// MERGE_KEYS append onto same-key seed cards instead of replacing them.
import type { DailyContext } from "@datemine/domain";

type Card = Omit<DailyContext, "date">;

export const MERGE_KEYS: readonly string[] = ${JSON.stringify(mergeKeys)};

`;

const body =
  `export const promotedByMonthDay: Readonly<Record<string, Card>> = ${JSON.stringify(byMonthDay, null, 2)};\n\n` +
  `export const promotedByLunarKey: Readonly<Record<string, Card>> = ${JSON.stringify(byLunarKey, null, 2)};\n`;

writeFileSync(OUT, header + body);
console.log(
  `Wrote ${OUT}\n  ${Object.keys(byMonthDay).length} fixed + ${Object.keys(byLunarKey).length} lunar; merge: ${mergeKeys.join(", ") || "none"}`,
);
