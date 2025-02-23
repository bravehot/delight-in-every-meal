import RegisterForm from "@/components/login/RegisterForm";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Modal: React.FC = () => {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 w-full bg-white">
      <RegisterForm />
    </SafeAreaView>
  );
};
export default Modal;
