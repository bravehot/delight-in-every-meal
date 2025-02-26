import request from "@/utils/request";

import type {
  ICaptchaReq,
  IGetCaptchaRes,
  ILoginByPasswordReq,
  ILoginReq,
  IRegisterReq,
  ISmsReq,
  IGetSmsCodeRes,
  IRegisterRes,
  ILoginRes,
  ILoginByPasswordRes,
} from "@repo/api-interface";

const getCaptcha = (params: ICaptchaReq) => {
  return request<IGetCaptchaRes>({
    url: "user/getCaptcha",
    method: "GET",
    params: params,
  });
};

const sendSms = (params: ISmsReq) => {
  return request<IGetSmsCodeRes>({
    url: "user/sendSms",
    method: "get",
    params,
  });
};

const register = (data: IRegisterReq) => {
  return request<IRegisterRes>({
    url: "user/register",
    method: "post",
    data,
  });
};

const loginByPassword = (data: ILoginByPasswordReq) => {
  return request<ILoginByPasswordRes>({
    url: "user/loginByPassword",
    method: "post",
    data,
  });
};

const loginBySms = (data: ILoginReq) => {
  return request<ILoginRes>({
    url: "user/login",
    method: "post",
    data,
  });
};

export { getCaptcha, sendSms, register, loginByPassword, loginBySms };
