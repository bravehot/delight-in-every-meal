import request from "@/utils/request";
import { ICaptcha } from "@repo/api-interface";

const getCaptcha = (params: ICaptcha) => {
  return request({
    url: "user/getCaptcha",
    method: "GET",
    params: params,
  });
};

export { getCaptcha };
