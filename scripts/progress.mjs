#!/usr/bin/env node
/**
 * Collection progress report. Reads the three pipeline stages and prints how far the
 * candidate calendar has been turned into reviewed, published cards:
 *
 *   candidates (data/candidates)  →  drafts (data/drafts)  →  published (seed.ts)
 *
 * Days = calendar keys (MM-DD or lunar). Cells = day × category (the survey unit).
 * A pure reporting tool — no side effects. See docs/DATA-PIPELINE.md.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readJsonDir(rel) {
  const dir = join(ROOT, rel);
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.endsWith(".json"))
    .map((n) => JSON.parse(readFileSync(join(dir, n), "utf8")));
}

// --- Candidates: array-of-arrays of {dateKey, category} ---
const candidateFiles = readJsonDir("data/candidates");
const candidateCells = candidateFiles.flat().filter((c) => c && c.dateKey && c.category);
const candidateDays = new Set(candidateCells.map((c) => c.dateKey));

// --- Drafts: one object {key, card:{riskPatterns:[{category}]}} per file ---
const drafts = readJsonDir("data/drafts");
const draftDays = new Set(drafts.map((d) => d.key));
const draftCells = drafts.flatMap((d) =>
  (d.card?.riskPatterns ?? []).map((r) => `${d.key}:${r.category}`),
);

// --- Published: keys of seedCardsByMonthDay + seedCardsByLunarKey in seed.ts ---
const seed = readFileSync(join(ROOT, "apps", "mobile", "src", "data", "seed.ts"), "utf8");
const monthDaySection = seed.slice(
  seed.indexOf("seedCardsByMonthDay"),
  seed.indexOf("seedCalendar"),
);
const publishedFixed = [...monthDaySection.matchAll(/^\s{2}"(\d{2}-\d{2})":\s*\{/gm)].map(
  (m) => m[1],
);
const lunarSection = seed.slice(seed.indexOf("seedCardsByLunarKey"));
const publishedLunar = [...lunarSection.matchAll(/^\s{2}([a-zA-Z][a-zA-Z0-9]*):\s*lunarFamilyCard/gm)].map(
  (m) => `lunar:${m[1]}`,
);

// Promoted cards live in apps/mobile/src/data/published.ts (generated, then hand-edited).
let promotedFixed = [];
try {
  const pub = readFileSync(join(ROOT, "apps", "mobile", "src", "data", "published.ts"), "utf8");
  const section = pub.slice(pub.indexOf("promotedByMonthDay"), pub.indexOf("promotedByLunarKey"));
  promotedFixed = [...section.matchAll(/^\s{2}"(\d{2}-\d{2})":/gm)].map((m) => m[1]);
} catch {
  // no promoted store yet
}

const publishedDays = new Set([...publishedFixed, ...publishedLunar, ...promotedFixed]);

function bar(n, total, width = 24) {
  const filled = total === 0 ? 0 : Math.round((n / total) * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
}

const pct = (n, total) => (total === 0 ? "0.0" : ((n / total) * 100).toFixed(1));
const totalDays = candidateDays.size;

console.log("datemine — collection progress\n");
console.log(`Candidate days : ${totalDays}   (cells: ${candidateCells.length})`);
console.log(`Drafted days   : ${draftDays.size}   (draft cells: ${draftCells.length})`);
console.log(`Published days : ${publishedDays.size}\n`);

console.log(`Drafted   ${bar(draftDays.size, totalDays)} ${pct(draftDays.size, totalDays)}%`);
console.log(`Published ${bar(publishedDays.size, totalDays)} ${pct(publishedDays.size, totalDays)}%\n`);

const pendingReview = [...draftDays].filter((k) => !publishedDays.has(k)).sort();
if (pendingReview.length > 0) {
  console.log(`Pending review (drafted, not yet promoted) — ${pendingReview.length}:`);
  console.log(`  ${pendingReview.join(", ")}`);
}
