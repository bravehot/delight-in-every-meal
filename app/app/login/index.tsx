import { ImageBackground, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import LoginForm from "@/components/login/LoginForm";

import backgroundImage from "@/assets/images/login/login-bg.png";
import logoImage from "@/assets/images/icon.png";

export default function Login() {
  return (
    <View className="flex-1">
      <ImageBackground
        source={backgroundImage}
        className="flex-1 w-full absolute inset-0"
      />
      <View className="h-[60%] w-[80%] m-auto">
        <View>
          <Image
            source={logoImage}
            style={styles.imageContainer}
            contentFit="cover"
            transition={1000}
          />
          <Text
            className="text-center my-8 text-2xl"
            style={{
              fontFamily: "AlimamaAgileVF_Thin",
              letterSpacing: 10,
            }}
          >
            每一餐都值得享受
          </Text>
        </View>
        <View className="flex-1">
          <LoginForm />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 96,
    height: 96,
    marginHorizontal: "auto",
  },
});
