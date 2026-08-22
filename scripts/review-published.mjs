#!/usr/bin/env node
/**
 * Generate a human review page of the PUBLISHED cards (what's live in the app), so the
 * owner can check tone/facts across all event-day cards at once. Reads published.ts +
 * seed.ts (fixed cards) + hooks.ts, merges MERGE_KEYS, renders one HTML page.
 * Output: review-published.html (gitignored). Read-only.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "review-published.html");

function evalObject(src, name) {
  const start = src.indexOf(`export const ${name}`);
  if (start === -1) return {};
  const brace = src.indexOf("{", start);
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      // biome-ignore lint: controlled eval of our own generated data literal
      if (depth === 0) return Function(`return (${src.slice(brace, i + 1)})`)();
    }
  }
  return {};
}

const pub = readFileSync(join(ROOT, "apps/mobile/src/data/published.ts"), "utf8");
const seed = readFileSync(join(ROOT, "apps/mobile/src/data/seed.ts"), "utf8");
const hooksSrc = readFileSync(join(ROOT, "apps/mobile/src/data/hooks.ts"), "utf8");
const taxo = readFileSync(join(ROOT, "packages/domain/src/taxonomy.ts"), "utf8");

const promoted = evalObject(pub, "promotedByMonthDay");
const promotedLunar = evalObject(pub, "promotedByLunarKey");
const seedCards = evalObject(seed, "seedCardsByMonthDay");
const hooks = evalObject(hooksSrc, "hooksByKey");
const mergeKeys = JSON.parse((pub.match(/MERGE_KEYS[^=]*=\s*(\[[^\]]*\])/) || [])[1] || "[]");

const CAT = {};
for (const m of taxo
  .match(/RISK_CATEGORY = \{([\s\S]*?)\} as const;/)[1]
  .matchAll(/^\s*([a-zA-Z0-9]+)\s*:\s*"([^"]*)"/gm))
  CAT[m[1]] = m[2];

const SEV = { 3: ["위험", "#FF4D4D"], 2: ["주의", "#FF9F45"], 1: ["유의", "#FFD166"] };
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// Merge fixed cards: seed + promoted (append for MERGE_KEYS).
const keys = new Set([...Object.keys(seedCards), ...Object.keys(promoted)]);
const rows = [];
for (const key of [...keys].sort()) {
  const s = seedCards[key];
  const p = promoted[key];
  let card;
  if (s && p && mergeKeys.includes(key))
    card = { ...s, riskPatterns: [...s.riskPatterns, ...p.riskPatterns] };
  else card = p ?? s;
  rows.push({ key, label: key, hook: card.hook ?? hooks[key], card });
}
for (const [lk, card] of Object.entries(promotedLunar))
  rows.push({ key: `lunar:${lk}`, label: `${lk} (음력)`, hook: card.hook ?? hooks[`lunar:${lk}`], card });
// seed lunar family cards (seollal/chuseok) live behind a function — note them by hook.
for (const lk of ["seollal", "chuseok"])
  if (hooks[`lunar:${lk}`])
    rows.push({ key: `lunar:${lk}`, label: `${lk} (음력)`, hook: hooks[`lunar:${lk}`], card: null });

const cards = rows
  .map((r) => {
    const patterns = (r.card?.riskPatterns ?? [])
      .map((rp) => {
        const [sl, sc] = SEV[rp.severity] ?? ["?", "#888"];
        return `<div class="risk" style="border-left-color:${sc}"><span class="sev" style="background:${sc}">${sl}</span> <b class="cat">${esc(CAT[rp.category] ?? rp.category ?? "")}</b><div class="pat">${esc(rp.pattern)}</div><div class="why">${esc(rp.whyItBackfires)}</div></div>`;
      })
      .join("");
    const body = r.card
      ? patterns
      : `<div class="note">seed의 lunarFamilyCard (며느리=주방 / 명절 잔소리) — 코드에서 확인</div>`;
    return `<section class="card"><div class="key">${esc(r.label)}</div>${r.hook ? `<div class="hook">${esc(r.hook)}</div>` : ""}${r.card?.advice ? `<div class="advice">${esc(r.card.advice)}</div>` : ""}${body}</section>`;
  })
  .join("\n");

const html = `<meta charset="utf-8"><title>datemine — 발행 카드 검수 (${rows.length})</title>
<style>
 :root{color-scheme:dark}
 body{margin:0;background:#0B0B0F;color:#F5F5F7;font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;padding:24px;max-width:820px;margin:auto}
 h1{font-size:20px}.lede{color:#A1A1AA;margin-bottom:8px}
 .check{background:#16161D;border:1px solid #26262F;border-radius:12px;padding:10px 14px;margin:14px 0 22px;color:#A1A1AA;font-size:13px}
 .card{background:#16161D;border:1px solid #26262F;border-radius:16px;padding:18px;margin-bottom:16px}
 .key{color:#FF4D4D;font-weight:800;font-size:13px;letter-spacing:1px}
 .hook{font-size:22px;font-weight:800;line-height:1.3;margin:4px 0 6px}
 .advice{color:#A1A1AA;font-size:14px;margin-bottom:10px}
 .risk{background:#0B0B0F;border-radius:10px;border-left:3px solid;padding:10px 12px;margin-top:8px}
 .sev{color:#0B0B0F;font-weight:800;font-size:11px;border-radius:10px;padding:1px 7px}
 .cat{color:#A1A1AA;font-size:12px;font-weight:600}
 .pat{font-weight:700;margin:6px 0 3px}.why{color:#A1A1AA;font-size:13px}
 .note{color:#A1A1AA;font-size:13px}
</style>
<h1>datemine — 발행 카드 검수 (${rows.length})</h1>
<div class="lede">앱에 라이브 중인 특정일 카드 전체. 헤드라인·설명 톤과 사실을 확인하세요.</div>
<div class="check">검수 포인트 — ① 헤드라인이 과하거나 부정확한가? ② 익명인데 특정 개인·기관이 연상되나? ③ 추모·소수자 카드 톤이 존중을 지키나? ④ severity가 적절한가?</div>
${cards}`;
writeFileSync(OUT, html);
console.log(`Wrote ${OUT} (${rows.length} cards).`);
