import { toIsoDate } from "@datemine/domain";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";
import { publishedIsoDates } from "./upcoming";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build the day cells for a month, padded so the 1st lands on its weekday. Each cell
 * carries a stable key (iso for real days, a namespaced pad key for blanks). */
function monthCells(year: number, month0: number): { key: string; iso: string | null }[] {
  const first = new Date(year, month0, 1).getDay();
  const days = new Date(year, month0 + 1, 0).getDate();
  const cells: { key: string; iso: string | null }[] = [];
  for (let i = 0; i < first; i++) cells.push({ key: `lead-${year}-${month0}-${i}`, iso: null });
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${pad(month0 + 1)}-${pad(d)}`;
    cells.push({ key: iso, iso });
  }
  for (let i = cells.length; i % 7 !== 0; i++)
    cells.push({ key: `tail-${year}-${month0}-${i}`, iso: null });
  return cells;
}

export function Calendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (isoDate: string) => void;
}): React.JSX.Element {
  const [view, setView] = useState(() => ({
    year: Number(selected.slice(0, 4)),
    month0: Number(selected.slice(5, 7)) - 1,
  }));
  const today = toIsoDate(new Date());
  const marked = publishedIsoDates(view.year);
  const cells = monthCells(view.year, view.month0);

  const stepMonth = (delta: number) => {
    const d = new Date(view.year, view.month0 + delta, 1);
    setView({ year: d.getFullYear(), month0: d.getMonth() });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Pressable style={styles.navBtn} onPress={() => stepMonth(-1)} accessibilityLabel="이전 달">
          <Text style={styles.navText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>
          {view.year}년 {view.month0 + 1}월
        </Text>
        <Pressable style={styles.navBtn} onPress={() => stepMonth(1)} accessibilityLabel="다음 달">
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEK_LABELS.map((w) => (
          <Text key={w} style={styles.weekLabel}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map(({ key, iso }) => {
          if (!iso) return <View key={key} style={styles.cell} />;
          const day = Number(iso.slice(8));
          const isMarked = marked.has(iso);
          const isSelected = iso === selected;
          const isToday = iso === today;
          return (
            <Pressable
              key={iso}
              style={[
                styles.cell,
                styles.dayCell,
                isMarked && styles.marked,
                isSelected && styles.selected,
              ]}
              onPress={() => onSelect(iso)}
            >
              <Text
                style={[
                  styles.dayText,
                  isMarked && styles.markedText,
                  isSelected && styles.selectedText,
                  isToday && !isSelected && styles.todayText,
                ]}
              >
                {day}
              </Text>
              {isToday && <View style={styles.todayDot} />}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.legend}>● 밝은 날 = 조심할 데이터가 있는 날</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { color: theme.color.text, fontSize: 24, fontWeight: "700" },
  title: { color: theme.color.text, fontSize: theme.font.body, fontWeight: "700" },
  weekRow: { flexDirection: "row" },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "600",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCell: { borderRadius: theme.radius.md },
  dayText: { color: theme.color.textMuted, fontSize: theme.font.body },
  marked: { backgroundColor: "#2A1518", borderWidth: 1, borderColor: theme.color.accent },
  markedText: { color: theme.color.text, fontWeight: "700" },
  selected: { backgroundColor: theme.color.accent, borderColor: theme.color.accent },
  selectedText: { color: "#0B0B0F", fontWeight: "800" },
  todayText: { color: theme.color.text },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.color.accent,
    marginTop: 1,
  },
  legend: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    opacity: 0.8,
    textAlign: "center",
  },
});
