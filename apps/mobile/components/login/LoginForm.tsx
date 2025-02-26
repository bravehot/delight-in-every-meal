import { useState, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useForm } from "react-hook-form";
import { withStyles } from "@ui-kitten/components";
import { Link } from "expo-router";

import LoginSmsForm from "./LoginSmsForm";
import LoginPwdForm from "./LoginPwdForm";
import AntDesign from "@expo/vector-icons/AntDesign";

import type { ThemedComponentProps } from "@ui-kitten/components";
import type { ILoginByPasswordReq } from "@repo/api-interface";

type FormData = ILoginByPasswordReq;

interface LoginFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ eva, className = "" }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });

  const [state, setState] = useState<{ loginType: "password" | "phone" }>({
    loginType: "password",
  });

  const phoneNum = watch("phoneNum");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 表单提交函数
  const onSubmit = async (data: FormData) => {
    try {
      // TODO: 调用登录 API
      console.log(data);
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  const handleRegister = () => {};

  const handleChangeLoginType = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setState((prevState) => ({
        ...prevState,
        loginType: prevState.loginType === "password" ? "phone" : "password",
      }));
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View className={`flex h-full p-[20px] ${className}`}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {state.loginType === "password" ? <LoginPwdForm /> : <LoginSmsForm />}
      </Animated.View>

      <Pressable
        className="mx-auto mt-auto items-center"
        onPress={handleChangeLoginType}
      >
        <Text className="mb-[10px] text-gray-500">
          {state.loginType === "password" ? "手机号登录" : "密码登录"}
        </Text>

        <AntDesign
          className="rounded-full w-[55px] h-[55px] flex items-center justify-center"
          name={state.loginType === "password" ? "mobile1" : "key"}
          size={24}
          style={{
            backgroundColor: "#f7f7f7",
            textAlign: "center",
            lineHeight: 55,
          }}
        />
      </Pressable>

      <View>
        <Pressable
          onPress={handleRegister}
          className="flex-row w-full justify-center text-sm mt-[10px]"
        >
          <Text className="text-gray-500 mr-[4px]" numberOfLines={1}>
            还没有账号？
          </Text>
          <Link href={"/login/modalRegister"} asChild>
            <Text
              className="font-medium"
              style={{ color: eva?.theme?.["color-primary-400"] || "#FB923C" }}
              numberOfLines={1}
            >
              立即注册
            </Text>
          </Link>
        </Pressable>
      </View>
    </View>
  );
};

export default withStyles(LoginForm);
