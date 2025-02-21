import { View, Text } from "react-native";

import type { ThemedComponentProps } from "@ui-kitten/components";

interface LoginFormProps extends ThemedComponentProps<"View"> {
  className?: string;
}
type FormData = { phoneNum: string; password: string };

const LoginPwdForm: React.FC<LoginFormProps> = ({ eva, className }) => {
  return (
    <View className={`flex h-full p-[20px] ${className}`}>
      <Text>LoginPwdForm</Text>
    </View>
  );
};

export default LoginPwdForm;
