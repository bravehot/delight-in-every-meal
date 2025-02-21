import { create } from "zustand";

import type { ColorSchemeName } from "react-native";

type GlobalStore = {
  systemColorScheme: ColorSchemeName | undefined;
  updateSystemColorScheme: (
    systemColorScheme: GlobalStore["systemColorScheme"]
  ) => void;
};

const useGlobalStore = create<GlobalStore>((set) => ({
  systemColorScheme: undefined,
  updateSystemColorScheme: (newSystemColorScheme) =>
    set({ systemColorScheme: newSystemColorScheme }),
}));

export default useGlobalStore;
