import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";

import { Button, Modal } from "@ui-kitten/components";
import InputForm from "../InputForm";

import { axiosInterface } from "@/utils/request";
import { sendSms } from "@/service/login";

import type { SmsCodeType } from "@repo/api-interface";

interface ICaptureModalProps {
  visible: boolean;
  smsType: SmsCodeType;
  phoneNum: string | number;
  close?: (isVisible: boolean) => void;
  sendSuccess?: (isSuccess: boolean) => void;
}
const CaptureModal: React.FC<ICaptureModalProps> = ({
  visible,
  phoneNum,
  smsType,
  close,
}) => {
  const [state, setState] = useState({
    visible,
    captchaSvg: "",
    capchaInput: "",
  });

  useEffect(() => {
    setState((prevState) => ({ ...prevState, visible }));
    if (visible) {
      getCaptchaModal();
    }
  }, [visible]);

  const getCaptchaModal = async () => {
    if (!smsType || !phoneNum) return;

    try {
      const data: string = await axiosInterface({
        url: "user/getCaptcha",
        method: "get",
        params: {
          phoneNum,
          type: smsType,
        },
      });
      // 将 SVG 字符串转换为 base64 Data URI
      const svgBase64 = `data:image/svg+xml;base64,${Buffer.from(data).toString("base64")}`;
      setState((prevState) => ({
        ...prevState,
        captchaSvg: svgBase64,
      }));
    } catch (error) {
      console.log("transform base64 image error", error);
    }
  };

  const handleSend = async () => {
    if (!phoneNum || !smsType || !state.capchaInput) return;
    const { statusCode } = await sendSms({
      phoneNum: phoneNum.toString(),
      type: smsType,
      captcha: state.capchaInput,
    });
    if (statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "验证码发送成功",
      });
      close?.(false);
    }
  };

  return (
    <Modal
      visible={state.visible}
      backdropStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onBackdropPress={() => {
        setState((prevState) => ({ ...prevState, visible: false }));
        close?.(false);
      }}
      className="w-[75%]"
    >
      <View className=" bg-white p-[20px] rounded-xl">
        <Text className="mb-[10px] text-center text-sm text-gray-500">
          请输入图形验证码
        </Text>
        <View className="w-fullflex flex-row items-center">
          <Image
            source={{ uri: state.captchaSvg }}
            style={{
              width: 100,
              height: 40,
            }}
            contentFit="contain"
          />
          <View className="flex-1">
            <InputForm
              placeholder="请输入验证码"
              className="text-gray-500 tracking-widest text-sm"
              maxLength={4}
              value={state.capchaInput}
              onChangeText={(value) => {
                setState((prevState) => ({
                  ...prevState,
                  capchaInput: value.toString(),
                }));
              }}
            />
          </View>
        </View>
        <Button
          className="mt-[20px]"
          size="tiny"
          disabled={Boolean(state.capchaInput)}
          onPress={handleSend}
        >
          发送
        </Button>
      </View>
    </Modal>
  );
};

export default CaptureModal;
