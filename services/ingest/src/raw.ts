import type { PersonaDomain, RiskCategory } from "@datemine/domain";

/**
 * Layer 1 — internal-only research record. Contains real names. MUST NOT be exported
 * to the app, the public API, published data, logs, or version control (see AGENTS.md
 * hard rules and .gitignore). It exists solely to derive anonymized Layer 2 patterns.
 */
export interface RawCaseRecord {
  readonly id: string;
  /** yyyy-mm-dd when the incident occurred. */
  readonly occurredOn: string;
  readonly category: RiskCategory;
  readonly domains: readonly PersonaDomain[];
  /** Real name — internal only, never published. */
  readonly who: string;
  /** What was said/done. */
  readonly what: string;
  /** What happened as a result. */
  readonly consequence: string;
  /** Public reporting URLs (>= 1, 2+ recommended). */
  readonly sources: readonly string[];
  /** Recurring-event key (e.g. "08-15") when the risk repeats annually. */
  readonly recurrence?: string;
}

export function isValidRawCase(record: RawCaseRecord): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(record.occurredOn) &&
    record.who.trim().length > 0 &&
    record.what.trim().length > 0 &&
    record.sources.length > 0
  );
}
