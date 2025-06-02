import type { RouteRecordRaw, RouterHistory } from "vue-router";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { NProgress } from "@/utils";
import { staticRoutes } from "./routes-config";
import { beforeEach } from "./guards/before-each";
import { afterEach } from "./guards/after-each";
import { useRouteStore } from "@/stores";
import { LOGIN_NAME } from "@/config";

/**
 * 初始化路由
 */
export const initRouter = () => {
  const router = createRouter({
    history: getHistoryMode(),
    routes: [...staticRoutes] as RouteRecordRaw[],
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  // 路由前置守卫
  beforeEach(router);
  // 路由后置守卫
  afterEach(router);

  /**
   * 路由跳转错误
   **/
  router.onError(error => {
    NProgress.done();
    console.warn("路由错误", error.message);
  });

  return router;
};

const router = initRouter();

export default router;

/**
 * 获取路由历史模式
 */
function getHistoryMode(): RouterHistory {
  const routerMode = import.meta.env.VITE_ROUTER_MODE;
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || "";
  if (!routerMode) return createWebHistory(publicPath);

  // len 为 1 代表只有历史模式 为 2 代表历史模式中存在 base 参数
  const historyMode = routerMode.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];

  if (historyMode.length === 1) {
    if (leftMode === "hash") return createWebHashHistory(publicPath);
    else if (leftMode === "h5") return createWebHistory(publicPath);
  } else if (historyMode.length === 2) {
    if (leftMode === "hash") return createWebHashHistory(rightMode.trim());
    else if (leftMode === "h5") return createWebHistory(rightMode.trim());
  }

  return createWebHistory(publicPath);
}

/**
 * 重置路由
 **/
export function resetRouter(retainStaticRoutes = false) {
  const routeStore = useRouteStore();

  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && name !== LOGIN_NAME) {
      retainStaticRoutes ? meta?._dynamic && router.removeRoute(name) : router.removeRoute(name);
    }
  });

  routeStore.$patch({
    loadedRouteList: [],
    flatRouteList: [],
  });
}
