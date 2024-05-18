import { defineStore } from "pinia";
import type { UserInfo } from ".";
import { useRoutes } from "@/hooks";
import { resetRouter } from "@/router";
import { useLayoutStore } from "./layout";
import { ref } from "vue";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const token = ref("");
    const userInfo = ref<UserInfo>({
      userId: "v10001",
      username: "visitor",
      sex: "男",
      email: "2456019588@qq.com",
      phone: "13377492843",
      avatar: "https://youngkbt.cn/public/img/default.png",
      roles: ["visitor"],
      registerTime: "2022-10-01 19:07:27",
    });
    const roles = ref<string[]>([]);

    const login = async ({ username, password }: { username: string; password: string }) => {
      // 调用登录接口，拿到 token，这里直接模拟 token
      console.log(username, password);
      const token = "admin-token";
      setToken(token);
      return true;
    };

    const logout = async () => {
      if (token.value === "") throw Error("LogOut: token is undefined!");
      resetRouter();
      setToken("");
      setRoles([]);
      const layoutStore = useLayoutStore();
      layoutStore.removeAllTabs();
      layoutStore.setKeepAliveName();
    };

    const getUserInfo = async () => {
      const userInfo: UserInfo = {
        userId: "v10001",
        username: "visitor",
        sex: "男",
        email: "2456019588@qq.com",
        phone: "13377492843",
        avatar: "https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
        roles: ["visitor"],
        registerTime: "2022-10-01 19:07:27",
      };
      const roles = userInfo.roles || ["admin"];
      setRoles(roles);
      setUserInfo(userInfo);
      return roles;
    };

    const resetToken = () => {
      setToken("");
      setRoles([]);
    };

    const changeRoles = async (rolesParam: string[]) => {
      // 模拟新的 token
      const token = rolesParam[0] + "-token";
      setToken(token);
      setRoles(rolesParam); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
      // await this.getUserInfo(token);
      resetRouter();
      useRoutes().initDynamicRouters(rolesParam);
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
      logout,
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
      paths: ["token"],
    },
  }
);
