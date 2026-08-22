import type { RiskPattern } from "@datemine/domain";
import { EVERGREEN } from "./data/evergreen";
import { FORTUNES, type Fortune } from "./data/fortunes";
import { ON_THIS_DAY, type OnThisDay } from "./data/onthisday";

function hashCode(str: string, salt: number): number {
  let hash = salt;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable per-day pick: hash the ISO date to an index so a given day always shows the
 * same 오늘의 눈치, but it varies day to day. */
export function dailyFortune(isoDate: string): Fortune {
  const fortune = FORTUNES[hashCode(isoDate, 0) % FORTUNES.length];
  // FORTUNES is a non-empty constant, so this is always defined.
  return fortune as Fortune;
}

/** "그날의 뇌관" for this MM-DD, if history has one. Deterministic pick when several. */
export function pickOnThisDay(isoDate: string): OnThisDay | undefined {
  const md = isoDate.slice(5);
  const list = ON_THIS_DAY[md];
  if (!list || list.length === 0) return undefined;
  return list[hashCode(isoDate, 3) % list.length];
}

/** Stable per-day set of distinct 상시 지뢰 (default 3). Deterministic per date, salted so
 * it doesn't correlate with the fortune pick; walks with a step to spread picks out. */
export function dailyEvergreens(isoDate: string, count = 3): RiskPattern[] {
  const n = Math.min(count, EVERGREEN.length);
  const start = hashCode(isoDate, 7) % EVERGREEN.length;
  const step = 1 + (hashCode(isoDate, 13) % (EVERGREEN.length - 1));
  const picks: RiskPattern[] = [];
  const seen = new Set<number>();
  let idx = start;
  while (picks.length < n) {
    if (!seen.has(idx)) {
      seen.add(idx);
      picks.push(EVERGREEN[idx] as RiskPattern);
    }
    idx = (idx + step) % EVERGREEN.length;
  }
  return picks;
}
