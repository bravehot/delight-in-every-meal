import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

import useGlobalStore from "@/store";

export default function TabLayout() {
  const { systemColorScheme } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#FB923C",
          tabBarStyle: {
            shadowColor: "transparent",
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          },
        }}
      >
        <Tabs.Screen
          name="recipe"
          options={{
            title: "食谱",
            tabBarIcon: ({ color }) => (
              <AntDesign name="book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "识别",
            tabBarIcon: ({ color }) => (
              <AntDesign name="camerao" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "我的",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
