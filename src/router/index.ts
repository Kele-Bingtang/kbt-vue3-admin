import NProgress from "@/config/nprogress";
import { useRoutes } from "@/hooks/useRoutes";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { constantRoutes, rolesRoutes } from "./routes-config";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes] as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description 重置路由
 **/
export function resetRouter() {
  const permissionStore = usePermissionStore();
  permissionStore.flatRouteList.forEach(route => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
}

const whiteList = ["*"];

/**
 * @description 路由拦截 beforeEach
 **/
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const token = userStore.token;
  const { loadRouteList } = useRoutes();

  NProgress.start();

  // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === "/login") {
    if (token) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 判断访问页面是否在路由白名单地址中，如果存在直接放行
  if (whiteList.includes("*")) {
    if (!permissionStore.isLoadedRoutes) {
      loadRouteList(rolesRoutes, ["*"], router);
      return next({ ...to, replace: true });
    }
    return next();
  } else if (whiteList.includes("next") || whiteList.includes(to.path)) return next();

  // 判断是否有 Token，没有重定向到 login
  if (!token) return next({ path: "/login", replace: true });

  // 判断是否存在角色或加载过路由，如果不存在，则加载路由
  if (!permissionStore.isLoadedRoutes) {
    try {
      const roles = await userStore.getUserInfo();
      loadRouteList(rolesRoutes, roles, router);
      return next({ ...to, replace: true });
    } catch (err) {
      userStore.resetToken();
      return next(`/login?redirect=${to.path}`);
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
