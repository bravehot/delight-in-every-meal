import { Length, Matches, IsEnum, Min, Max } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { SmsCodeType } from 'src/types/enum';

export class LoginDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入中国大陆地区手机号' })
  phoneNum: string;

  @Length(4, 4, { message: '请输入短信验证码' })
  smsCode: string;
}

export class ForgetPasswordDto extends LoginDto {
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  newPassword: string;
}

export class LoginByPasswordDto extends PickType(LoginDto, ['phoneNum']) {
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  password: string;
}

export class RegisterDto extends PickType(LoginDto, ['phoneNum', 'smsCode']) {
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  password: string;
}

export class CaptchaDto extends PickType(LoginDto, ['phoneNum']) {
  @IsEnum(SmsCodeType)
  type: SmsCodeType;
}

export class SmsDto extends PickType(LoginDto, ['phoneNum']) {
  @Length(4, 4, { message: '请输入图形验证码' })
  captcha: string;

  @IsEnum(SmsCodeType)
  type: SmsCodeType;
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY', // 久坐（很少运动）： × 1.2
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE', // 轻度活动（每周 1-3 次轻量运动）： × 1.375
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE', // 中等活动（每周 3-5 次中等运动）： × 1.55
  VERY_ACTIVE = 'VERY_ACTIVE', // 高强度活动（每周 6-7 次高强度运动）： × 1.725
  EXTRA_ACTIVE = 'EXTRA_ACTIVE', // 极高强度（运动员或重体力劳动者）： × 1.9
}

export const ActivityLevelFactors = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
  [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
  [ActivityLevel.VERY_ACTIVE]: 1.725,
  [ActivityLevel.EXTRA_ACTIVE]: 1.9,
} as const;

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class UserHealthDto {
  @Min(50)
  @Max(300)
  height: number; // 身高（厘米）

  @Min(50)
  @Max(300)
  weight: number; // 体重（千克）

  @Min(1)
  @Max(100)
  // @Transform((value) => Number(value))
  age: number; // 年龄

  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel; // 活动水平

  @IsEnum(Gender)
  gender: Gender; // 性别
}
