import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "登录",
        }}
      />
      <Stack.Screen
        name="modalRegister"
        options={{
          presentation: "card",
          headerShown: true,
          title: "注册账号",
          headerBackTitle: "返回",
          headerTintColor: "#000", //text-gray-500
          headerTitleStyle: {
            fontWeight: "normal",
          },
        }}
      />
      <Stack.Screen
        name="modalForgetPwd"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "忘记密码",
          headerBackTitle: "返回",
        }}
      />
    </Stack>
  );
}
