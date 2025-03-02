import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useGlobalStore from "@/store";
import { getUserInfo } from "@/service/home";

import { USER_TOKEN_KEY } from "@/types";

export default function TabLayout() {
  const { updateUserInfo } = useGlobalStore();

  const router = useRouter();
  const { mutate: getUserInfoMutate } = useMutation({
    mutationFn: getUserInfo,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY.ACCESS_TOKEN);
      if (token) {
        getUserInfoMutate(undefined, {
          onSuccess: (res) => {
            updateUserInfo(res.data);
          },
          onError: (_error) => {
            router.replace("/login");
          },
        });
      }
    };
    getUserInfo();
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
          name="(home)"
          options={{
            title: "首页",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
            tabBarActiveBackgroundColor: "transparent",
          }}
        />
        <Tabs.Screen
          name="recognize"
          options={{
            title: "识别",
            tabBarIcon: ({ color }) => (
              <AntDesign name="camerao" size={24} color={color} />
            ),
            tabBarActiveBackgroundColor: "transparent",
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "我的",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
            tabBarActiveBackgroundColor: "transparent",
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
