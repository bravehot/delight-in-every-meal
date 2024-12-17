import { Length, Matches } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class LoginRegisterDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入中国大陆地区手机号' })
  phoneNum: string;

  @Length(4, 4, { message: '请输入短信验证码' })
  smsCode: string;

  @Length(4, 4, { message: '请输入图形验证码' })
  captcha: string;
}

export class CaptchaDto extends PickType(LoginRegisterDto, ['phoneNum']) {}

export class SmsDto extends PickType(LoginRegisterDto, [
  'phoneNum',
  'captcha',
]) {}
