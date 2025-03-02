import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui-kitten/components";

import useGlobalStore from "@/store";
import { getUserHealth } from "@/service/home";

export default function Home() {
  const { userHealth, updateUserHealth } = useGlobalStore();
  const router = useRouter();

  const { mutate: getUserHealthMutate } = useMutation({
    mutationFn: () => getUserHealth(),
  });

  useEffect(() => {
    getUserHealthMutate(undefined, {
      onSuccess: (data) => {
        updateUserHealth(data.data);
      },
      onError: () => {
        router.push("/(tabs)/(home)/healthModal");
      },
    });
  }, []);

  return (
    <View className="bg-red-50 h-full">
      <Text style={{ fontFamily: "AlimamaAgileVF_Thin" }}>Recipe</Text>
      <Button>Button</Button>
    </View>
  );
}
