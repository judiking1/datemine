import type { DayType } from "./published";

/**
 * A single dated entry in the Korean calendar backbone (Layer 2, no personal data).
 * Fixed-date events (holidays, anniversaries) and computed events (solar terms) are
 * both represented as concrete dated records after resolution.
 */
export interface CalendarEntry {
  /** ISO yyyy-mm-dd. */
  readonly date: string;
  readonly dayType: DayType;
  /** Short name of the day, e.g. "광복절", "초복". */
  readonly name: string;
  /** Educational meaning. */
  readonly significance: string;
  /**
   * Stable identity for lunar holidays whose solar date shifts each year (e.g.
   * "seollal", "chuseok"). Lets published cards be keyed independently of the year.
   */
  readonly lunarKey?: string;
}

/**
 * Fixed solar-date events that recur every year (month-day). Solar terms (절기) shift
 * slightly year to year and are supplied per-year via `solarTermsByYear`, so they are
 * NOT listed here.
 */
export interface FixedEvent {
  readonly month: number; // 1-12
  readonly day: number; // 1-31
  readonly dayType: DayType;
  readonly name: string;
  readonly significance: string;
}

/** A lunar holiday's solar occurrence in a given year. */
export interface LunarHolidayOccurrence {
  readonly name: string;
  readonly significance: string;
  readonly dayType: DayType;
  /** Stable identity across years (e.g. "seollal", "chuseok"). */
  readonly lunarKey: string;
}

export interface CalendarData {
  readonly fixedEvents: readonly FixedEvent[];
  /** Solar terms per year: year -> (yyyy-mm-dd -> {name, significance}). */
  readonly solarTermsByYear: Readonly<
    Record<number, Readonly<Record<string, { name: string; significance: string }>>>
  >;
  /**
   * Lunar holidays per year mapped to their solar date: year -> (yyyy-mm-dd -> occurrence).
   * Lunar dates shift yearly, so they are supplied per year like solar terms.
   */
  readonly lunarHolidaysByYear: Readonly<
    Record<number, Readonly<Record<string, LunarHolidayOccurrence>>>
  >;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Resolve the calendar meaning of a given day. Priority: fixed named events first,
 * then solar terms. Every day resolves to a non-null entry — a day with no special
 * meaning still returns an `ordinary` entry so the app never shows an empty card.
 * An empty resolution is a bug (see the daily-content guarantee in ARCHITECTURE.md).
 */
export function resolveDay(isoDate: string, data: CalendarData): CalendarEntry {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const fixed = data.fixedEvents.find((e) => e.month === month && e.day === day);
  if (fixed) {
    return {
      date: isoDate,
      dayType: fixed.dayType,
      name: fixed.name,
      significance: fixed.significance,
    };
  }

  const lunar = data.lunarHolidaysByYear[year]?.[isoDate];
  if (lunar) {
    return {
      date: isoDate,
      dayType: lunar.dayType,
      name: lunar.name,
      significance: lunar.significance,
      lunarKey: lunar.lunarKey,
    };
  }

  const term = data.solarTermsByYear[year]?.[isoDate];
  if (term) {
    return {
      date: isoDate,
      dayType: "solarTerm",
      name: term.name,
      significance: term.significance,
    };
  }

  return {
    date: isoDate,
    dayType: "ordinary",
    name: "평범한 날",
    significance: "특별한 절기·기념일은 아니지만, 오늘도 실언 한 줄에 하루가 무너질 수 있다.",
  };
}
