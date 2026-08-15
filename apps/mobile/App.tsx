import { toIsoDate } from "@datemine/domain";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getDailyContext } from "./src/getToday";
import { theme } from "./src/theme";
import { TodayCard } from "./src/TodayCard";

export default function App(): React.JSX.Element {
  const today = toIsoDate(new Date());
  const context = getDailyContext(today);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.brand}>datemine</Text>
          <Text style={styles.tagline}>오늘, 무슨 말은 참아야 할까</Text>
          <TodayCard context={context} />
        </ScrollView>
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
  brand: {
    color: theme.color.accent,
    fontSize: theme.font.heading,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
    marginBottom: theme.space.sm,
  },
});
