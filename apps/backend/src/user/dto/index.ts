import { IsEnum, Length, Matches, Max, Min } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { SmsCodeType } from 'src/types/enum';

import {
  ActivityLevel,
  ICaptchaReq,
  IForgetPasswordReq,
  ILoginByPasswordReq,
  ILoginReq,
  IRegisterReq,
  ISmsReq,
  IUserHealthReq,
} from '@repo/api-interface';

export class LoginDto implements ILoginReq {
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入中国大陆地区手机号' })
  phoneNum: string;
  @Length(4, 4, { message: '请输入短信验证码' })
  smsCode: string;
}

export class ForgetPasswordDto extends LoginDto implements IForgetPasswordReq {
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  password: string;

  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  newPassword: string;
}

export class LoginByPasswordDto
  extends PickType(LoginDto, ['phoneNum'])
  implements ILoginByPasswordReq
{
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  password: string;
}

export class RegisterDto
  extends PickType(LoginDto, ['phoneNum', 'smsCode'])
  implements IRegisterReq
{
  @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, {
    message: '密码至少包含数字和英文, 长度6-20',
  })
  @Length(6, 20, { message: '请输入 6-20 位密码' })
  password: string;
}

export class CaptchaDto
  extends PickType(LoginDto, ['phoneNum'])
  implements ICaptchaReq
{
  @IsEnum(SmsCodeType)
  type: SmsCodeType;
}

export class SmsDto
  extends PickType(LoginDto, ['phoneNum'])
  implements ISmsReq
{
  @Length(4, 4, { message: '请输入图形验证码' })
  captcha: string;

  @IsEnum(SmsCodeType)
  type: SmsCodeType;
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

export class UserHealthDto implements IUserHealthReq {
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
