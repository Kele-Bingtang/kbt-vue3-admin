import type { UserInfo } from "@/stores";
import request from "@/request";

export interface LoginParams {
  userName: string;
  password: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export const UserService = {
  // 登录
  login(params: LoginParams) {
    return request.post<http.Response<Token>>("/auth/login", params);
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<http.Response<UserInfo>>("/auth/getUserInfo");
  },
};
