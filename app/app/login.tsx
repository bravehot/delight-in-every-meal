import { ImageBackground, View } from "react-native";

import backgroundImage from "@/assets/images/login-bg.png";

export default function Login() {
  return (
    <View className="flex-1">
      <ImageBackground
        source={backgroundImage}
        className="flex-1 w-full absolute inset-0"
      />
    </View>
  );
}
