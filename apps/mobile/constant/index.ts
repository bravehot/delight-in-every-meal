import { ActivityLevel } from "@repo/api-interface";

import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const stackDefaultOptions: NativeStackNavigationOptions = {
  headerBackTitle: "返回",
  headerTintColor: "#000", //text-gray-500
  headerTitleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    fontFamily: "AlibabaPuHuiTi",
  },
  headerBackTitleStyle: {},
};

const activityLevelMap = {
  [ActivityLevel.SEDENTARY]: "久坐（很少运动）",
  [ActivityLevel.LIGHTLY_ACTIVE]: "轻度活动（每周1-3次轻量运动）",
  [ActivityLevel.MODERATELY_ACTIVE]: "中等活动（每周3-5次中等运动）",
  [ActivityLevel.VERY_ACTIVE]: "高强度活动（每周6-7次高强度运动）",
  [ActivityLevel.EXTRA_ACTIVE]: "极高强度（运动员或重体力劳动者）",
} as const;

export { stackDefaultOptions, activityLevelMap };
