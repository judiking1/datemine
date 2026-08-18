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

import type { PersonaDomain, RiskCategory } from "./taxonomy";

export type Severity = 1 | 2 | 3;

export interface RiskPattern {
  /** The recurring failure type (not a person). */
  readonly pattern: string;
  /** Why this backfires. */
  readonly whyItBackfires: string;
  /** Anonymized case summary — no names, no identifying details. */
  readonly exampleSummary: string;
  readonly severity: Severity;
  /** Axis A tag (docs/DATA-PIPELINE.md). Optional until content is fully tagged. */
  readonly category?: RiskCategory;
  /** Axis B tags — which personas this applies to (for later personalization). */
  readonly domains?: readonly PersonaDomain[];
}

export interface DailyContext {
  /** ISO yyyy-mm-dd (solar/Gregorian). */
  readonly date: string;
  /** Optional lunar date label. */
  readonly lunar?: string;
  readonly dayType: DayType;
  /** Punchy one-line headline — the phrase that sticks at a glance (제품 정체성). */
  readonly hook?: string;
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
  /**
   * "오늘의 눈치" — a general daily caution shown on days with no specific event, so every
   * day has something. Not tied to a real incident; it's brand-voice general wisdom.
   */
  readonly fortune?: {
    readonly level: Severity;
    readonly theme: string;
  };
}

/** A DailyContext is publishable only after passing the human review gate. */
export function isPublishable(context: DailyContext): boolean {
  return typeof context.reviewedAt === "string" && context.reviewedAt.length > 0;
}
