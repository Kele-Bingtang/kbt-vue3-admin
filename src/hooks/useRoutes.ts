import router from "@/router";
import { HOME_NAME, LAYOUT_NAME, LOGIN_URL, notFoundRouter, rolesRoutes } from "@/router/routesConfig";
import { usePermissionStore, useUserStore } from "@/stores";
import { isExternal, isType } from "@/utils";
import { ElNotification } from "element-plus";
import settings from "@/config/settings";
import { useLayoutNoSetup } from "./useLayout";
import type { BackstageMenuList } from "@/api/menu";
import type { RouteRecordRaw } from "vue-router";
import { isProxy, toRaw } from "vue";
import { useCache } from "@/hooks";

const modules = import.meta.glob("@/views/**/*.vue");
const FrameView = () => import("@/layout/components/FrameLayout/FrameView.vue");
const FrameBlank = () => import("@/layout/components/FrameLayout/BlankFrame.vue");

export const useRoutes = () => {
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();
  const { getLayoutTitle } = useLayoutNoSetup();

  /**
   * @description 从后台拿到菜单，并转换成路由进行动态加载
   * @param roles 权限角色
   * @param api 接口
   */
  const initDynamicRouters = async (roles?: string[], api?: () => Promise<BackstageMenuList[]>) => {
    const { cacheDynamicRoutes } = settings;

    let routeList: RouterConfigRaw[] = [];
    let isCacheDynamicRoutes = false;
    // 先从缓存拿后台路由
    let cacheRoutes = useCache().getCacheDynamicRoutesKey();
    // 如果不开启缓存，但缓存路由存在，则清掉缓存里的路由和拿到的缓存路由
    if (!cacheDynamicRoutes && cacheRoutes) {
      useCache().removeCacheDynamicRoutesKey();
      cacheRoutes = "";
    }
    if (cacheRoutes) {
      routeList = JSON.parse(cacheRoutes);
      isCacheDynamicRoutes = true;
    } else if (api) routeList = getDynamicRouters(await api());
    else routeList = rolesRoutes;
    // else routeList = getDynamicRouters(await getMenuList()); // 请求后台拿到菜单，并处理成路由

    // 缓存后台路由
    if (cacheDynamicRoutes && !isCacheDynamicRoutes) useCache().setCacheDynamicRoutesKey(routeList);

    if (!routeList.length) {
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

    loadDynamicRouters(routeList, roles || settings.whiteList);
  };

  /**
   * @description 动态加载路由
   * @param routers 路由表信息
   * @param roles 权限角色
   * @param r 路由对象
   */
  const loadDynamicRouters = (routers: RouterConfigRaw[], roles: string[], r = router) => {
    const onlyRolesRoutes = filterOnlyRolesRoutes(routers, roles);
    const resolveRouters = processDynamicRoutes(processRouteMeta(onlyRolesRoutes));
    // 传到 permissionStore 持久化，并拿到扁平化的路由数组（所有二级以上的路由拍成一级，keep-alive 只支持到二级缓存（Layout 默认是一级，加起来就是二级））
    const flatRouteList = permissionStore.loadPermissionRoutes(resolveRouters as RouterConfig[]);
    flatRouteList.forEach(flatRoute => {
      const item = { ...flatRoute }; // 解除响应式
      item.children ? (item.children = []) : ""; // 防止加载 children 而不加载提取出来变成的一级路由
      item.path = (item.meta?._fullPath as string) || item.path; // 加载动态路由时，子路由的 path 可能不带 /，这样会依赖父路由来拼接（vue-route 规则），但是 template 实现多级路由缓存，所以都拍成二级路由，则 path 加载时要求是完整的，不再放到父路由的 children 里
      if (!item.name || !r.hasRoute(item.name)) {
        // 当重置路由后，静态路由也需要二次添加
        if (item.meta?.isFull || item.name === LAYOUT_NAME) r.addRoute(item as RouteRecordRaw);
        else r.addRoute(LAYOUT_NAME, item as RouteRecordRaw);
      }
    });
    // 最后添加 notFoundRouter
    if (!r.hasRoute(notFoundRouter.name)) router.addRoute(notFoundRouter as RouteRecordRaw);
  };
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
   * @description 处理路由的 meta：拼接每个路由的完整路径 fullPath，处理国际化 title 显示，判断是否使用国际化
   * @param routers 路由表
   * @param basePath 路由 fullPath
   * @returns 处理后的路由表
   */
  const processRouteMeta = (routers: RouterConfigRaw[], basePath = "/") => {
    routers.forEach(router => {
      const fullPath = router.path.startsWith("/") ? router.path : (basePath + "/" + router.path).replace(/\/+/g, "/");
      // 处理成后面布局要用到的 title。title 如果为函数，则涉及到当前路由，所以这里无法处理
      if (router.meta) {
        const { useI18n, isKeepAlive, isFull, useTooltip } = router.meta;
        const { routeUseI18n, isKeepAlive: keepAlive, isFull: full, routeUseTooltip } = settings;
        router.meta._fullPath = fullPath;
        // 这两个顺序不能互换，因为 getLayoutTitle 函数需要 useI18n
        if (useI18n === undefined && routeUseI18n !== undefined) router.meta.useI18n = routeUseI18n;
        router.meta.title = getLayoutTitle(router);
        if (isKeepAlive === undefined && keepAlive !== undefined) router.meta.isKeepAlive = keepAlive;
        if (isFull === undefined && full !== undefined) router.meta.isFull = full;
        if (useTooltip === undefined && routeUseTooltip !== undefined) router.meta.useTooltip = routeUseTooltip;
      }
      if (router.children && router.children.length) {
        if (isExternal(fullPath)) router.children = processRouteMeta(router.children, "");
        else router.children = processRouteMeta(router.children, fullPath);
      }
    });
    return routers;
  };
  /**
   * @description 过滤动态路由，重新生成规范路由
   * @param routers 路由
   * @returns routers
   */
  const processDynamicRoutes = (routers: RouterConfigRaw[]) => {
    if (!routers || !routers.length) return [];
    routers.forEach(r => {
      // 将 dynamic 属性加入 meta，标识此路由为动态路由
      r.meta && ((r.meta._dynamic as boolean) = true);
      if (r?.children && r.children.length) {
        // 父级的 redirect 属性取值：如果子级存在且父级的 redirect 属性不存在，默认取第一个子级的 path；如果子级存在且父级的 redirect 属性存在，取存在的 redirect 属性，会覆盖默认值
        if (!r.redirect) r.redirect = (r.children[0].meta?._fullPath as string) || r.children[0].path;
        // 父级的 name 属性取值：如果子级存在且父级的 name 属性不存在，默认取第一个子级的 name；如果子级存在且父级的 name 属性存在，取存在的 name 属性，会覆盖默认值（注意：测试中发现父级的 name 不能和子级 name 重复，如果重复会造成重定向无效（跳转 404），所以这里给父级的name起名的时候后面会自动加上 `Parent`，避免重复）
        if (!r.name) r.name = (r.children[0].name as string) + "Parent";
      }

      if (r.meta?.frameOpen && r.meta?.frameSrc && isExternal(r.meta?.frameSrc)) {
        r.path = r.meta?.frameSrc;
      } else {
        if (r.meta?.frameKeepAlive) r.component = FrameBlank;
        else if (!r.meta?.frameKeepAlive && r.meta?.frameSrc) r.component = FrameView;
        else {
          // 如果动态路由的 component 存在且为 string，则必须是 views 下的目录，以 / 分割，如果/home/index，则是 views/home/index.vue 组件，如果不存在 component，则读取 path 来获取 component
          if (r.component) {
            if (isType(r.component) === "string") r.component = modules["/src/views" + r.component + ".vue"];
          } else r.component = modules["/src/views" + r.path + ".vue"];
        }
      }
      if (r?.children && r.children.length) processDynamicRoutes(r.children);
    });
    return routers;
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
   * @description 扁平化数组对象，将多级嵌套路由处理成一维数组（主要用来处理路由菜单）
   * @param {Array} routeList 所有路由表
   * @return array
   */
  const filterFlatRoutes = (routeList: RouterConfig[]) => {
    return routeList.reduce((pre: RouterConfig[], current: RouterConfig) => {
      let flatArr = [...pre, current];
      if (current.children) flatArr = [...flatArr, ...filterFlatRoutes(current.children)];
      return flatArr;
    }, []);
  };
  /**
   * @description 按照路由中 meta 下的 rank 等级升序来排序路由（仅处理以及一级路由）
   * @param routeList 路由表
   * @returns
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
   * @description 过滤不需要的排序的路由
   */
  const handRank = (route: RouterConfigRaw) => {
    const { name, path, meta } = route;
    if (!meta?.rank || (meta?.rank === 0 && name !== HOME_NAME && path !== "/")) return true;
    return false;
  };
  /**
   * @description 查找 path 对应的路由信息
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
   * @description 查找 name 对应的路由信息
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
   * @description 通过 path 获取父级路由信息
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

  /**
   * 后台获取菜单，然后转成路由需要的信息
   *
   * 这里搭配后台返回菜单进行处理，从后台获取的是扁平化的菜单，通过 MenuCode 和 parentMenuCode 进行多级关联，如后台返回：
		[
			{
				menuUrl: "/components",
				menuCode: "Components",
				menuName: "组件",
				parentMenuCode: "", // 代表一级菜单
				imageIcon: "Opportunity",
				sel: 1
			},
			{
				menuUrl: "message",
				menuCode: "MessageDemo",
				pagePath: "/components/message/index",
				menuName: "消息组件",
				parentMenuCode: "Components", // 和上面的 menuCode 关联
				imageIcon: "StarFilled",
				sel: 2
			},
		]

   * 该函数处理后返回：
		{
			path: "/components",
			name: "Components",
			meta: { title: "组件", icon: "Opportunity", rank: 1 },
			children: [
				{
					path: "message",
					name: "MessageDemo",
					component: "/components/message/index",
					meta: { title: "消息组件", icon: "StarFilled", rank: 2 },
				},
			]
		}
   * @param routerList 后台返回的路由
   * @param menuCode 菜单 code，等价于路由的 name
   * @returns 路由表信息
   */
  const getDynamicRouters = (routerList: BackstageMenuList[], menuCode = "") => {
    const dynamicRouterList: RouterConfigRaw[] = [];
    routerList.forEach(item => {
      if (item.parentMenuCode === menuCode) {
        const children = getDynamicRouters(
          routerList.filter(v => v.menuCode !== menuCode),
          item.menuCode
        );
        const menu: RouterConfigRaw = {
          path: item.menuUrl,
          name: item.menuName,
          component: item.pagePath,
          meta: {
            _dynamic: true,
            _fullPath: "",
            title: item.menuName,
            icon: item.imageIcon,
            rank: item.seq,
          },
        };
        if (children.length) dynamicRouterList.push({ ...menu, children });
        else dynamicRouterList.push({ ...menu });
      }
    });
    return dynamicRouterList;
  };

  return {
    getDynamicRouters,
    initDynamicRouters,
    loadDynamicRouters,
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
