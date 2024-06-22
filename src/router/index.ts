import { NProgress } from "@/utils";
import settings from "@/config/settings";
import { useRoutes } from "@/hooks";
import { usePermissionStore, useUserStore } from "@/stores";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from "vue-router";
import { constantRoutes, LOGIN_NAME, LOGIN_URL } from "./routesConfig";

const router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_MODE),
  routes: [...constantRoutes] as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description 重置路由
 **/
export function resetRouter(retainConstantRoutes = false) {
  const permissionStore = usePermissionStore();
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && name !== LOGIN_NAME) {
      retainConstantRoutes ? meta?._dynamic && router.removeRoute(name) : router.removeRoute(name);
    }
  });

  permissionStore.$patch({
    loadedRouteList: [],
    flatRouteList: [],
  });
}

const whiteList = settings.whiteList;

/**
 * @description 路由拦截 beforeEach
 **/
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const { initDynamicRouters } = useRoutes();
  const token = userStore.token;

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
      await initDynamicRouters(["*"]);
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
      await initDynamicRouters(roles);
      return next({ ...to, replace: true });
    } catch (error) {
      userStore.resetToken();
      router.replace(LOGIN_URL);
      return Promise.reject(error);
    }
  }
  next();
});

/**
 * @description 路由跳转结束
 **/
router.afterEach(() => {
  NProgress.done();
});

/**
 * @description 路由跳转错误
 **/
router.onError(error => {
  NProgress.done();
  console.warn("路由错误", error.message);
});

export default router;

/**
 * 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html
 * @param routerHistory 路由的历史模式
 */
function getHistoryMode(routerHistory: string): RouterHistory {
  if (!routerHistory) return createWebHistory("");
  // len 为 1 代表只有历史模式 为 2 代表历史模式中存在 base 参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  if (historyMode.length === 1) {
    if (leftMode === "hash") return createWebHashHistory("");
    else if (leftMode === "h5") return createWebHistory("");
  } else if (historyMode.length === 2) {
    if (leftMode === "hash") return createWebHashHistory(rightMode.trim());
    else if (leftMode === "h5") return createWebHistory(rightMode.trim());
  }
  return createWebHistory("");
}
