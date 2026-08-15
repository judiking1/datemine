/** Shared design tokens. Keep hardcoded colors/spacing out of components. */
export const theme = {
  color: {
    bg: "#0B0B0F",
    surface: "#16161D",
    text: "#F5F5F7",
    textMuted: "#A1A1AA",
    accent: "#FF4D4D",
    border: "#26262F",
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    md: 12,
    lg: 20,
  },
  font: {
    title: 26,
    heading: 18,
    body: 15,
    caption: 13,
  },
} as const;

/** Severity → color + short Korean label, so intensity reads without relying on color alone. */
export function severityMeta(severity: 1 | 2 | 3): { color: string; label: string } {
  if (severity >= 3) return { color: "#FF4D4D", label: "위험" };
  if (severity === 2) return { color: "#FF9F45", label: "주의" };
  return { color: "#FFD166", label: "유의" };
}

/** Back-compat: color only. */
export function severityColor(severity: 1 | 2 | 3): string {
  return severityMeta(severity).color;
}
