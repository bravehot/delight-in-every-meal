import { Image } from "expo-image";
import { ImageBackground, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import backgroundImage from "@/assets/images/login-bg.png";

export default function Login() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={backgroundImage}
        className="flex-1 w-full absolute inset-0"
      />
    </View>
  );
}
