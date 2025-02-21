import request from "@/utils/request";

const getCaptcha = () => {
  return request({
    url: "user/getCaptcha",
    method: "GET",
  });
};

export { getCaptcha };
