import { useEffect, useState } from "react";
import { useColorScheme, Appearance } from "react-native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import Toast from "react-native-toast-message";

import * as eva from "@eva-design/eva";

import useGlobalStore from "@/store";

import theme from "./theme.json";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
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
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider
        {...eva}
        theme={{
          ...(currentTheme === "dark" ? eva.dark : eva.light),
          ...theme,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ApplicationProvider>
      <Toast />
    </QueryClientProvider>
  );
}
