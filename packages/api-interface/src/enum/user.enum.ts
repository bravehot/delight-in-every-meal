export enum SmsCodeType {
  // 登录短信验证码
  LOGIN_CODE_KEY = "login_code",
  // 注册短信验证码
  REGISTER_CODE_KEY = "register_code",
  // 忘记密码短信验证码
  FORGET_PASSWORD_CODE_KEY = "forget_password_code",
  // 修改密码短信验证码
  CHANGE_PASSWORD_CODE_KEY = "change_password_code",
}

export enum ActivityLevel {
  SEDENTARY = "SEDENTARY", // 久坐（很少运动）： × 1.2
  LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE", // 轻度活动（每周 1-3 次轻量运动）： × 1.375
  MODERATELY_ACTIVE = "MODERATELY_ACTIVE", // 中等活动（每周 3-5 次中等运动）： × 1.55
  VERY_ACTIVE = "VERY_ACTIVE", // 高强度活动（每周 6-7 次高强度运动）： × 1.725
  EXTRA_ACTIVE = "EXTRA_ACTIVE", // 极高强度（运动员或重体力劳动者）： × 1.9
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
