import axios, { type AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

import useGlobalStore from "@/store";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const axiosInterface = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInterface.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterface.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const resStatus = error.response?.status;
    if (resStatus === 401) {
      await AsyncStorage.removeItem("authToken");
      useGlobalStore.getState().updateUserInfo(null);
      router.replace("/login");
      Toast.show({
        type: "info",
        text2: "登录已过期，请重新登录",
      });
    } else {
      Toast.show({
        type: "error",
        text1: error.response.data.message || "请求失败",
        topOffset: 60,
      });
    }
    return Promise.reject(error);
  }
);

const request = async <T>(
  config: AxiosRequestConfig
): Promise<API.BaseResponseType<T>> => {
  try {
    const { data } = await axiosInterface(config);
    return data || {};
  } catch (error) {
    return Promise.reject(error);
  }
};
export { axiosInterface };
export default request;
