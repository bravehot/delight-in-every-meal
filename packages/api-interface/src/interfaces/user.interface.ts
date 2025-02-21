import { ActivityLevel, Gender, SmsCodeType } from "../enum/user.enum";

export interface ILogin {
  phoneNum: string;
  smsCode: string;
}

export interface IForgetPassword extends ILogin {
  password: string;
  newPassword: string;
}

export interface ILoginByPassword {
  phoneNum: string;
  password: string;
}

export interface IRegister extends ILogin {
  password: string;
}

export interface ICaptcha {
  phoneNum: string;
  type: SmsCodeType;
}

export interface ISms extends Pick<ILogin, "phoneNum"> {
  captcha: string;
  type: SmsCodeType;
}

export interface IUserHealth {
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
  gender: Gender;
}
