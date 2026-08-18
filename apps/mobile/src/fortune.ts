import type { RiskPattern } from "@datemine/domain";
import { EVERGREEN } from "./data/evergreen";
import { FORTUNES, type Fortune } from "./data/fortunes";

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

/** Stable per-day evergreen landmine (상시 지뢰). Salted differently so it doesn't
 * correlate with the day's fortune pick. */
export function dailyEvergreen(isoDate: string): RiskPattern {
  const item = EVERGREEN[hashCode(isoDate, 7) % EVERGREEN.length];
  return item as RiskPattern;
}
