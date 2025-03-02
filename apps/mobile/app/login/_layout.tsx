import { Stack } from "expo-router";

import { stackDefaultOptions } from "@/constant";

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
          ...stackDefaultOptions,
        }}
      />
      <Stack.Screen
        name="modalForgetPwd"
        options={{
          presentation: "card",
          headerShown: true,
          title: "忘记密码",
          ...stackDefaultOptions,
        }}
      />
    </Stack>
  );
}
