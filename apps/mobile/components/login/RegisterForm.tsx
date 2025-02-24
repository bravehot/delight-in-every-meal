import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

import { Button } from "@ui-kitten/components";
import InputForm from "../InputForm";
import CaptureModal from "./CaptureModal";

import logoImage from "@/assets/images/icon.png";

import { register } from "@/service/login";

import { SmsCodeType, type IRegister } from "@repo/api-interface";
import type { ThemedComponentProps } from "@ui-kitten/components";
import type { SubmitHandler } from "react-hook-form";

interface FormData extends IRegister {
  password2: string;
}
interface RegisterFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}
const RegisterForm: React.FC<RegisterFormProps> = ({ eva, className = "" }) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const router = useRouter();

  const [state, setState] = useState({
    index: 0,
    visible: false,
    countdown: 0,
    captchaSvg: "",
    capchaInput: "",
  });

  const [phoneNum] = watch(["phoneNum"]);

  const getCaptchaModal = async () => {
    const isVaild = await trigger(["phoneNum", "password", "password2"]);
    if (!isVaild) return;

    setState((prevState) => ({ ...prevState, visible: true }));
  };

  const handleRegister: SubmitHandler<FormData> = async (data) => {
    const { statusCode } = await register(data);
    if (statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "注册成功",
        text2: "请登录",
      });
      router.replace("/login");
    }
  };

  return (
    <View className={`h-full w-[95%] mx-auto bg-white ${className}`}>
      <View className="flex-1 w-[80%] mx-auto mt-[10%]">
        <Image
          source={logoImage}
          style={styles.imageContainer}
          contentFit="cover"
          transition={1000}
        />
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
          name="password"
          rules={{
            required: "请输入登录密码",
            pattern: {
              value: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
              message: "密码至少包含数字和英文, 长度6-20",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputForm
              className="mt-[20px] text-gray-500 tracking-widest"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="请输入登录密码"
              value={value}
            />
          )}
        />

        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password2"
          rules={{
            required: "请再次输入登录密码",
            pattern: {
              value: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
              message: "密码至少包含数字和英文, 长度6-20",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputForm
              className="mt-[20px] text-gray-500 tracking-widest"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="请再次输入登录密码"
              value={value}
            />
          )}
        />

        {errors.password2 && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.password2.message}
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
          className="mt-auto"
          onPress={handleSubmit(handleRegister)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "注册中..." : "注册"}
        </Button>
      </View>

      <CaptureModal
        phoneNum={phoneNum}
        smsType={SmsCodeType.REGISTER_CODE_KEY}
        visible={state.visible}
        close={(visible) => {
          setState((prevState) => ({ ...prevState, visible }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 96,
    height: 96,
    marginHorizontal: "auto",
    marginVertical: 20,
    marginBottom: 60,
  },
});

export default RegisterForm;
