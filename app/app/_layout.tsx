import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { useColorScheme, Appearance } from "react-native";

import useGlobalStore from "@/store";

import theme from "./theme.json";
import "../global.css";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { updateSystemColorScheme } = useGlobalStore();

  const [currentTheme, setCurrentTheme] = useState(systemColorScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentTheme(colorScheme);
      updateSystemColorScheme(colorScheme);
    });
    updateSystemColorScheme(systemColorScheme);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ApplicationProvider
      {...eva}
      theme={{
        ...(currentTheme === "dark" ? eva.dark : eva.light),
        ...theme,
      }}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </ApplicationProvider>
  );
}
