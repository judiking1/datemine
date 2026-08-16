#!/usr/bin/env node
/**
 * Draft-staging guard. Validates every data/drafts/*.json so an agent-produced draft
 * cannot silently break the schema or the app-safety rules before an owner reviews it.
 *
 * Checks per draft:
 *  - well-formed JSON with { key, card } (mergeInto optional boolean)
 *  - card has NO `reviewedAt` (only the human reviewer adds it on promotion)
 *  - card.dayType is a known DayType
 *  - each riskPattern: non-empty pattern/whyItBackfires/exampleSummary, severity 1..3,
 *    category ∈ RISK_CATEGORY, domains ⊆ PERSONA_DOMAIN
 *  - published card text carries no URL (a raw-source leak signal)
 *
 * Real-name leak-checking against data/raw belongs to toRiskPattern at promotion time;
 * this guard runs with only the committable (anonymized) drafts. See data/drafts/README.md.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFTS_DIR = join(ROOT, "data", "drafts");

/**
 * Extract the object keys of a `export const NAME = { … } as const;` block from the
 * taxonomy source. Reading the source of truth keeps this guard drift-free without
 * depending on the package's compiled output (which uses bundler-style imports).
 */
function taxonomyKeys(name) {
  const src = readFileSync(join(ROOT, "packages", "domain", "src", "taxonomy.ts"), "utf8");
  const block = src.match(new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\} as const;`));
  if (!block) throw new Error(`taxonomy.ts: could not find ${name}`);
  return new Set([...block[1].matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:/gm)].map((m) => m[1]));
}

const DAY_TYPES = new Set([
  "holiday",
  "memorial",
  "anniversary",
  "election",
  "solarTerm",
  "ordinary",
]);
const CATEGORIES = taxonomyKeys("RISK_CATEGORY");
const DOMAINS = taxonomyKeys("PERSONA_DOMAIN");
const URL_RE = /https?:\/\//;

function draftFiles() {
  let names;
  try {
    names = readdirSync(DRAFTS_DIR);
  } catch {
    return [];
  }
  return names.filter((n) => n.endsWith(".json")).map((n) => join(DRAFTS_DIR, n));
}

function nonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

const errors = [];
const files = draftFiles();

for (const file of files) {
  const rel = file.slice(ROOT.length + 1);
  let draft;
  try {
    draft = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${rel}: invalid JSON (${e.message})`);
    continue;
  }

  if (!nonEmptyString(draft.key)) errors.push(`${rel}: missing "key"`);
  if ("mergeInto" in draft && typeof draft.mergeInto !== "boolean") {
    errors.push(`${rel}: "mergeInto" must be boolean`);
  }

  const card = draft.card;
  if (!card || typeof card !== "object") {
    errors.push(`${rel}: missing "card" object`);
    continue;
  }
  if ("reviewedAt" in card) {
    errors.push(`${rel}: card.reviewedAt must NOT be set in a draft (reviewer adds it)`);
  }
  if (!DAY_TYPES.has(card.dayType)) {
    errors.push(`${rel}: invalid card.dayType "${card.dayType}"`);
  }
  if (!nonEmptyString(card.significance)) errors.push(`${rel}: empty card.significance`);
  if (!nonEmptyString(card.advice)) errors.push(`${rel}: empty card.advice`);

  const patterns = card.riskPatterns;
  if (!Array.isArray(patterns) || patterns.length === 0) {
    errors.push(`${rel}: card.riskPatterns must be a non-empty array`);
    continue;
  }
  patterns.forEach((r, i) => {
    const at = `${rel} riskPatterns[${i}]`;
    for (const field of ["pattern", "whyItBackfires", "exampleSummary"]) {
      if (!nonEmptyString(r[field])) errors.push(`${at}: empty "${field}"`);
      else if (URL_RE.test(r[field])) errors.push(`${at}: "${field}" contains a URL (source leak)`);
    }
    if (![1, 2, 3].includes(r.severity)) errors.push(`${at}: severity must be 1|2|3`);
    if (!CATEGORIES.has(r.category)) errors.push(`${at}: invalid category "${r.category}"`);
    if (r.domains !== undefined) {
      if (!Array.isArray(r.domains)) errors.push(`${at}: domains must be an array`);
      else {
        for (const d of r.domains) {
          if (!DOMAINS.has(d)) errors.push(`${at}: invalid domain "${d}"`);
        }
      }
    }
  });
}

if (errors.length > 0) {
  console.error(`Draft validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`Draft staging OK: ${files.length} draft(s) valid.`);
