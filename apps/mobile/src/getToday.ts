import { type DailyContext, resolveDay } from "@datemine/domain";
import { seedCalendar, seedCardsByMonthDay } from "./data/seed";

function monthDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${month}-${day}`;
}

/**
 * Resolve today's DailyContext. Returns a curated card when one exists for the date,
 * otherwise builds a non-empty fallback from the calendar backbone so the app never
 * shows an empty day (see the daily-content guarantee).
 */
export function getDailyContext(isoDate: string): DailyContext {
  const card = seedCardsByMonthDay[monthDay(isoDate)];
  if (card) {
    return { date: isoDate, ...card };
  }

  const entry = resolveDay(isoDate, seedCalendar);
  return {
    date: isoDate,
    dayType: entry.dayType,
    significance: entry.significance,
    riskPatterns: [],
    advice:
      entry.dayType === "ordinary"
        ? "특별한 날은 아니다. 그래도 오늘의 실언 한 줄이 내일의 기사 제목이 될 수 있다."
        : `${entry.name} — 이 시기의 흐름을 읽고, 단정적·자극적 발언은 한 박자 참아라.`,
    reviewedAt: "2026-01-01T00:00:00Z",
  };
}
