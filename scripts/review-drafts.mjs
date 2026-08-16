#!/usr/bin/env node
/**
 * Generate a human review page from data/drafts/*.json. Renders each draft like the app
 * card (종합 충고 + category-grouped patterns) and surfaces reviewNotes prominently so the
 * owner can check tone / facts / de-identification before promoting to seed.ts.
 *
 * Usage: node scripts/review-drafts.mjs  →  writes review-drafts.html at repo root.
 * Read-only over the pipeline; produces one HTML file. See data/drafts/README.md.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFTS_DIR = join(ROOT, "data", "drafts");
const OUT = join(ROOT, "review-drafts.html");

// Category/day labels mirrored from taxonomy/published for a dependency-free script.
const CAT = readFileSync(join(ROOT, "packages", "domain", "src", "taxonomy.ts"), "utf8");
function labelMap(name) {
  const block = CAT.match(new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\} as const;`))[1];
  const map = {};
  for (const m of block.matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*"([^"]*)"/gm)) map[m[1]] = m[2];
  return map;
}
const CATEGORY = labelMap("RISK_CATEGORY");
const DAY_TYPE = {
  holiday: "국경일",
  memorial: "추모일",
  anniversary: "기념일",
  election: "선거",
  solarTerm: "절기",
  ordinary: "평일/시즌",
};
const SEV = { 3: ["위험", "#FF4D4D"], 2: ["주의", "#FF9F45"], 1: ["유의", "#FFD166"] };

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function groupByCategory(patterns) {
  const groups = [];
  for (const p of patterns) {
    let g = groups.find((x) => x.category === p.category);
    if (!g) groups.push((g = { category: p.category, items: [] }));
    g.items.push(p);
  }
  return groups;
}

const drafts = readdirSync(DRAFTS_DIR)
  .filter((n) => n.endsWith(".json"))
  .sort()
  .map((n) => JSON.parse(readFileSync(join(DRAFTS_DIR, n), "utf8")));

const cards = drafts
  .map((d) => {
    const c = d.card;
    const groups = groupByCategory(c.riskPatterns ?? []);
    const groupsHtml = groups
      .map((g) => {
        const items = g.items
          .map((r) => {
            const [sl, sc] = SEV[r.severity] ?? ["?", "#888"];
            return `<div class="risk" style="border-left-color:${sc}">
              <span class="sev" style="background:${sc}">${sl}</span>
              <div class="pat">${esc(r.pattern)}</div>
              <div class="why">${esc(r.whyItBackfires)}</div>
              <div class="ex">${esc(r.exampleSummary)}</div>
            </div>`;
          })
          .join("");
        return `<div class="group"><div class="ghead">${esc(CATEGORY[g.category] ?? g.category ?? "-")}</div>${items}</div>`;
      })
      .join("");
    const merge = d.mergeInto ? `<span class="tag merge">append to existing</span>` : "";
    return `<section class="card">
      <div class="chead"><span class="key">${esc(d.key)}</span>
        <span class="tag">${DAY_TYPE[c.dayType] ?? c.dayType}</span>${merge}</div>
      <div class="albl">종합 충고</div>
      <div class="advice">${esc(c.advice)}</div>
      <div class="sig">${esc(c.significance)}</div>
      ${groupsHtml}
      ${d.reviewNotes ? `<div class="notes"><b>검수 메모</b><br>${esc(d.reviewNotes)}</div>` : ""}
    </section>`;
  })
  .join("\n");

const html = `<meta charset="utf-8"><title>datemine — 초안 검수 (${drafts.length})</title>
<style>
 :root{color-scheme:dark}
 body{margin:0;background:#0B0B0F;color:#F5F5F7;font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;padding:24px;max-width:760px;margin:auto}
 h1{font-size:20px} .lede{color:#A1A1AA;margin-bottom:20px}
 .check{background:#16161D;border:1px solid #26262F;border-radius:12px;padding:12px 16px;margin-bottom:24px;color:#A1A1AA;font-size:13px}
 .card{background:#16161D;border:1px solid #26262F;border-radius:20px;padding:24px;margin-bottom:20px}
 .chead{display:flex;gap:8px;align-items:center;margin-bottom:12px}
 .key{font-weight:800;color:#FF4D4D;font-size:16px}
 .tag{font-size:12px;color:#A1A1AA;border:1px solid #26262F;border-radius:12px;padding:2px 8px}
 .tag.merge{color:#FFD166;border-color:#FFD166}
 .albl{color:#FF4D4D;font-weight:800;font-size:12px;letter-spacing:1px}
 .advice{font-size:22px;font-weight:700;line-height:1.35;margin:2px 0 8px}
 .sig{color:#A1A1AA;font-size:14px;margin-bottom:12px}
 .group{margin-top:12px} .ghead{font-weight:700;margin-bottom:8px}
 .risk{background:#0B0B0F;border-radius:12px;border-left:3px solid;padding:12px;margin-bottom:8px}
 .sev{color:#0B0B0F;font-weight:800;font-size:12px;border-radius:12px;padding:1px 8px}
 .pat{font-weight:600;margin:8px 0 4px} .why{color:#A1A1AA;font-size:14px}
 .ex{color:#A1A1AA;font-size:13px;font-style:italic;margin-top:4px}
 .notes{background:#1c1c14;border:1px solid #3a3a20;border-radius:12px;padding:12px;margin-top:12px;color:#d9d9b0;font-size:13px}
</style>
<h1>datemine — 초안 검수 (${drafts.length}건)</h1>
<div class="lede">앱 미노출 상태의 초안. 톤·사실·개인특정을 확인하고 승격 여부를 판단하세요.</div>
<div class="check">체크리스트 — ① 특정 개인·기관이 식별되는가? ② 사실관계·반복성이 맞는가? ③ 추모·존중 톤이 지켜졌는가? ④ 카테고리·severity가 적절한가?</div>
${cards}
`;

writeFileSync(OUT, html);
console.log(`Wrote ${OUT} (${drafts.length} drafts).`);
