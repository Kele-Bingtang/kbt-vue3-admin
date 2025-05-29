import type { RouteRecordRaw } from "vue-router";
import { isProxy, toRaw } from "vue";
import { ElNotification } from "element-plus";
import router from "@/router";
import { notFoundRouter, rolesRoutes } from "@/router/routesConfig";
import { useRouteStore, useUserStore } from "@/stores";
import { isValidURL, isType, isFunction } from "@/utils";
import { useCache } from "@/composables";
import SystemConfig, { HOME_NAME, LAYOUT_NAME, LOGIN_URL } from "@/config";
import { translateTitle } from "@/router/helper";

type BackendApi = () => RouterConfigRaw[] | Promise<RouterConfigRaw[]>;

// 扫描 views 下的所有组件
const modules = import.meta.glob("@/views/**/*.vue");

// Iframe 组件
const FrameView = () => import("@/layout/components/FrameLayout/FrameView.vue");
const FrameBlank = () => import("@/layout/components/FrameLayout/BlankFrame.vue");

export const useRoutes = () => {
  const { cacheDynamicRoutes } = SystemConfig.routerConfig;
  const routeStore = useRouteStore();
  const userStore = useUserStore();
  const { getDynamicRoutes, removeDynamicRoutes, setDynamicRoutes } = useCache();

  /**
   * 初始化动态路由
   *
   * @param roles 权限角色
   * @param api 接口
   */
  const initDynamicRoutes = async (roles?: string[], api?: BackendApi) => {
    const routeList = getDynamicRoutesFromStorage() || (api ? await getDynamicRoutesFromBackend(api) : rolesRoutes);

    if (routeList && routeList.length) return loadDynamicRoutes(routeList, roles || []);

    ElNotification.warning({
      title: "无权限访问",
      message: "当前账号无任何菜单权限，请联系系统管理员！",
      duration: 3000,
    });

    userStore.clearPermission();
    router.replace(LOGIN_URL);
    return Promise.reject("No permission");
  };

  /**
   * 从浏览器 storage 缓存获取动态路由
   */
  const getDynamicRoutesFromStorage = () => {
    if (cacheDynamicRoutes) return getDynamicRoutes();
    removeDynamicRoutes();
  };

  /**
   * 从后台接口获取动态路由
   */
  const getDynamicRoutesFromBackend = async (api: BackendApi) => {
    const routeList = await api();

    if (!routeList) return [];
    // 缓存路由
    if (cacheDynamicRoutes) setDynamicRoutes(routeList);

    return routeList;
  };

  /**
   * 加载动态路由
   *
   * @param routers 路由表信息
   * @param roles 权限角色
   * @param r 路由对象
   */
  const loadDynamicRoutes = (routers: RouterConfigRaw[], roles: string[], r = router) => {
    const rolesRoutes = filterOnlyRolesRoutes(routers, roles);
    const resolveRouters = processDynamicRoutes(processRouteMeta(rolesRoutes));
    // 传到 routeStore 持久化，并拿到扁平化的路由数组（所有二级以上的路由拍成一级，keep-alive 只支持到二级缓存（Layout 默认是一级，加起来就是二级））
    const flatRouteList = routeStore.loadPermissionRoutes(resolveRouters as RouterConfig[]);

    flatRouteList.forEach(flatRoute => {
      // 解除响应式
      const item = { ...flatRoute };

      // 防止加载 children 而不加载提取出来变成的一级路由
      if (item.children) item.children = [];
      // 加载动态路由时，子路由的 path 可能不带 /，这样会依赖父路由来拼接（vue-route 规则），但是 template 实现多级路由缓存，所以都拍成二级路由，则 path 加载时要求是完整的，不再放到父路由的 children 里
      item.path = item.meta._fullPath || item.path;

      if (!item.name || !r.hasRoute(item.name)) {
        // 当重置路由后，静态路由也需要二次添加
        if (item.meta.isFull || item.name === LAYOUT_NAME) r.addRoute(item as RouteRecordRaw);
        else r.addRoute(LAYOUT_NAME, item as RouteRecordRaw);
      }
    });

    // 最后添加 notFoundRouter
    if (!r.hasRoute(notFoundRouter.name)) router.addRoute(notFoundRouter as RouteRecordRaw);
  };

  /**
   * 过滤出当前系统角色的路由权限
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
   * 该系统角色是否有权限访问当前路由
   * roles 带有 * 的代表所有路由都能访问
   */
  const hasPermission = (router: RouterConfigRaw, roles: string[]) => {
    if (roles.includes("*")) return true;
    if (router.meta?.roles) return roles.some(role => router.meta?.roles?.includes(role));
    return true;
  };

  /**
   * 处理路由的 meta：拼接每个路由的完整路径 fullPath，处理国际化 title 显示，判断是否使用国际化
   *
   * @param routers 路由表
   * @param basePath 路由 fullPath
   * @returns 处理后的路由表
   */
  const processRouteMeta = (routers: RouterConfigRaw[], basePath = "/") => {
    routers.forEach(route => {
      const fullPath = route.path.startsWith("/") ? route.path : (basePath + "/" + route.path).replace(/\/+/g, "/");

      // 处理成后面布局要用到的 title。title 如果为函数，则只能访问时处理，这里无法处理
      if (route.meta) {
        const { title, useI18n, isKeepAlive, isFull, useTooltip } = route.meta;
        const {
          routeUseI18n,
          isKeepAlive: isKeepAliveGlobal,
          isFull: isFullGlobal,
          routeUseTooltip,
        } = SystemConfig.routerConfig;

        route.meta._fullPath = fullPath;
        // 这两个顺序不能互换，因为 translateTitle 函数需要 route.meta.useI18n
        if (useI18n === undefined && routeUseI18n !== undefined) route.meta.useI18n = routeUseI18n;
        if (!isFunction(title)) route.meta.title = translateTitle(title + "", route.name as string, route.meta.useI18n);

        if (isKeepAlive === undefined && isKeepAliveGlobal !== undefined) route.meta.isKeepAlive = isKeepAliveGlobal;
        if (isFull === undefined && isFullGlobal !== undefined) route.meta.isFull = isFullGlobal;
        if (useTooltip === undefined && routeUseTooltip !== undefined) route.meta.useTooltip = routeUseTooltip;
      }

      if (route.children && route.children.length) {
        if (isValidURL(fullPath)) route.children = processRouteMeta(route.children, "");
        else route.children = processRouteMeta(route.children, fullPath);
      }
    });

    return routers;
  };

  /**
   * 过滤动态路由，重新生成规范路由
   *
   * @param routers 路由
   */
  const processDynamicRoutes = (routers: RouterConfigRaw[]) => {
    if (!routers || !routers.length) return [];

    routers.forEach(r => {
      // 将 dynamic 属性加入 meta，标识此路由为动态路由
      if (r.meta) r.meta._dynamic = true;

      if (r.children?.length) {
        // 父级的 redirect 属性取值：如果子级存在且父级的 redirect 属性不存在，默认取第一个子级的 path；如果子级存在且父级的 redirect 属性存在，取存在的 redirect 属性，会覆盖默认值
        if (!r.redirect) r.redirect = (r.children[0].meta?._fullPath as string) || r.children[0].path;
        // 父级的 name 属性取值：如果子级存在且父级的 name 属性不存在，默认取第一个子级的 name；如果子级存在且父级的 name 属性存在，取存在的 name 属性，会覆盖默认值（注意：测试中发现父级的 name 不能和子级 name 重复，如果重复会造成重定向无效（跳转 404），所以这里给父级的name起名的时候后面会自动加上 `Parent`，避免重复）
        if (!r.name) r.name = (r.children[0].name as string) + "Parent";
      }

      if (r.meta?.frameOpen && r.meta.frameSrc && isValidURL(r.meta.frameSrc)) r.path = r.meta.frameSrc;
      else {
        if (r.meta?.frameKeepAlive) r.component = FrameBlank;
        else if (!r.meta?.frameKeepAlive && r.meta?.frameSrc) r.component = FrameView;
        else {
          // 如果动态路由的 component 存在且为 string，则必须是 views 下的目录，以 / 分割，如果/home/index，则是 views/home/index.vue 组件，如果不存在 component，则读取 path 来获取 component
          if (r.component) {
            if (isType(r.component) === "string") r.component = modules["/src/views" + r.component + ".vue"];
          } else r.component = modules["/src/views" + r.path + ".vue"];
        }
      }

      if (r.children?.length) processDynamicRoutes(r.children);
    });
    return routers;
  };

  /**
   * 扁平化数组对象，将多级嵌套路由处理成一维数组（主要用来处理路由菜单）
   *
   * @param routeList 所有路由表
   */
  const filterFlatRoutes = (routeList: RouterConfig[]) => {
    return routeList.reduce((pre: RouterConfig[], current: RouterConfig) => {
      let flatArr = [...pre, current];
      if (current.children) flatArr = [...flatArr, ...filterFlatRoutes(current.children)];
      return flatArr;
    }, []);
  };

  /**
   * 按照路由中 meta 下的 rank 等级升序来排序路由（仅处理以及一级路由）
   *
   * @param routeList 路由表
   */
  const ascending = (routeList: any[]) => {
    routeList.forEach((r, index) => {
      if (!r.meta) r.meta = {};
      // 当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位
      if (r.name === HOME_NAME && !r.meta?.rank) r.meta.rank = 0;
      else if (handRank(r)) r.meta.rank = index + 2;
    });
    return routeList.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
      return a?.meta.rank - b?.meta.rank;
    });
  };

  /**
   * 过滤不需要的排序的路由
   */
  const handRank = (route: RouterConfigRaw) => {
    const { name, path, meta } = route;
    if (!meta?.rank || (meta?.rank === 0 && name !== HOME_NAME && path !== "/")) return true;
    return false;
  };

  /**
   * 查找 path 对应的路由信息
   *
   * @param routes 路由表
   * @param path 查找的 path
   */
  const findRouteByPath = (routes: RouterConfigRaw[], path: string): RouterConfigRaw | null => {
    let res = routes.find(item => item.path === path) || null;
    if (res) return isProxy(res) ? toRaw(res) : res;
    else {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].children instanceof Array && routes[i].children?.length) {
          res = findRouteByPath(routes[i].children || [], path);
          if (res) return isProxy(res) ? toRaw(res) : res;
        }
      }
      return null;
    }
  };

  /**
   * 查找 name 对应的路由信息
   *
   * @param routes 路由表
   * @param name 查找的 name
   */
  const findRouteByName = (routes: RouterConfigRaw[], name: string): RouterConfigRaw | null => {
    let res = routes.find(item => item.name === name) || null;
    if (res) return isProxy(res) ? toRaw(res) : res;
    else {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].children instanceof Array && routes[i].children?.length) {
          res = findRouteByName(routes[i].children || [], name);
          if (res) return isProxy(res) ? toRaw(res) : res;
        }
      }
      return null;
    }
  };

  /**
   * 通过 path 获取父级路由信息
   *
   * @param path 查找的 path，传入完整的 path，如 route.meta._fullPath
   * @param routes 路由表
   * @param target 返回的数组类型，all 表示返回父级路由，path 表示返回父级路由的 path，name 表示返回父级的 name
   */
  function findParentRoutesByPath(path: string, routes: RouterConfigRaw[], target: "all" | "path" | "name" = "all") {
    // 深度遍历查找
    function dfs(routes: RouterConfigRaw[], path: string, parents: RouterConfigRaw[] | string[]) {
      for (let i = 0; i < routes.length; i++) {
        const item = routes[i];
        // 找到 path 则返回父级 path
        if (item.path === path || item.meta?._fullPath === path) {
          if (target === "all") return parents as RouterConfigRaw[];
          else return parents as string[];
        }
        // children 不存在或为空则不递归
        if (!item.children || !item.children.length) continue;
        // 往下查找时将当前 target 入栈
        if (target === "all") (parents as RouterConfigRaw[]).push(item);
        if (target === "path") (parents as string[]).push(item.path);
        if (target === "name") (parents as string[]).push((item.name as string) || "");
        if (dfs(item.children, path, parents).length) {
          if (target === "all") return parents as RouterConfigRaw[];
          else return parents as string[];
        }
        // 深度遍历查找未找到时当前 path 出栈
        parents.pop();
      }
      // 未找到时返回空数组
      return [];
    }
    return dfs(routes, path, []);
  }

  return {
    initDynamicRoutes,
    loadDynamicRoutes,
    filterOnlyRolesRoutes,
    hasPermission,
    processRouteMeta,
    filterFlatRoutes,
    ascending,
    findRouteByPath,
    findRouteByName,
    findParentRoutesByPath,
  };
};
