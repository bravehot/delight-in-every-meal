import { ActivityLevel, Gender, SmsCodeType } from "../../enum/user.enum";

export interface ILoginRes {
  accessToken: string;
  refreshToken: string;
  phoneNum: string;
  id: string;
  name: string | null;
  avatar: string | null;
  gender: string | null;
}

export type IRegisterRes = string;

export interface ICaptcha {
  phoneNum: string;
  type: SmsCodeType;
}

export interface ILoginByPasswordRes extends ILoginRes {}

export type IForgetPasswordRes = string;
export type IChangePasswordRes = string;
export type IGetSmsCodeRes = string;
export type IGetCaptchaRes = string;

export interface IUserInfoRes {
  phoneNum: string;
  id: string;
  name: string | null;
  avatar: string | null;
}

export interface ISetUserHealthRes {
  id: string;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
  tdee: number;
}
