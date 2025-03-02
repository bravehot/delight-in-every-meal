import request from "@/utils/request";

import type {
  IUserHealthReq,
  IUserHealthRes,
  IUserInfoRes,
} from "@repo/api-interface";

const getUserInfo = () => {
  return request<IUserInfoRes>({
    url: "user/profile",
    method: "get",
  });
};

const getUserHealth = () => {
  return request<IUserHealthRes>({
    url: "user/getUserHealth",
    method: "get",
  });
};

const setUserHealth = (data: IUserHealthReq) => {
  return request<IUserHealthReq>({
    url: "user/setUserHealth",
    method: "post",
    data,
  });
};
export { getUserInfo, getUserHealth, setUserHealth };
