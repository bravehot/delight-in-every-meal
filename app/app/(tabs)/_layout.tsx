import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import useGlobalStore from "@/store";
import { View } from "react-native";

export default function TabLayout() {
  const { systemColorScheme } = useGlobalStore();
  return (
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

      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
