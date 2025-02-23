import { create } from "zustand";

import type { ColorSchemeName } from "react-native";
import type { IUserInfoRes } from "@repo/api-interface";

type GlobalStore = {
  systemColorScheme: ColorSchemeName | undefined;
  updateSystemColorScheme: (
    systemColorScheme: GlobalStore["systemColorScheme"]
  ) => void;

  userInfo: IUserInfoRes | null;
  updateUserInfo: (userInfo: GlobalStore["userInfo"]) => void;
};

const useGlobalStore = create<GlobalStore>((set) => ({
  systemColorScheme: undefined,
  updateSystemColorScheme: (newSystemColorScheme) =>
    set({ systemColorScheme: newSystemColorScheme }),

  userInfo: null,
  updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
}));

export default useGlobalStore;
