import { ActivityLevel, Gender, SmsCodeType } from "../../enum/user.enum";

export interface ILoginReq {
  phoneNum: string;
  smsCode: string;
}

export interface IForgetPasswordReq extends ILoginReq {
  password: string;
}

export interface IChangePasswordReq extends ILoginReq {
  password: string;
  newPassword: string;
}

export interface ILoginByPasswordReq {
  phoneNum: string;
  password: string;
}

export interface IRegisterReq extends ILoginReq {
  password: string;
}

export interface ICaptchaReq {
  phoneNum: string;
  type: SmsCodeType;
}

export interface ISmsReq extends Pick<ILoginReq, "phoneNum"> {
  captcha: string;
  type: SmsCodeType;
}

export interface IUserHealthReq {
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
  gender: Gender;
}
