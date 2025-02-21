export enum SmsCodeType {
  // 登录短信验证码
  LOGIN_CODE_KEY = 'login_code',
  // 注册短信验证码
  REGISTER_CODE_KEY = 'register_code',
  // 忘记密码短信验证码
  FORGET_PASSWORD_CODE_KEY = 'forget_password_code',
  // 修改密码短信验证码
  CHANGE_PASSWORD_CODE_KEY = 'change_password_code',
}

// 改为连续天数的积分
export const CHECK_IN_POINTS = {
  DAY_1: 1, // 第1天
  DAY_2: 1, // 第2天
  DAY_3: 3, // 第3天
  DAY_4: 4, // 第4天
  DAY_5: 5, // 第5天
  DAY_6: 5, // 第6天
  DAY_7: 7, // 第7天
} as const;

export type CheckInPointsType = typeof CHECK_IN_POINTS;
