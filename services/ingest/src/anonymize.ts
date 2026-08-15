import type { PersonaDomain, RiskPattern, Severity } from "@datemine/domain";
import type { RawCaseRecord } from "./raw";

export interface AnonymizeInput {
  /** The recurring failure type (no name). */
  readonly pattern: string;
  readonly whyItBackfires: string;
  /** Anonymized case summary — author must have removed names already. */
  readonly exampleSummary: string;
  readonly severity: Severity;
}

/**
 * Build a publishable RiskPattern from raw cases + an authored anonymized summary.
 * The raw `who` is dropped by construction. As a safety net, this throws if any raw
 * name still appears in the published text, so a leak fails loudly instead of shipping.
 */
export function toRiskPattern(cases: readonly RawCaseRecord[], input: AnonymizeInput): RiskPattern {
  const names = cases.map((c) => c.who.trim()).filter((n) => n.length > 0);
  const publishedText = `${input.pattern}\n${input.whyItBackfires}\n${input.exampleSummary}`;
  for (const name of names) {
    if (publishedText.includes(name)) {
      throw new Error(
        `Anonymization leak: real name "${name}" appears in published text. Remove it before publishing.`,
      );
    }
  }

  const category = cases[0]?.category;
  const domains = dedupeDomains(cases);

  return {
    pattern: input.pattern,
    whyItBackfires: input.whyItBackfires,
    exampleSummary: input.exampleSummary,
    severity: input.severity,
    ...(category ? { category } : {}),
    ...(domains.length > 0 ? { domains } : {}),
  };
}

function dedupeDomains(cases: readonly RawCaseRecord[]): PersonaDomain[] {
  const seen = new Set<PersonaDomain>();
  for (const c of cases) {
    for (const d of c.domains) seen.add(d);
  }
  return [...seen];
}
