import request from "@/utils/request";

import type {
  ICaptcha,
  ILogin,
  ILoginByPassword,
  IRegister,
  ISms,
} from "@repo/api-interface";

const getCaptcha = (params: ICaptcha) => {
  return request({
    url: "user/getCaptcha",
    method: "GET",
    params: params,
  });
};

const sendSms = (params: ISms) => {
  return request({
    url: "user/sendSms",
    method: "get",
    params,
  });
};

const register = (data: IRegister) => {
  return request({
    url: "user/register",
    method: "post",
    data,
  });
};

const loginByPassword = (data: ILoginByPassword) => {
  return request({
    url: "user/loginByPassword",
    method: "post",
    data,
  });
};

const loginBySms = (data: ILogin) => {
  return request({
    url: "user/login",
    method: "post",
    data,
  });
};

export { getCaptcha, sendSms, register, loginByPassword, loginBySms };
