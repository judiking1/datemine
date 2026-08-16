import { toIsoDate } from "@datemine/domain";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function shift(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

function label(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  const weekday = WEEKDAYS[new Date(`${isoDate}T00:00:00`).getDay()];
  return `${Number(month)}월 ${Number(day)}일 (${weekday})`;
}

export function DateNav({
  date,
  onChange,
}: {
  date: string;
  onChange: (isoDate: string) => void;
}): React.JSX.Element {
  const today = toIsoDate(new Date());
  const isToday = date === today;

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.arrow}
        onPress={() => onChange(shift(date, -1))}
        accessibilityLabel="이전 날"
      >
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>

      <Pressable style={styles.center} onPress={() => onChange(today)} disabled={isToday}>
        <Text style={styles.date}>{label(date)}</Text>
        {!isToday && <Text style={styles.reset}>오늘로</Text>}
      </Pressable>

      <Pressable
        style={styles.arrow}
        onPress={() => onChange(shift(date, 1))}
        accessibilityLabel="다음 날"
      >
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.xs,
  },
  arrow: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
  },
  arrowText: {
    color: theme.color.text,
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  date: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: "700",
  },
  reset: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "700",
  },
});
