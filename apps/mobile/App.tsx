import { toIsoDate } from "@datemine/domain";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "./src/Calendar";
import { DateNav } from "./src/DateNav";
import { getDailyContext } from "./src/getToday";
import { theme } from "./src/theme";
import { TodayCard } from "./src/TodayCard";

export default function App(): React.JSX.Element {
  const today = toIsoDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const context = getDailyContext(selectedDate);
  const isToday = selectedDate === today;

  const pick = (isoDate: string) => {
    setSelectedDate(isoDate);
    setCalendarOpen(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>datemine</Text>
              {!isToday && (
                <Pressable style={styles.todayBtn} onPress={() => setSelectedDate(today)}>
                  <Text style={styles.todayBtnText}>오늘로</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.tagline}>오늘, 무슨 말은 참아야 할까</Text>
          </View>

          <DateNav
            date={selectedDate}
            onChange={setSelectedDate}
            onOpenCalendar={() => setCalendarOpen(true)}
          />
          <TodayCard context={context} />

          <Text style={styles.footer}>
            공개 보도로 반복 확인된 유형을 익명화한 자료입니다. 특정 개인·단체를 지목하지
            않습니다.
          </Text>
        </ScrollView>

        <Modal
          visible={calendarOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setCalendarOpen(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setCalendarOpen(false)}>
            <Pressable style={styles.popover} onPress={() => {}}>
              <Calendar selected={selectedDate} onSelect={pick} />
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  scroll: {
    padding: theme.space.lg,
    gap: theme.space.md,
  },
  header: {
    gap: theme.space.xs,
    marginBottom: theme.space.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: theme.color.accent,
    fontSize: theme.font.heading,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  todayBtn: {
    borderWidth: 1,
    borderColor: theme.color.accent,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
  },
  todayBtnText: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "700",
  },
  tagline: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
  },
  footer: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    lineHeight: 18,
    opacity: 0.7,
    marginTop: theme.space.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: theme.space.lg,
  },
  popover: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
  },
});
