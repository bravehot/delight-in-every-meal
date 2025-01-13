import { Stack, router } from "expo-router";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";

export default function RootLayout() {
  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <GluestackUIProvider mode="light">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </GluestackUIProvider>
  );
}
