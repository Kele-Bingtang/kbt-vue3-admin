import router from "@/router";
import { HOME_NAME, LOGIN_URL, notFoundRouter, rolesRoutes } from "@/router/routesConfig";
import { usePermissionStore } from "@/stores/permission";
import { isExternal, isType } from "@/utils/layout/validate";
import { ElNotification } from "element-plus";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";
import settings from "@/config/settings";
import { useLayoutNoSetup } from "./useLayout";
import type { BackstageMenuList } from "@/api/menu";

const modules = import.meta.glob("@/views/**/*.vue");
const IFrame = () => import("@/layout/frameView.vue");

export const useRoutes = () => {
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();
  const { getLayoutTitle } = useLayoutNoSetup();

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
    loadDynamicRouter(rolesRoutes, roles || settings.whiteList);
  };

  /**
   * @description 动态加载路由，需要传参
   */
  const loadDynamicRouter = (routers: RouterConfigRaw[], roles: string[], r = router) => {
    const onlyRolesRoutes = filterOnlyRolesRoutes(routers, roles);
    const resolveRouters = processAsyncRoutes(processRouteMeta(onlyRolesRoutes));
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
  const processAsyncRoutes = (routers: RouterConfigRaw[]) => {
    if (!routers || !routers.length) return [];
    routers.forEach(r => {
      // 将 _dynamic 属性加入 meta，标识此路由为后端返回路由
      r.meta && (r.meta._dynamic = true);
      // 父级的 redirect 属性取值：如果子级存在且父级的 redirect 属性不存在，默认取第一个子级的 path；如果子级存在且父级的 redirect 属性存在，取存在的 redirect 属性，会覆盖默认值
      if (r?.children && r.children.length && !r.redirect) r.redirect = r.children[0].path;
      // 父级的 name 属性取值：如果子级存在且父级的 name 属性不存在，默认取第一个子级的 name；如果子级存在且父级的 name 属性存在，取存在的 name 属性，会覆盖默认值（注意：测试中发现父级的 name 不能和子级 name 重复，如果重复会造成重定向无效（跳转 404），所以这里给父级的name起名的时候后面会自动加上 `Parent`，避免重复）
      if (r?.children && r.children.length && !r.name) r.name = (r.children[0].name as string) + "Parent";
      if (r.meta?.frameSrc) r.component = IFrame;
      else {
        if (r.component && isType(r.component) === "string") r.component = modules["/src/views" + r.component + ".vue"];
        // 如果动态路由的 component 存在且为 string，则必须是 views 下的目录，以 / 分割，如果/home/index，则是 views/home/index.vue 组件，如果不存在 component，则读取 path 来获取 component
        if (r.component) {
          if (isType(r.component) === "string") r.component = modules["/src/views" + r.component + ".vue"];
        } else r.component = modules["/src/views" + r.path + ".vue"];
      }
      if (r?.children && r.children.length) processAsyncRoutes(r.children);
    });
    return routers;
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
   * @description 该系统角色是否有权限访问当前路由
   * roles 带有 * 的代表所有路由都能访问
   */
  const hasPermission = (router: RouterConfigRaw, roles: string[]) => {
    if (roles.includes("*")) return true;
    if (router.meta && router.meta.roles) return roles.some(role => router.meta && router.meta?.roles?.includes(role));
    else return true; // 没有添加权限验证
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
        router.meta._fullPath = fullPath;
        // 这两个顺序不能互换，因为 getLayoutTitle 函数需要 useI18n
        router.meta.useI18n = router.meta.useI18n === undefined ? settings.routeUseI18n : router.meta.useI18n;
        router.meta.title = getLayoutTitle(router as RouteConfig);
      }
      if (router.children && router.children.length) {
        if (isExternal(fullPath)) router.children = processRouteMeta(router.children, "");
        else router.children = processRouteMeta(router.children, fullPath);
      }
    });
    return routers;
  };

  /**
   * @description
   * 用于找到路由列表中 name 为 home 的对象
   * 如果你的首页 name 不为 home，请更改
   */
  const getHomeRoute = (routers: RouterConfig[], homeName = "Home"): RouterConfig => {
    for (const route of routers) {
      if (route.name === homeName) return route;
      if (route.children && route.children.length) {
        const home = getHomeRoute(route.children, homeName);
        if (home && home.name) return home;
      }
    }
    return {} as RouterConfig;
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
    routeList.forEach((r, index) => {
      // 当 rank 不存在时，根据顺序自动创建，首页路由永远在第一位
      if (r.name === HOME_NAME && !r.meta?.rank) r.meta.rank = 0;
      else if (handRank(r)) r.meta.rank = index + 2;
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
   * @param menuList 后台返回的菜单
   * @param menuCode 菜单 code，等价于路由的 name
   * @returns 路由表信息
   */
  const getDynamicRouterList = (menuList: BackstageMenuList[], menuCode: string) => {
    const dynamicRouterList: RouterConfigRaw[] = [];
    menuList.forEach(item => {
      if (item.parentMenuCode === menuCode) {
        const children = getDynamicRouterList(
          menuList.filter(v => v.menuCode !== menuCode),
          item.menuCode
        );
        const menu = {
          path: item.menuUrl,
          name: item.menuUrl,
          component: item.pagePath,
          meta: {
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
    getDynamicRouterList,
    beforeInitDynamicRouter,
    loadDynamicRouter,
    filterOnlyRolesRoutes,
    hasPermission,
    processRouteMeta,
    getHomeRoute,
    filterFlatRoutes,
    ascending,
  };
};
