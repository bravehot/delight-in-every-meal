import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useSetState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import { Button, Card, Modal, withStyles } from "@ui-kitten/components";

import InputRadius from "@/app/components/InputForm";

import type { ThemedComponentProps } from "@ui-kitten/components";

type FormData = { phoneNum: string; smsCode: string };

interface LoginFormProps extends ThemedComponentProps<"View"> {}

const LoginForm: React.FC<LoginFormProps> = ({ eva }) => {
  const [countdown, setCountdown] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const [state, setState] = useSetState({ visible: false });

  const phoneNum = watch("phoneNum");

  // 处理获取验证码
  const handleGetCode = useCallback(async () => {
    if (errors.phoneNum || countdown > 0) return;

    try {
      // TODO: 调用发送验证码 API
      // await sendSmsCode(phoneNum);

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("发送验证码失败:", error);
    }
  }, [phoneNum, countdown]);

  // 表单提交函数
  const onSubmit = async (data: FormData) => {
    try {
      // TODO: 调用登录 API
      console.log(data);
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  return (
    <>
      <View style={{ padding: 20 }} className="flex h-full">
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
            <InputRadius
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="请输入中国大陆手机号"
              value={value}
              maxLength={11}
            />
          )}
        />

        {errors.phoneNum && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.phoneNum.message}
          </Text>
        )}

        <View className="mt-4">
          <Controller
            control={control}
            name="smsCode"
            rules={{
              required: "请输入短信验证码",
              pattern: {
                value: /^\d{4}$/,
                message: "验证码为4位数字",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <InputRadius
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="请输入短信验证码"
                  value={value}
                  maxLength={4}
                />
                <Pressable
                  onPress={handleGetCode}
                  disabled={countdown > 0 || !phoneNum || !!errors.phoneNum}
                  className={`items-center justify-center rounded-md absolute right-0 top-0 h-full w-[120px]`}
                >
                  <Text
                    className={`text-base font-medium`}
                    style={{
                      color: eva?.theme?.["color-primary-500"] || "#FB923C",
                    }}
                  >
                    {countdown > 0 ? `${countdown}s后重试` : "获取验证码"}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        </View>

        {errors.smsCode && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.smsCode.message}
          </Text>
        )}

        <Button
          className="mt-auto mb-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-white">
            {isSubmitting ? "登录中..." : "登录/注册"}
          </Text>
        </Button>
      </View>

      <Modal
        visible={state.visible}
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onBackdropPress={() => {
          setState({ visible: false });
        }}
      >
        <Card disabled={true}>
          <Text>请输入验证码</Text>
        </Card>
      </Modal>
    </>
  );
};

export default withStyles(LoginForm);
