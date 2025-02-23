import { SafeAreaView } from "react-native-safe-area-context";

import ForgetPwdForm from "@/components/login/ForgetPwdForm";

const Modal: React.FC = () => {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 w-full bg-white">
      <ForgetPwdForm />
    </SafeAreaView>
  );
};
export default Modal;
