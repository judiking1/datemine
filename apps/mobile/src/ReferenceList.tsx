import { type RiskCategory, riskCategoryLabel } from "@datemine/domain";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { severityMeta, theme } from "./theme";
import { type ReferenceEntry, referenceEntries, resolveEntryDate } from "./upcoming";

function Row({
  entry,
  onSelect,
}: {
  entry: ReferenceEntry;
  onSelect?: ((isoDate: string) => void) | undefined;
}): React.JSX.Element {
  const sev = severityMeta(entry.topSeverity);
  const cats = entry.categories.map((c: RiskCategory) => riskCategoryLabel(c)).join(" · ");
  const target = resolveEntryDate(entry, new Date().getFullYear());
  const jump = onSelect && target ? () => onSelect(target) : undefined;

  return (
    <Pressable style={[styles.row, { borderLeftColor: sev.color }]} onPress={jump} disabled={!jump}>
      <View style={styles.rowTop}>
        <Text style={styles.date}>{entry.label}</Text>
        <View style={[styles.sevDot, { backgroundColor: sev.color }]} />
      </View>
      <Text style={styles.significance} numberOfLines={2}>
        {entry.significance}
      </Text>
      {cats.length > 0 && <Text style={styles.cats}>{cats}</Text>}
    </Pressable>
  );
}

/** Reference almanac: every published (reviewed) high-signal day, in calendar order. */
export function ReferenceList({
  onSelect,
}: {
  onSelect?: (isoDate: string) => void;
}): React.JSX.Element {
  const entries = referenceEntries();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>조심해야 할 날들</Text>
        <Text style={styles.sectionCount}>{entries.length}</Text>
      </View>
      {entries.map((entry) => (
        <Row key={entry.key} entry={entry} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.space.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm,
    marginBottom: theme.space.xs,
  },
  sectionTitle: {
    color: theme.color.text,
    fontSize: theme.font.heading,
    fontWeight: "700",
  },
  sectionCount: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "800",
  },
  row: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderLeftWidth: 3,
    padding: theme.space.md,
    gap: theme.space.xs,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: "700",
  },
  sevDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  significance: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    lineHeight: 18,
  },
  cats: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "600",
    opacity: 0.8,
  },
});
