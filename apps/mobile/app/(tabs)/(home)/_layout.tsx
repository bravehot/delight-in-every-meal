import { Stack } from "expo-router";
import { Platform } from "react-native";

import { stackDefaultOptions } from "@/constant";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="healthModal"
        options={{
          presentation: Platform.OS === "ios" ? "modal" : "card",
          headerShown: Platform.OS !== "ios",
          title: "健康信息",
          ...stackDefaultOptions,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
