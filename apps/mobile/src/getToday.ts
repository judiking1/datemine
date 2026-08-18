import { type DailyContext, resolveDay } from "@datemine/domain";
import { hooksByKey } from "./data/hooks";
import { MERGE_KEYS, promotedByLunarKey, promotedByMonthDay } from "./data/published";
import { seedCalendar, seedCardsByLunarKey, seedCardsByMonthDay } from "./data/seed";
import { dailyEvergreen, dailyFortune } from "./fortune";

type Card = Omit<DailyContext, "date">;

function monthDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${month}-${day}`;
}

/** Combine a hand-written seed card with a promoted one. MERGE_KEYS append their risk
 * patterns onto the seed card; otherwise the promoted card stands alone. */
function combine(
  seed: Card | undefined,
  promoted: Card | undefined,
  key: string,
): Card | undefined {
  if (seed && promoted && MERGE_KEYS.includes(key)) {
    return { ...seed, riskPatterns: [...seed.riskPatterns, ...promoted.riskPatterns] };
  }
  return promoted ?? seed;
}

/**
 * Resolve a day's DailyContext. Priority: fixed-date card (seed + promoted) → lunar-holiday
 * card → non-empty calendar fallback, so the app never shows an empty day (see the
 * daily-content guarantee).
 */
export function getDailyContext(isoDate: string): DailyContext {
  const md = monthDay(isoDate);
  const card = combine(seedCardsByMonthDay[md], promotedByMonthDay[md], md);
  if (card) {
    const hook = hooksByKey[md];
    return { date: isoDate, ...(hook ? { hook } : {}), ...card };
  }

  const entry = resolveDay(isoDate, seedCalendar);

  if (entry.lunarKey) {
    const lunarCard = combine(
      seedCardsByLunarKey[entry.lunarKey],
      promotedByLunarKey[entry.lunarKey],
      `lunar:${entry.lunarKey}`,
    );
    if (lunarCard) {
      const hook = hooksByKey[`lunar:${entry.lunarKey}`];
      return { date: isoDate, ...(hook ? { hook } : {}), ...lunarCard };
    }
  }

  // No specific event → still give the day something: 오늘의 눈치 (general daily caution).
  if (entry.dayType === "ordinary") {
    const f = dailyFortune(isoDate);
    return {
      date: isoDate,
      dayType: entry.dayType,
      hook: f.line,
      significance: "특정된 이슈는 없는 날. 그래도 지뢰는 매일 터진다 — 오늘의 상시 지뢰 하나.",
      riskPatterns: [dailyEvergreen(isoDate)],
      advice: entry.significance,
      fortune: { level: f.level, theme: f.theme },
      reviewedAt: "2026-01-01T00:00:00Z",
    };
  }

  return {
    date: isoDate,
    dayType: entry.dayType,
    significance: entry.significance,
    riskPatterns: [],
    advice: `${entry.name} — 이 시기의 흐름을 읽고, 단정적·자극적 발언은 한 박자 참아라.`,
    reviewedAt: "2026-01-01T00:00:00Z",
  };
}
