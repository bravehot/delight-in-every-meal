import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Button, withStyles } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";
import InputForm from "@/components/InputForm";
import CaptureModal from "./CaptureModal";

import { loginBySms } from "@/service/login";
import useGlobalStore from "@/store";

import { SmsCodeType, type ILoginReq } from "@repo/api-interface";
import type { ThemedComponentProps } from "@ui-kitten/components";
import type { SubmitHandler } from "react-hook-form";

type FormData = ILoginReq;

interface LoginFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}

const LoginSmsForm: React.FC<LoginFormProps> = ({ eva, className = "" }) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const router = useRouter();

  const [state, setState] = useState({ visible: false, countdown: 0 });
  const phoneNum = watch("phoneNum");
  const { updateUserInfo } = useGlobalStore();

  const getCaptchaModal = async () => {
    const isVaild = await trigger(["phoneNum"]);
    if (!isVaild) return;

    setState((prevState) => ({ ...prevState, visible: true }));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { data: loginRes } = await loginBySms(data);
      AsyncStorage.setItem("authToken", loginRes.accessToken);
      AsyncStorage.setItem("refreshToken", loginRes.refreshToken);
      updateUserInfo(loginRes);
      Toast.show({
        type: "success",
        text1: "登录成功",
      });
      router.replace("/");
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  const handleSendSmsSuccess = (isSuccess: boolean) => {
    if (isSuccess) {
      setState((prevState) => ({ ...prevState, countdown: 60 }));
      setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          countdown: prevState.countdown - 1,
        }));
      }, 1000);
    }
  };

  return (
    <View className={`flex w-full ${className}`}>
      <Controller
        control={control}
        name="phoneNum"
        rules={{
          required: "请输入中国大陆手机号",
          pattern: {
            value: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号格式",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputForm
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="请输入中国大陆手机号"
            value={value}
            maxLength={11}
            className="text-gray-500 tracking-widest"
          />
        )}
      />

      {errors.phoneNum && (
        <Text className="text-red-500 text-sm mt-1">
          {errors.phoneNum.message}
        </Text>
      )}

      <Controller
        control={control}
        name="smsCode"
        rules={{
          required: "请输入短信验证码",
          pattern: {
            value: /^\d{4}$/,
            message: "请输入短信验证码",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-row mt-[20px] gap-[10px] items-center">
            <View className="flex-1 relative">
              <InputForm
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="请输入短信验证码"
                value={value}
                maxLength={4}
                className="text-gray-500 tracking-widest"
              />
            </View>

            <Pressable className="absolute right-0" onPress={getCaptchaModal}>
              <Text
                className={`text-base w-full text-right font-medium`}
                style={{
                  color: eva?.theme?.["color-primary-400"] || "#FB923C",
                }}
              >
                {state.countdown > 0
                  ? `${state.countdown}s后重试`
                  : "获取短信验证码"}
              </Text>
            </Pressable>
          </View>
        )}
      />

      {errors.smsCode && (
        <Text className="text-red-500 text-sm mt-1">
          {errors.smsCode.message}
        </Text>
      )}

      <Button
        className="mt-[20px]"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text className="text-white">
          {isSubmitting ? "登录中..." : "登录"}
        </Text>
      </Button>

      <CaptureModal
        phoneNum={phoneNum}
        smsType={SmsCodeType.LOGIN_CODE_KEY}
        visible={state.visible}
        close={(visible) => {
          setState((prevState) => ({ ...prevState, visible }));
        }}
        sendSuccess={handleSendSmsSuccess}
      />
    </View>
  );
};

export default withStyles(LoginSmsForm);
