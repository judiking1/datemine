/**
 * Layer 2 — Published domain types. These are the ONLY shapes that ever reach the
 * client. They must never carry a real name or personally identifying information.
 * The raw research layer (RawCaseRecord, names included) lives in services/ingest
 * and must not be importable from here or from any app package.
 */

export type DayType =
  | "holiday"
  | "memorial"
  | "anniversary"
  | "election"
  | "solarTerm"
  | "ordinary";

export type Severity = 1 | 2 | 3;

export interface RiskPattern {
  /** The recurring failure type (not a person). */
  readonly pattern: string;
  /** Why this backfires. */
  readonly whyItBackfires: string;
  /** Anonymized case summary — no names, no identifying details. */
  readonly exampleSummary: string;
  readonly severity: Severity;
}

export interface DailyContext {
  /** ISO yyyy-mm-dd (solar/Gregorian). */
  readonly date: string;
  /** Optional lunar date label. */
  readonly lunar?: string;
  readonly dayType: DayType;
  /** Educational meaning of the day. */
  readonly significance: string;
  readonly riskPatterns: readonly RiskPattern[];
  /** Blunt "watch what you say today" copy. */
  readonly advice: string;
  /**
   * When the human review gate passed. Absent = NOT published; such content must
   * never be served to the client.
   */
  readonly reviewedAt?: string;
}

/** A DailyContext is publishable only after passing the human review gate. */
export function isPublishable(context: DailyContext): boolean {
  return typeof context.reviewedAt === "string" && context.reviewedAt.length > 0;
}
