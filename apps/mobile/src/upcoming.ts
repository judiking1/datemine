import type { DayType, RiskCategory, RiskPattern, Severity } from "@datemine/domain";
import { promotedByLunarKey, promotedByMonthDay } from "./data/published";
import { seedCalendar, seedCardsByLunarKey, seedCardsByMonthDay } from "./data/seed";

/** One row in the reference calendar: a published high-signal day. */
export type ReferenceEntry = {
  /** "MM-DD" for fixed days, or "lunar:<key>" for lunar holidays (date shifts yearly). */
  key: string;
  label: string;
  dayType: DayType;
  significance: string;
  topSeverity: Severity;
  categories: RiskCategory[];
};

const LUNAR_LABEL: Record<string, string> = {
  seollal: "설날",
  chuseok: "추석",
};

type Card = { dayType: DayType; significance: string; riskPatterns: readonly RiskPattern[] };

function summarize(
  card: Card,
): Pick<ReferenceEntry, "dayType" | "significance" | "topSeverity" | "categories"> {
  const topSeverity = card.riskPatterns.reduce<Severity>(
    (max, r) => (r.severity > max ? r.severity : max),
    1,
  );
  const categories = Array.from(
    new Set(
      card.riskPatterns.map((r) => r.category).filter((c): c is RiskCategory => c !== undefined),
    ),
  );
  return { dayType: card.dayType, significance: card.significance, topSeverity, categories };
}

/** Union of hand-written seed cards and promoted cards, keyed by MM-DD. */
function allFixedCards(): Record<string, Card> {
  return { ...seedCardsByMonthDay, ...promotedByMonthDay };
}

/**
 * Flatten every published card into a reference list, sorted by calendar order.
 * Lunar holidays sort last (no fixed MM-DD).
 */
export function referenceEntries(): ReferenceEntry[] {
  const fixed: ReferenceEntry[] = Object.entries(allFixedCards()).map(([key, card]) => {
    const [month, day] = key.split("-");
    return {
      key,
      label: `${Number(month)}월 ${Number(day)}일`,
      ...summarize(card),
    };
  });

  const lunarCards = { ...seedCardsByLunarKey, ...promotedByLunarKey };
  const lunar: ReferenceEntry[] = Object.entries(lunarCards).map(([lunarKey, card]) => ({
    key: `lunar:${lunarKey}`,
    label: `${LUNAR_LABEL[lunarKey] ?? lunarKey} (음력)`,
    ...summarize(card),
  }));

  fixed.sort((a, b) => a.key.localeCompare(b.key));
  return [...fixed, ...lunar];
}

/** ISO dates (for the given year) that have a published card — used to light up the calendar. */
export function publishedIsoDates(year: number): Set<string> {
  const set = new Set<string>();
  for (const entry of referenceEntries()) {
    const iso = resolveEntryDate(entry, year);
    if (iso) set.add(iso);
  }
  return set;
}

/**
 * Resolve a reference entry to an ISO date in the given year so the UI can jump to it.
 * Fixed "MM-DD" keys map directly; lunar keys look up that year's solar date in the
 * calendar (returns undefined if that year isn't seeded yet).
 */
export function resolveEntryDate(entry: ReferenceEntry, year: number): string | undefined {
  if (!entry.key.startsWith("lunar:")) {
    return `${year}-${entry.key}`;
  }
  const lunarKey = entry.key.slice("lunar:".length);
  const yearMap = seedCalendar.lunarHolidaysByYear[year];
  if (!yearMap) return undefined;
  for (const [isoDate, holiday] of Object.entries(yearMap)) {
    if (holiday.lunarKey === lunarKey) return isoDate;
  }
  return undefined;
}
