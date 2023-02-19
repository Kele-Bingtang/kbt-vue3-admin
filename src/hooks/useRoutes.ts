import { usePermissionStore } from "@/stores/permission";
import { isExternal, isType } from "@/utils/validate";
import type { Router } from "vue-router";

export const useRoutes = () => {
  /**
   * 动态加载路由
   */
  const loadRouteList = (routers: RouterConfigRaw[], roles: string[], router: Router) => {
    const onlyRolesRoutes = filterOnlyRolesRoutes(routers, roles);
    const permissionStore = usePermissionStore();
    permissionStore.loadRolesRoutes(onlyRolesRoutes);
    // 引入 views 文件夹下所有 vue 文件
    const modules = import.meta.glob("@/views/**/*.vue");
    permissionStore.flatRouteList.forEach(item => {
      item.children && delete item.children;
      if (item.component && isType(item.component) == "string") {
        item.component = modules["/src/views" + item.component + ".vue"];
      }
      if (item.meta.isFull) {
        router.addRoute(item);
      } else {
        router.addRoute("Layout", item);
      }
    });
  };

  /**
   * 过滤出当前系统角色的路由权限
   */
  const filterOnlyRolesRoutes = (routers: RouterConfigRaw[], roles: string[]) => {
    const rolesRoutes: RouterConfigRaw[] = [];
    routers.forEach(router => {
      const r = { ...router };
      if (hasPermission(r, roles)) {
        if (r.children && r.children.length !== 0) {
          r.children = filterOnlyRolesRoutes(r.children, roles);
        }
        rolesRoutes.push(r);
      }
    });
    return rolesRoutes;
  };

  /**
   * 该系统角色是否有权限访问当前路由
   * roles 带有 * 的代表所有路由都能访问
   */
  const hasPermission = (router: RouterConfigRaw, roles: string[]) => {
    if (roles.includes("*")) {
      return true;
    }
    if (router.meta && router.meta.roles) {
      return roles.some(role => router.meta && router.meta?.roles?.includes(role));
    } else {
      return true; // 没有添加权限验证
    }
  };

  /**
   * 父路由的完整 path（_fullPath）是本身的 path
   * 子路由的完整 path（_fullPath）是父路由的 path 加子路由的 path
   * _fullPath 放在 meta 里，因为避免开发人员需要用到 fullPath，所以加个 _ 代表关键字
   * 因为目前菜单的跳转是基于 path，如果你觉得下面函数计算完整的 path 比较麻烦，可以直接以 name 跳转：在 @/layout/components/SideMenu/SideMenuItemLink 里修改为 name 即可
   */
  const getRouteFullPath = (routers: RouterConfigRaw[], basePath = "/") => {
    let r = routers;
    return r.map(router => {
      if (!router.meta?._fullPath) {
        let { meta } = router;
        meta = meta || {};
        // 一级路由的 _fullPath 是自己的 path，如果 path 自带 /，则不需要路由拼接
        if (router.path.startsWith("/")) {
          meta._fullPath = router.path;
        } else {
          let fullPath = basePath + "/" + router.path;
          // 去掉多余的 /，保证 path 是合法的地址，合法如 /home/index，不合法如：//home//index
          meta._fullPath = fullPath.replace(/\/+/g, "/");
        }
        router.meta = meta;
      }
      if (router.children && router.children.length > 0) {
        // 如果是 http 链接，不需要路由拼接
        if (isExternal(router.meta._fullPath as string)) {
          router.children = getRouteFullPath(router.children, "");
        } else {
          router.children = getRouteFullPath(router.children, router.meta._fullPath as string);
        }
      }
      return router;
    });
  };

  /**
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
        let res = getHomeRoute(route.children, homeName);
        if (res && res.name) return res;
      } else {
        if (route.name === homeName) homeRoute = route;
      }
    }
    return homeRoute;
  };

  /**
   * @description 扁平化数组对象（主要用来处理路由菜单）
   * @param {Array} routeList 所有路由表
   * @return array
   */
  const getFlatArray = (routeList: RouterConfigRaw[]) => {
    let newRouteList: RouterConfigRaw[] = JSON.parse(JSON.stringify(routeList));
    return newRouteList.reduce((pre: RouterConfigRaw[], current: RouterConfigRaw) => {
      let flatArr = [...pre, current];
      if (current.children) flatArr = [...flatArr, ...getFlatArray(current.children)];
      return flatArr;
    }, []);
  };

  return {
    loadRouteList,
    filterOnlyRolesRoutes,
    hasPermission,
    getRouteFullPath,
    getHomeRoute,
    getFlatArray,
  };
};
