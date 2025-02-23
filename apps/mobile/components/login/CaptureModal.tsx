import { useEffect, useState } from "react";
import { View } from "react-native";

import { Button, Modal } from "@ui-kitten/components";

interface ICaptureModalProps {
  visible: boolean;
  close?: (visible: boolean) => void;
  children?: React.ReactNode;
}
const CaptureModal: React.FC<ICaptureModalProps> = ({
  visible,
  close,
  children,
}) => {
  const [state, setState] = useState({ visible });

  useEffect(() => {
    setState((prevState) => ({ ...prevState, visible }));
  }, [visible]);

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
      <View className=" bg-white p-[20px] rounded-xl">{children}</View>
    </Modal>
  );
};

export default CaptureModal;
