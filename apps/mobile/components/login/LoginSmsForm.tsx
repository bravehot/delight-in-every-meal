import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, Modal, withStyles } from "@ui-kitten/components";

import InputForm from "@/components/InputForm";

import { getCaptcha } from "@/service/login";

import type { ThemedComponentProps } from "@ui-kitten/components";
import type { ILogin } from "@repo/api-interface";
import CaptureModal from "./CaptureModal";

type FormData = ILogin;

interface LoginFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}

const LoginSmsForm: React.FC<LoginFormProps> = ({ eva, className = "" }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });

  const [state, setState] = useState({ visible: false, countdown: 0 });

  const phoneNum = watch("phoneNum");

  // 处理获取验证码
  const handleGetCode = async () => {
    if (errors.phoneNum || state.countdown > 0) return;

    try {
      // TODO: 调用发送验证码 API
      // await sendSmsCode(phoneNum);
      // 开始倒计时
      setState((prevState) => ({ ...prevState, countdown: 60 }));
      const timer = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          countdown: prevState.countdown - 1,
        }));
      }, 1000);
    } catch (error) {
      console.error("发送验证码失败:", error);
    }
  };

  const getCaptchaModal = () => {
    setState((prevState) => ({ ...prevState, visible: true }));
  };

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

            <Pressable
              className="absolute right-0"
              onPress={getCaptchaModal}
              disabled={state.countdown > 0 || !phoneNum || !!errors.phoneNum}
            >
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
        visible={state.visible}
        close={(visible) => {
          setState((prevState) => ({ ...prevState, visible }));
        }}
      />
    </View>
  );
};

export default withStyles(LoginSmsForm);
