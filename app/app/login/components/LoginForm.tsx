import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useState, useCallback } from "react";
import InputRadius from "@/app/components/InputRadius";
import { Button } from "@ui-kitten/components";

type FormData = { phoneNum: string; smsCode: string };

const LoginForm: React.FC = () => {
  const [countdown, setCountdown] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });

  const phoneNum = watch("phoneNum");

  // 处理获取验证码
  const handleGetCode = useCallback(async () => {
    if (countdown > 0) return;

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phoneNum)) {
      return;
    }

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
              value: /^\d{6}$/,
              message: "验证码为6位数字",
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
                maxLength={6}
              />
              <Pressable
                onPress={handleGetCode}
                disabled={countdown > 0 || !phoneNum || !!errors.phoneNum}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: "100%",
                  width: 120,
                }}
                className={`items-center justify-center rounded-md`}
              >
                <Text
                  className={`text-base ${
                    countdown > 0 || !phoneNum || !!errors.phoneNum
                      ? "text-gray-500"
                      : "text-white"
                  }`}
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
  );
};

export default LoginForm;
