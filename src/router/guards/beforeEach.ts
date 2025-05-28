import type { Router } from "vue-router";
import { NProgress } from "@/utils";
import { useRoutes } from "@/composables";
import { usePermissionStore, useUserStore } from "@/stores";
import SystemConfig from "@/config";
import { LOGIN_URL } from "../routesConfig";
import { resetRouter } from "..";

export const beforeEach = (router: Router) => {
  /**
   * @description 路由拦截 beforeEach
   **/
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    const { initDynamicRoutes } = useRoutes();
    const token = userStore.token;

    // 白名单
    const whiteList = SystemConfig.routerConfig.whiteList;

    NProgress.start();

    // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
    if (to.path === LOGIN_URL) {
      if (token) return next(from.fullPath);
      resetRouter();
      return next();
    }

    // 判断访问页面是否在路由白名单地址中，如果存在直接放行
    if (whiteList.includes("*")) {
      if (!permissionStore.loadedRouteList.length) {
        await initDynamicRoutes(["*"]);
        return next({ ...to, replace: true });
      }

      return next();
    } else if (whiteList.includes("next") || whiteList.includes(to.path)) return next();

    // 判断是否有 Token，没有重定向到 login
    if (!token) return next({ path: LOGIN_URL, replace: true });

    // 判断是否存在角色或加载过路由，如果不存在，则加载路由
    if (!permissionStore.loadedRouteList.length) {
      try {
        const roles = await userStore.getUserInfo();
        await initDynamicRoutes(roles);
        return next({ ...to, replace: true });
      } catch (error) {
        userStore.resetToken();
        router.replace(LOGIN_URL);
        return Promise.reject(error);
      }
    }
    next();
  });
};
