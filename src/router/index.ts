import NProgress from "@/config/nprogress";
import settings from "@/config/settings";
import { useRoutes } from "@/hooks/useRoutes";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import { ElNotification } from "element-plus";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { constantRoutes, LOGIN_URL, rolesRoutes } from "./routesConfig";

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
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?._dynamic) router.removeRoute(name);
  });
}

const whiteList = settings.whiteList;

/**
 * @description 路由拦截 beforeEach
 **/
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const { loadDynamicRouter } = useRoutes();
  const token = userStore.token;

  NProgress.start();
  // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === "/login") {
    if (token) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 判断访问页面是否在路由白名单地址中，如果存在直接放行
  if (whiteList.includes("*")) {
    if (!permissionStore.loadedRouteList.length) {
      loadDynamicRouter(rolesRoutes, ["*"], router);
      return next({ ...to, replace: true });
    }
    return next();
  } else if (whiteList.includes("next") || whiteList.includes(to.path)) return next();

  // 判断是否有 Token，没有重定向到 login
  if (!token) return next({ path: "/login", replace: true });

  if (!rolesRoutes.length) {
    ElNotification({
      title: "无权限访问",
      message: "当前账号无任何菜单权限，请联系系统管理员！",
      type: "warning",
      duration: 3000,
    });
    userStore.resetToken();
    router.replace(LOGIN_URL);
    return Promise.reject("No permission");
  }
  // 判断是否存在角色或加载过路由，如果不存在，则加载路由
  if (!permissionStore.loadedRouteList.length) {
    try {
      const roles = await userStore.getUserInfo();
      loadDynamicRouter(rolesRoutes, roles, router);
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
