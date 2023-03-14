import router from "@/router";
import { HOME_NAME, LOGIN_URL, notFoundRouter, rolesRoutes } from "@/router/routesConfig";
import { usePermissionStore } from "@/stores/permission";
import { isExternal, isType } from "@/utils/layout/validate";
import { ElNotification } from "element-plus";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";

const modules = import.meta.glob("@/views/**/*.vue");
const IFrame = () => import("@/layout/frameView.vue");

export const useRoutes = () => {
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();

  /**
   * @description 手动处理动态路由，不需要传参
   */
  const beforeInitDynamicRouter = async (roles?: string[]) => {
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
    if (!roles || !roles.length) {
      roles = await userStore.getUserInfo();
    }
    loadDynamicRouter(rolesRoutes, roles);
  };

  /**
   * @description 动态加载路由，需要传参
   */
  const loadDynamicRouter = (routers: RouterConfigRaw[], roles: string[], r = router) => {
    const onlyRolesRoutes = filterOnlyRolesRoutes(routers, roles);
    const resolveRouters = processAsyncRoutes(onlyRolesRoutes);
    // 传到 permissionStore 持久化
    permissionStore.loadRolesRoutes(resolveRouters);
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
   * @description 过滤动态路由 重新生成规范路由
   * @param routers 路由
   * @returns routers
   */
  function processAsyncRoutes(routers: RouterConfigRaw[]) {
    if (!routers || !routers.length) return [];
    const r = routers;
    r.forEach(v => {
      // 将 backstage 属性加入 meta，标识此路由为后端返回路由
      v.meta && (v.meta.backstage = true);
      // 父级的 redirect 属性取值：如果子级存在且父级的 redirect 属性不存在，默认取第一个子级的 path；如果子级存在且父级的 redirect 属性存在，取存在的 redirect 属性，会覆盖默认值
      if (v?.children && v.children.length && !v.redirect) v.redirect = v.children[0].path;
      // 父级的 name 属性取值：如果子级存在且父级的 name 属性不存在，默认取第一个子级的 name；如果子级存在且父级的 name 属性存在，取存在的 name 属性，会覆盖默认值（注意：测试中发现父级的 name 不能和子级 name 重复，如果重复会造成重定向无效（跳转 404），所以这里给父级的name起名的时候后面会自动加上 `Parent`，避免重复）
      if (v?.children && v.children.length && !v.name) v.name = (v.children[0].name as string) + "Parent";
      if (v.meta?.frameSrc) v.component = IFrame;
      else {
        if (v.component && isType(v.component) === "string") v.component = modules["/src/views" + v.component + ".vue"];
        // 如果动态路由的 component 存在且为 string，则必须是 views 下的目录，以 / 分割，如果/home/index，则是 views/home/index.vue 组件，如果不存在 component，则读取 path 来获取 component
        if (v.component) {
          if (isType(v.component) === "string") v.component = modules["/src/views" + v.component + ".vue"];
        } else v.component = modules["/src/views" + v.path + ".vue"];
      }
      if (v?.children && v.children.length) processAsyncRoutes(v.children);
    });
    return r;
  }

  /**
   * @description 过滤出当前系统角色的路由权限
   */
  const filterOnlyRolesRoutes = (routers: RouterConfigRaw[], roles: string[]) => {
    const rolesRoutes: RouterConfigRaw[] = [];
    routers.forEach(router => {
      const r = { ...router };
      if (hasPermission(r, roles)) {
        if (r.children && r.children.length) r.children = filterOnlyRolesRoutes(r.children, roles);
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
      if (router.children && router.children.length) {
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
        backstage: false,
      },
      component: () => {},
    };
    for (const route of routers) {
      if (route.children && route.children.length) {
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
    beforeInitDynamicRouter,
    loadDynamicRouter,
    filterOnlyRolesRoutes,
    hasPermission,
    getRouteFullPath,
    getHomeRoute,
    filterFlatRoutes,
    ascending,
  };
};
