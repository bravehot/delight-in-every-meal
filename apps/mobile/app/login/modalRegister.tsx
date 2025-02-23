import { SafeAreaView } from "react-native-safe-area-context";

import RegisterForm from "@/components/login/RegisterForm";

const Modal: React.FC = () => {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 w-full bg-white">
      <RegisterForm />
    </SafeAreaView>
  );
};
export default Modal;
