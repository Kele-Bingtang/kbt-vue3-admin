import router from "@/router";
import { HOME_NAME, notFoundRouter } from "@/router/routesConfig";
import { usePermissionStore } from "@/stores/permission";
import { isExternal, isType } from "@/utils/layout/validate";
import type { RouteRecordRaw } from "vue-router";

export const useRoutes = () => {
  const permissionStore = usePermissionStore();
  const modules = import.meta.glob("@/views/**/*.vue");

  /**
   * @description 动态加载路由
   */
  const loadRouteList = (routers: RouterConfigRaw[], roles: string[], r = router) => {
    const onlyRolesRoutes = filterOnlyRolesRoutes(routers, roles);
    permissionStore.loadRolesRoutes(onlyRolesRoutes);
    const resolveRouters = resolveRouteComponent(onlyRolesRoutes);
    resolveRouters.forEach(item => {
      if (!item.name || !r.hasRoute(item.name)) {
        if (item.meta?.isFull) r.addRoute(item as RouteRecordRaw);
        else r.addRoute("Layout", item as RouteRecordRaw);
      }
    });
    // 最后添加 notFoundRouter
    router.addRoute(notFoundRouter);
  };
  /**
   * @description
   * 引入 views 文件夹下所有 vue 文件
   * 支持 /home/index 格式，也支持 () => import() 格式
   * @param routers 路由
   * @returns
   */
  const resolveRouteComponent = (routers: RouterConfigRaw[]) => {
    const r = routers;
    return r.map(item => {
      if (item.children && item.children.length > 0) item.children = resolveRouteComponent(item.children);
      if (item.component && isType(item.component) === "string") {
        item.component = modules["/src/views" + item.component + ".vue"];
      }
      return item;
    });
  };

  /**
   * @description 过滤出当前系统角色的路由权限
   */
  const filterOnlyRolesRoutes = (routers: RouterConfigRaw[], roles: string[]) => {
    const rolesRoutes: RouterConfigRaw[] = [];
    routers.forEach(router => {
      const r = { ...router };
      if (hasPermission(r, roles)) {
        if (r.children && r.children.length !== 0) r.children = filterOnlyRolesRoutes(r.children, roles);
        rolesRoutes.push(r);
      }
    });
    return rolesRoutes;
  };

  /**
   * @description 该系统角色是否有权限访问当前路由
   * roles 带有 * 的代表所有路由都能访问
   */
  const hasPermission = (router: RouterConfigRaw, roles: string[]) => {
    if (roles.includes("*")) return true;
    if (router.meta && router.meta.roles) return roles.some(role => router.meta && router.meta?.roles?.includes(role));
    else return true; // 没有添加权限验证
  };

  /**
   * @description
   * 父路由的完整 path（_fullPath）是本身的 path
   * 子路由的完整 path（_fullPath）是父路由的 path 加子路由的 path
   * _fullPath 放在 meta 里，因为避免开发人员需要用到 fullPath，所以加个 _ 代表关键字
   * 因为目前菜单的跳转是基于 path，如果你觉得下面函数计算完整的 path 比较麻烦，可以直接以 name 跳转：在 @/layout/components/SideMenu/SideMenuItemLink 里修改为 name 即可
   */
  const getRouteFullPath = (routers: RouterConfigRaw[], basePath = "/") => {
    const r = routers;
    return r.map(router => {
      if (!router.meta?._fullPath) {
        const tempMeta = router.meta || {};
        // 一级路由的 _fullPath 是自己的 path，如果 path 自带 /，则不需要路由拼接
        if (router.path.startsWith("/")) tempMeta._fullPath = router.path;
        // 去掉多余的 /，保证 path 是合法的地址，合法如 /home/index，不合法如：//home//index
        else tempMeta._fullPath = (basePath + "/" + router.path).replace(/\/+/g, "/");
        router.meta = tempMeta;
      }
      if (router.children && router.children.length > 0) {
        // 如果是 http 链接，不需要路由拼接
        if (isExternal(router.meta._fullPath as string)) router.children = getRouteFullPath(router.children, "");
        else router.children = getRouteFullPath(router.children, router.meta._fullPath as string);
      }
      return router;
    });
  };

  /**
   * @description
   * 用于找到路由列表中 name 为 home 的对象
   * 如果你的首页 name 不为 home，请更改
   */
  const getHomeRoute = (routers: RouterConfig[], homeName = "home"): RouterConfig => {
    let homeRoute: RouterConfig = {
      path: "",
      meta: {
        _fullPath: "",
        __titleIsFunction__: false,
      },
      component: () => {},
    };
    for (const route of routers) {
      if (route.children && route.children.length > 0) {
        const res = getHomeRoute(route.children, homeName);
        if (res && res.name) return res;
      } else if (route.name === homeName) homeRoute = route;
    }
    return homeRoute;
  };

  /**
   * @description 扁平化数组对象（主要用来处理路由菜单）
   * @param {Array} routeList 所有路由表
   * @return array
   */
  const filterFlatRoutes = (routeList: RouterConfigRaw[]) => {
    return routeList.reduce((pre: RouterConfigRaw[], current: RouterConfigRaw) => {
      let flatArr = [...pre, current];
      if (current.children) flatArr = [...flatArr, ...filterFlatRoutes(current.children)];
      return flatArr;
    }, []);
  };

  /**
   * 按照路由中 meta 下的 rank 等级升序来排序路由（仅处理以及一级路由）
   * @param routeList 路由表
   * @returns
   */
  const ascending = (routeList: any[]) => {
    routeList.forEach((v, index) => {
      // 当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位
      if (v.name === HOME_NAME && !v.meta?.rank) v.meta.rank = 0;
      else if (handRank(v)) v.meta.rank = index + 2;
    });
    return routeList.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
      return a?.meta.rank - b?.meta.rank;
    });
  };

  const handRank = (routeList: RouterConfigRaw) => {
    const { name, path, meta } = routeList;
    if (!meta?.rank || (meta?.rank === 0 && name !== HOME_NAME && path !== "/")) return true;
    return false;
  };

  return {
    loadRouteList,
    filterOnlyRolesRoutes,
    hasPermission,
    getRouteFullPath,
    getHomeRoute,
    filterFlatRoutes,
    ascending,
  };
};
