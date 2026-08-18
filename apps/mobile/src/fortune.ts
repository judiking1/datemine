import { FORTUNES, type Fortune } from "./data/fortunes";

/** Stable per-day pick: hash the ISO date to an index so a given day always shows the
 * same 오늘의 눈치, but it varies day to day. */
export function dailyFortune(isoDate: string): Fortune {
  let hash = 0;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (hash * 31 + isoDate.charCodeAt(i)) >>> 0;
  }
  const fortune = FORTUNES[hash % FORTUNES.length];
  // FORTUNES is a non-empty constant, so this is always defined.
  return fortune as Fortune;
}
