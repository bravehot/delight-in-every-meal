import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, withStyles } from "@ui-kitten/components";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import InputForm from "@/components/InputForm";

import { loginByPassword } from "@/service/login";
import useGlobalStore from "@/store";

import type { ThemedComponentProps } from "@ui-kitten/components";
import type { ILoginByPasswordReq } from "@repo/api-interface";

type FormData = ILoginByPasswordReq;

interface LoginFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}

const LoginPwdForm: React.FC<LoginFormProps> = ({ eva, className = "" }) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const { updateUserInfo } = useGlobalStore();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: loginRes } = await loginByPassword(data);
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
            keyboardType="default"
            secureTextEntry={true}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="请输入登录密码"
            value={value}
          />
        )}
      />

      <View className="w-full mt-1 flex flex-row items-center justify-between text-sm">
        <Text className="text-red-500 text-sm flex-shrink" numberOfLines={1}>
          {errors.password ? errors.password.message : ""}
        </Text>
        <Link asChild href={"/login/modalForgetPwd"}>
          <Pressable>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              忘记密码
            </Text>
          </Pressable>
        </Link>
      </View>

      <Button
        className="mt-[20px]"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text className="text-white">
          {isSubmitting ? "登录中..." : "登录"}
        </Text>
      </Button>
    </View>
  );
};

export default withStyles(LoginPwdForm);
