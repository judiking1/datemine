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

/** Severity → accent intensity label + color. */
export function severityColor(severity: 1 | 2 | 3): string {
  if (severity >= 3) return "#FF4D4D";
  if (severity === 2) return "#FF9F45";
  return "#FFD166";
}
