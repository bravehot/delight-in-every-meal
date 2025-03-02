import { useEffect, useState } from "react";
import {
  useColorScheme,
  Appearance,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import * as SplashScreen from "expo-splash-screen";
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

// 防止闪屏自动隐藏
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    AlibabaPuHuiTi: require("../assets/fonts/AlibabaPuHuiTi-3-45-Light.ttf"),
    AlimamaAgileVF: require("../assets/fonts/AlimamaAgileVF-Thin.ttf"),
  });

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.replace("/login");
  //   }, 1000);
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider
        {...eva}
        theme={{
          ...(currentTheme === "dark" ? eva.dark : eva.light),
          ...theme,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
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
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ApplicationProvider>
      <Toast />
    </QueryClientProvider>
  );
}
