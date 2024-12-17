export enum CacheEnum {
  // 获取短信验证码
  CAPTCHA_SMS_CODE_KEY = 'captcha_sms_codes:',
  // 登录短信验证码
  LOGIN_SMS_CODE_KEY = 'login_sms_codes:',
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
