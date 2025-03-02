import { create } from "zustand";

import type { ColorSchemeName } from "react-native";
import type { IUserHealthRes, IUserInfoRes } from "@repo/api-interface";

type GlobalStore = {
  systemColorScheme: ColorSchemeName | undefined;
  updateSystemColorScheme: (
    systemColorScheme: GlobalStore["systemColorScheme"]
  ) => void;

  userInfo: IUserInfoRes | null;
  updateUserInfo: (userInfo: GlobalStore["userInfo"]) => void;

  userHealth: IUserHealthRes | null;
  updateUserHealth: (userHealth: GlobalStore["userHealth"]) => void;
};

const useGlobalStore = create<GlobalStore>((set) => ({
  systemColorScheme: undefined,
  updateSystemColorScheme: (newSystemColorScheme) =>
    set({ systemColorScheme: newSystemColorScheme }),

  userInfo: null,
  updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),

  userHealth: null,
  updateUserHealth: (newUserHealth) => set({ userHealth: newUserHealth }),
}));

export default useGlobalStore;
