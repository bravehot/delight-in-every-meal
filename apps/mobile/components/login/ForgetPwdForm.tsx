import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";

import InputForm from "../InputForm";
import CaptureModal from "./CaptureModal";

import type { ThemedComponentProps } from "@ui-kitten/components";
import { SmsCodeType, type IForgetPasswordReq } from "@repo/api-interface";

interface ForgetPwdFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}

type FormData = IForgetPasswordReq;

const ForgetPwdForm: React.FC<ForgetPwdFormProps> = ({
  eva,
  className = "",
}) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const [state, setState] = useState({ visible: false, countdown: 0 });
  const phoneNum = watch("phoneNum");

  const getCaptchaModal = async () => {
    const isVaild = await trigger(["phoneNum"]);
    if (!isVaild) return;

    setState((prevState) => ({ ...prevState, visible: true }));
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

      <CaptureModal
        phoneNum={phoneNum}
        smsType={SmsCodeType.FORGET_PASSWORD_CODE_KEY}
        visible={state.visible}
        close={(visible) => {
          setState((prevState) => ({ ...prevState, visible }));
        }}
        sendSuccess={handleSendSmsSuccess}
      />
    </View>
  );
};

export default ForgetPwdForm;
