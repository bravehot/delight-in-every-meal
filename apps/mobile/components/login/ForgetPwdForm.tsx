import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import InputForm from "../InputForm";
import CaptureModal from "./CaptureModal";
import logoImage from "@/assets/images/icon.png";

import { Button, type ThemedComponentProps } from "@ui-kitten/components";
import { SmsCodeType, type IForgetPasswordReq } from "@repo/api-interface";
import { forgetPassword } from "@/service/login";

import { passwordReg } from "@/utils";

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

  const { mutate: forgetPasswordMutate, isPending } = useMutation({
    mutationFn: forgetPassword,
  });

  const router = useRouter();
  const [state, setState] = useState({
    visible: false,
    countdown: 0,
    tabIndex: 0,
  });
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

  const handleSave = async (data: FormData) => {
    forgetPasswordMutate(data, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "密码修改成功",
          text2: "请重新登录",
        });
        router.replace("/login");
      },
    });
  };

  return (
    <View className={`h-[90%] w-[95%] m-auto bg-white ${className}`}>
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
              value: passwordReg,
              message: "密码至少包含数字、英文, 长度6-20",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputForm
              className="mt-[20px] text-gray-500 tracking-widest"
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="请输入登录密码"
              value={value}
              secureTextEntry={true}
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
          onPress={handleSubmit(handleSave)}
          disabled={isSubmitting || isPending}
        >
          {isPending || isSubmitting ? "保存中..." : " 保存"}
        </Button>
      </View>

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

const styles = StyleSheet.create({
  imageContainer: {
    width: 96,
    height: 96,
    marginHorizontal: "auto",
    marginVertical: 20,
    marginBottom: 60,
  },
});

export default ForgetPwdForm;
