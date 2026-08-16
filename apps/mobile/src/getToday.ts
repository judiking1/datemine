import { type DailyContext, resolveDay } from "@datemine/domain";
import { draftCardsByLunarKey, draftCardsByMonthDay } from "./data/draftsPreview.generated";
import { seedCalendar, seedCardsByLunarKey, seedCardsByMonthDay } from "./data/seed";

function monthDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${month}-${day}`;
}

/**
 * Resolve a day's DailyContext. Priority: fixed-date card → lunar-holiday card (matched
 * via the year's resolved lunarKey) → non-empty calendar fallback, so the app never shows
 * an empty day (see the daily-content guarantee).
 *
 * When `includeDrafts` is true (검수 모드), unreviewed draft cards take precedence so the
 * owner can review them in-app. Drafts carry no `reviewedAt`, so isPublishable() stays
 * false and the UI badges them 미발행 — they never leak into the default (published) view.
 */
export function getDailyContext(isoDate: string, includeDrafts = false): DailyContext {
  if (includeDrafts) {
    const draft = draftCardsByMonthDay[monthDay(isoDate)];
    if (draft) {
      return { date: isoDate, ...draft };
    }
  }

  const card = seedCardsByMonthDay[monthDay(isoDate)];
  if (card) {
    return { date: isoDate, ...card };
  }

  const entry = resolveDay(isoDate, seedCalendar);

  if (entry.lunarKey) {
    if (includeDrafts) {
      const draftLunar = draftCardsByLunarKey[entry.lunarKey];
      if (draftLunar) {
        return { date: isoDate, ...draftLunar };
      }
    }
    const lunarCard = seedCardsByLunarKey[entry.lunarKey];
    if (lunarCard) {
      return { date: isoDate, ...lunarCard };
    }
  }

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
