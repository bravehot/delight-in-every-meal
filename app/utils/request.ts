import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

// 响应拦截器
axiosInterface.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("authToken");
      Toast.show({
        type: "info",
        text2: "登录已过期，请重新登录",
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
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default request;
