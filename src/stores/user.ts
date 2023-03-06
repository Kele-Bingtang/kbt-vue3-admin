import { defineStore } from "pinia";
import type { UserInfo } from ".";
import { removeCacheToken, setCacheToken } from "@/utils/layout/cache";
import { useRoutes } from "@/hooks/useRoutes";
import { rolesRoutes } from "@/router/routes-config";
import router, { resetRouter } from "@/router";
import { useLayoutStore } from "./layout";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const token = ref("admin-token");
    const userInfo = ref<UserInfo>({
      userId: "v10001",
      username: "visitor",
      sex: "男",
      email: "2456019588@qq.com",
      phone: "13377492843",
      avatar: "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png",
      roles: ["visitor"],
      registerTime: "2022-10-01 19:07:27",
    });
    const roles = ref<string[]>([]);

    const login = () => {
      const token = "admin-token";
      setCacheToken(token);
      setToken(token);
    };

    const Logout = async () => {
      if (token.value === "") {
        throw Error("LogOut: token is undefined!");
      }
      removeCacheToken();
      resetRouter();

      const layoutStore = useLayoutStore();
      layoutStore.removeAllTabs();
      setToken("");
      setRoles([]);
    };

    const getUserInfo = async () => {
      const userInfo: UserInfo = {
        userId: "v10001",
        username: "visitor",
        sex: "男",
        email: "2456019588@qq.com",
        phone: "13377492843",
        avatar: "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png",
        roles: ["visitor"],
        registerTime: "2022-10-01 19:07:27",
      };
      const roles = userInfo.roles || ["admin"];
      setRoles(roles);
      setUserInfo(userInfo);
      return roles;
    };

    const resetToken = () => {
      removeCacheToken();
      setToken("");
      setRoles([]);
    };

    const changeRoles = async (rolesParam: string[]) => {
      // 模拟新的 token
      const token = rolesParam[0] + "-token";
      setToken(token);
      setCacheToken(token);
      setRoles(rolesParam); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
      // await this.getUserInfo(token);
      resetRouter();
      useRoutes().loadRouteList(rolesRoutes, rolesParam, router);
    };

    const setUserInfo = (userInfoParam: UserInfo) => {
      userInfo.value = userInfoParam;
    };

    const setToken = (tokenParam: string) => {
      token.value = tokenParam;
    };

    const setRoles = (rolesParam: string[]) => {
      roles.value = rolesParam;
    };

    return {
      token,
      userInfo,
      roles,

      login,
      Logout,
      getUserInfo,
      resetToken,
      changeRoles,
      setUserInfo,
      setToken,
      setRoles,
    };
  },
  {
    persist: {
      key: "kbt_userStore",
      storage: localStorage,
      paths: ["token"],
    },
  }
);
